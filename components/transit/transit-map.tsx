"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { select } from "d3-selection";
import { zoom, zoomIdentity, zoomTransform, type ZoomBehavior } from "d3-zoom";
import "d3-transition";
import { Maximize2, Minus, Plus } from "lucide-react";
import { readerState, type Graph } from "@/lib/graph";
import { useHydrated, useUnderstood } from "@/lib/progress";
import { zoneLabel } from "@/lib/phases";
import { STROKE, type AtlasStation, type TLine, type TransitMap as TMap, type TStation } from "./model";
import { litSegments, planTrip } from "./route";
import { mapHref, useTrip } from "./trip";
import { RouteCard } from "./route-card";
import { SearchBox } from "./search-box";
import { ZoneSwitch, type ZoneLink } from "./zone-switch";
import { ThemeSwitch } from "@/components/theme-switch";
import s from "./transit.module.css";

export type StationState = "done" | "ready" | "locked" | "planned";

const EASE_IN_OUT = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const GLYPH_W = 16;

// ?at= (the station you came back from) is read once, after hydration.
const noop = () => () => {};
const readAt = () => new URLSearchParams(window.location.search).get("at");

type Props = {
  graph: Graph;
  /** This zone's map. */
  map: TMap;
  /** Every zone's lines and edge lines, so a trip can cross zones. */
  lines: TLine[];
  edgeLines: Record<string, string[]>;
  info: Record<string, AtlasStation>;
  zones: ZoneLink[];
};

export function TransitMap({ graph, map, lines, edgeLines, info, zones }: Props) {
  const router = useRouter();
  const { understood } = useUnderstood();
  const hydrated = useHydrated();
  const { to: rawTo, setTo } = useTrip();
  const at = useSyncExternalStore(noop, readAt, () => null);
  const reduce = useReducedMotion();

  const byId = useMemo(() => new Map(map.stations.map(st => [st.id, st])), [map]);
  const lineById = useMemo(() => new Map(lines.map(l => [l.id, l])), [lines]);
  const segById = useMemo(() => new Map(map.segments.map(g => [g.id, g])), [map]);
  // A destination anywhere in the atlas, as long as a line reaches it.
  const rideable = useCallback((id: string) => !!info[id]?.readable && info[id].lines.length > 0, [info]);
  const to = rawTo && rideable(rawTo) ? rawTo : null;

  const stateOf = useCallback(
    (id: string): StationState => (info[id]?.readable ? readerState(graph, id, hydrated ? understood : new Set()) : "planned"),
    [info, graph, understood, hydrated],
  );

  const stops = useMemo(() => (to ? planTrip(graph, edgeLines, to) : []), [graph, edgeLines, to]);
  const lit = useMemo(() => (to ? litSegments(graph, edgeLines, stops) : []), [graph, edgeLines, stops, to]);
  const inTrip = useMemo(() => new Set(stops.map(x => x.id)), [stops]);

  // Where you are on the ride. Defaults to the station you came back from, else the first stop not yet visited.
  const [ride, setRide] = useState<{ to: string; i: number } | null>(null);
  const defaultIndex = useMemo(() => {
    if (!stops.length) return 0;
    const fromAt = at ? stops.findIndex(x => x.id === at) : -1;
    if (fromAt >= 0) return fromAt;
    const next = stops.findIndex(x => !(hydrated && understood.has(x.id)));
    return next === -1 ? stops.length - 1 : next;
  }, [stops, at, hydrated, understood]);
  const rideIndex = ride && ride.to === to ? ride.i : defaultIndex;

  const [lineFocus, setLineFocus] = useState<string | null>(null);
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);

  // ---------- camera (transform lives in d3, never in React state) ----------
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const viewRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const hoverRef = useRef(false);

  /** The part of the stage not covered by the route card. */
  const safeArea = useCallback(() => {
    const el = stageRef.current!;
    const w = el.clientWidth, h = el.clientHeight;
    const wide = w >= 900;
    return wide ? { x: 0, y: 0, w: w - 400, h } : { x: 0, y: 0, w, h: h * 0.52 };
  }, []);

  const fly = useCallback(
    (x0: number, y0: number, x1: number, y1: number, maxK = 1.35, minK = 0.45) => {
      const svg = svgRef.current, z = zoomRef.current;
      if (!svg || !z) return;
      const a = safeArea();
      const pad = 60;
      const k = Math.max(minK, Math.min(maxK, (a.w - pad * 2) / Math.max(1, x1 - x0), (a.h - pad * 2) / Math.max(1, y1 - y0)));
      const t = zoomIdentity.translate(a.x + a.w / 2 - ((x0 + x1) / 2) * k, a.y + a.h / 2 - ((y0 + y1) / 2) * k).scale(k);
      const sel = select(svg);
      if (reduce) z.transform(sel, t);
      else sel.transition().duration(520).ease(EASE_IN_OUT).call(z.transform, t);
    },
    [reduce, safeArea],
  );

  const flyToStation = useCallback(
    (id: string) => {
      const st = byId.get(id);
      const svg = svgRef.current, z = zoomRef.current;
      if (!st || !svg || !z) return;
      const a = safeArea();
      const k = Math.max(0.9, Math.min(1.4, zoomTransform(svg).k));
      const t = zoomIdentity.translate(a.x + a.w / 2 - st.x * k, a.y + a.h / 2 - st.y * k).scale(k);
      const sel = select(svg);
      if (reduce) z.transform(sel, t);
      else sel.transition().duration(520).ease(EASE_IN_OUT).call(z.transform, t);
    },
    [byId, reduce, safeArea],
  );

  const fitAll = useCallback(() => fly(40, 40, map.width - 40, map.height - 40, 1, 0.5), [fly, map.width, map.height]);

  useEffect(() => {
    const svg = svgRef.current!, view = viewRef.current!;
    const z = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 2.6])
      .on("zoom", e => {
        view.setAttribute("transform", e.transform.toString());
        if (hoverRef.current) {
          hoverRef.current = false;
          setHover(null);
        }
      });
    zoomRef.current = z;
    const sel = select(svg).call(z).on("dblclick.zoom", null);
    // First view: the whole map where it fits, else its left end (where trips start).
    const el = stageRef.current!;
    const wide = el.clientWidth >= 900;
    const availW = wide ? el.clientWidth - 400 : el.clientWidth;
    const availH = wide ? el.clientHeight : el.clientHeight * 0.62;
    const k = Math.max(0.5, Math.min(1, availW / map.width, availH / map.height));
    const tx = map.width * k < availW ? (availW - map.width * k) / 2 : 0;
    const ty = Math.max(0, (availH - map.height * k) / 2);
    z.transform(sel, zoomIdentity.translate(tx, ty).scale(k));
    return () => {
      sel.on(".zoom", null);
    };
  }, [map.width, map.height]);

  // A new trip: frame its route. Coming back from a station: frame that station.
  const framedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!to || framedFor.current === to) return;
    framedFor.current = to;
    const pts = stops.map(x => byId.get(x.id)!).filter(Boolean);
    if (!pts.length) return;
    if (at && pts.some(p => p.id === at)) {
      flyToStation(at);
      return;
    }
    const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    fly(Math.min(...xs) - 40, Math.min(...ys) - 70, Math.max(...xs) + 90, Math.max(...ys) + 50);
  }, [to, stops, byId, fly, flyToStation, at]);

  const goTo = useCallback(
    (i: number) => {
      if (!to || !stops.length) return;
      const j = Math.max(0, Math.min(stops.length - 1, i));
      const id = stops[j].id;
      // A stop drawn on another zone's map: ride on over there.
      if (!byId.has(id)) return router.push(mapHref(info[id].phase, to, id));
      setRide({ to, i: j });
      flyToStation(id);
    },
    [to, stops, byId, info, router, flyToStation],
  );

  const choose = useCallback(
    (id: string) => {
      const st = byId.get(id);
      if (st?.transfer) return router.push(mapHref(st.phase, to, id));
      if (!st?.readable || st.detached) return;
      framedFor.current = null;
      setRide(null);
      setTo(id);
    },
    [byId, to, router, setTo],
  );

  const pick = useCallback(
    (id: string) =>
      info[id].phase === map.phase ? choose(id) : router.push(mapHref(info[id].phase, id)),
    [info, map.phase, choose, router],
  );
  const searchable = useMemo(() => Object.entries(info).filter(([id]) => rideable(id)).map(([id, x]) => ({ id, ...x })), [info, rideable]);

  const showHover = (st: TStation) => {
    const svg = svgRef.current;
    const t = svg ? zoomTransform(svg) : undefined;
    if (!t) return;
    hoverRef.current = true;
    setHover({ id: st.id, x: st.x * t.k + t.x, y: (st.y - st.hh) * t.k + t.y });
  };

  // Keyboard users: bring a focused station into view if it's off screen.
  const onStationFocus = (st: TStation) => {
    const svg = svgRef.current, el = stageRef.current;
    const t = svg ? zoomTransform(svg) : undefined;
    if (!t || !el) return;
    const sx = st.x * t.k + t.x, sy = st.y * t.k + t.y;
    const a = safeArea();
    if (sx < 40 || sy < 40 || sx > a.w - 40 || sy > a.h - 40) flyToStation(st.id);
  };

  // ---------- drawing ----------
  const introDelay = useMemo(() => {
    const d = new Map<string, number>();
    const perLine = new Map<string, number>();
    map.segments.forEach(g => {
      const li = map.lines.findIndex(l => l.id === g.line);
      const n = perLine.get(g.line) ?? 0;
      perLine.set(g.line, n + 1);
      d.set(g.id, li * 90 + n * 45);
    });
    return d;
  }, [map]);

  const dimLine = (line: string) => (to ? true : lineFocus ? line !== lineFocus : false);
  const dimStation = (st: TStation) => (to ? !inTrip.has(st.id) : lineFocus ? !st.lines.includes(lineFocus) : false);
  const current = to ? byId.get(stops[rideIndex]?.id) : undefined;
  const dest = to ? byId.get(to) : undefined;
  const hovered = hover ? byId.get(hover.id) : undefined;
  const orderedStations = useMemo(() => [...map.stations].sort((a, b) => a.x - b.x || a.y - b.y), [map.stations]);

  return (
    <div className={s.mapShell}>
      <header className={s.bar}>
        <div className={s.brand}>
          <span className={s.brandMark} aria-hidden>
            <span />
          </span>
          <span>
            <b>AI engineering</b> <span className={s.brandSub}>metro</span>
          </span>
        </div>
        <ZoneSwitch zones={zones} phase={map.phase} to={to} />
        <SearchBox stations={searchable} phase={map.phase} lines={lines} stateOf={stateOf} onPick={pick} />
        <ThemeSwitch id="map" />
      </header>

      <div ref={stageRef} className={s.stage}>
        <svg ref={svgRef} className={s.svg} role="group" aria-label={`Metro map of ${zoneLabel(map.phase)}. Drag to pan, scroll to zoom.`}>
          <g ref={viewRef}>
            {map.later && (
              <g className={s.later} data-dim={!!to}>
                <text x={map.later.x - 10} y={map.later.y - 8} className={s.laterTitle}>
                  Opening later
                </text>
                <line x1={map.later.x - 10} x2={map.later.x + 420} y1={map.later.y} y2={map.later.y} />
              </g>
            )}

            <g>
              {map.segments.map(g => {
                const line = lineById.get(g.line)!;
                return (
                  <g key={g.id} className={s.seg} data-dim={dimLine(g.line)} style={{ "--intro": `${introDelay.get(g.id)}ms` } as React.CSSProperties}>
                    <path d={g.d} className={s.casing} pathLength={1} />
                    <path d={g.d} style={{ stroke: line.color }} strokeWidth={STROKE} className={s.track} pathLength={1} />
                  </g>
                );
              })}
            </g>

            {/* The route, lit along the line in riding order. */}
            <g key={to ?? "none"}>
              {lit.map(x => {
                const g = segById.get(x.id);
                if (!g) return null;
                return (
                  <path
                    key={x.id}
                    d={g.d}
                    strokeWidth={STROKE}
                    pathLength={1}
                    className={s.sweep}
                    style={{ stroke: lineById.get(g.line)!.color, "--d": `${x.order * 70}ms` } as React.CSSProperties}
                  />
                );
              })}
            </g>

            {map.labels.map(l => {
              const st = byId.get(l.id)!;
              return (
                <text
                  key={l.id}
                  className={s.label}
                  data-dim={dimStation(st)}
                  data-planned={!st.readable}
                  data-transfer={st.transfer}
                  data-dest={to === l.id}
                  transform={`translate(${l.x} ${l.y}) rotate(${l.rotate})`}
                  textAnchor={l.anchor}
                >
                  {l.rows.map((r, i) => (
                    <tspan key={i} x={0} dy={i ? 16 : 0}>
                      {r}
                      {st.transfer && i === l.rows.length - 1 && <tspan className={s.labelZone}> Zone {st.phase}</tspan>}
                    </tspan>
                  ))}
                </text>
              );
            })}

            {dest && (
              <motion.rect
                key={`dest-${dest.id}`}
                className={s.destRing}
                x={dest.x - GLYPH_W / 2 - 8}
                y={dest.y - dest.hh - 8}
                width={GLYPH_W + 16}
                height={dest.hh * 2 + 16}
                rx={GLYPH_W / 2 + 8}
                initial={{ opacity: 0, scale: 1.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0 }}
              />
            )}

            {orderedStations.map(st => {
              const state = stateOf(st.id);
              const w = GLYPH_W;
              const acts = st.readable || st.transfer;
              return (
                <g
                  key={st.id}
                  className={s.station}
                  data-state={state}
                  data-dim={dimStation(st)}
                  data-transfer={st.transfer}
                  transform={`translate(${st.x} ${st.y})`}
                  tabIndex={acts ? 0 : -1}
                  role={acts ? "button" : "img"}
                  aria-label={
                    st.transfer
                      ? `${st.name}. Change here for ${zoneLabel(st.phase)}.`
                      : `${st.name}. ${STATE_TEXT[state]}.${st.readable ? " Plan a trip here." : ""}`
                  }
                  onClick={() => choose(st.id)}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      choose(st.id);
                    }
                  }}
                  onFocus={() => onStationFocus(st)}
                  onPointerEnter={() => showHover(st)}
                  onPointerLeave={() => {
                    hoverRef.current = false;
                    setHover(null);
                  }}
                >
                  <rect className={s.hit} x={-22} y={-st.hh - 14} width={44} height={st.hh * 2 + 28} />
                  <rect className={s.halo} x={-w / 2 - 5} y={-st.hh - 5} width={w + 10} height={st.hh * 2 + 10} rx={w / 2 + 5} />
                  <rect className={s.glyph} x={-w / 2} y={-st.hh} width={w} height={st.hh * 2} rx={w / 2} />
                  <rect className={s.focus} x={-w / 2 - 7} y={-st.hh - 7} width={w + 14} height={st.hh * 2 + 14} rx={w / 2 + 7} />
                </g>
              );
            })}

            {current && (
              <motion.g
                className={s.here}
                initial={false}
                animate={{ x: current.x, y: current.y }}
                transition={reduce ? { duration: 0 } : { type: "spring", duration: 0.55, bounce: 0 }}
                aria-hidden
              >
                <rect x={-GLYPH_W / 2 - 11} y={-current.hh - 11} width={GLYPH_W + 22} height={current.hh * 2 + 22} rx={GLYPH_W / 2 + 11} />
              </motion.g>
            )}
          </g>
        </svg>

        {hovered && hover && (
          <div className={s.tip} style={{ left: hover.x, top: hover.y }} role="tooltip">
            <div className={s.tipLines}>
              {hovered.lines.map(l => (
                <span key={l} style={{ background: lineById.get(l)!.color }} />
              ))}
            </div>
            <b>{hovered.name}</b>
            <p>{hovered.note}</p>
            {hovered.transfer && <span className={s.tipZone}>Change here for {zoneLabel(hovered.phase)}</span>}
            <span className={s.tipState} data-state={stateOf(hovered.id)}>
              {STATE_TEXT[stateOf(hovered.id)]}
              {hovered.readable && ` · ${Math.max(1, Math.round(hovered.words / 230))} min`}
            </span>
          </div>
        )}

        <div className={s.zoomCtl}>
          <button type="button" aria-label="Zoom in" onClick={() => zoomRef.current && svgRef.current && zoomRef.current.scaleBy(select(svgRef.current).transition().duration(reduce ? 0 : 300), 1.3)}>
            <Plus size={16} />
          </button>
          <button type="button" aria-label="Zoom out" onClick={() => zoomRef.current && svgRef.current && zoomRef.current.scaleBy(select(svgRef.current).transition().duration(reduce ? 0 : 300), 1 / 1.3)}>
            <Minus size={16} />
          </button>
          <button type="button" aria-label="Show whole map" onClick={fitAll}>
            <Maximize2 size={15} />
          </button>
        </div>

        <Legend />
      </div>

      <RouteCard
        map={map}
        lineById={lineById}
        info={info}
        stops={stops}
        to={to}
        rideIndex={rideIndex}
        stateOf={stateOf}
        understood={hydrated ? understood : EMPTY}
        onRide={goTo}
        onClear={() => {
          framedFor.current = null;
          setTo(null);
          fitAll();
        }}
        lineFocus={lineFocus}
        onLineFocus={setLineFocus}
      />
    </div>
  );
}

const EMPTY: ReadonlySet<string> = new Set();

export const STATE_TEXT: Record<StationState, string> = {
  done: "Visited",
  ready: "Ready to visit",
  locked: "Earlier stops first",
  planned: "Planned station, opening later",
};

function Legend() {
  return (
    <div className={s.legend} aria-label="Key">
      <span data-k="done">
        <i /> Visited
      </span>
      <span data-k="ready">
        <i /> Ready
      </span>
      <span data-k="locked">
        <i /> Not yet
      </span>
      <span data-k="planned">
        <i /> Opening later
      </span>
    </div>
  );
}
