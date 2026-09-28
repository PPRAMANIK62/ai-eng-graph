"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ChevronDown, X } from "lucide-react";
import type { AtlasStation, TLine, TransitMap } from "./model";
import { minutes, type Stop } from "./route";
import { stationHref } from "./trip";
import type { StationState } from "./transit-map";
import s from "./transit.module.css";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

type Props = {
  map: TransitMap;
  /** Every zone's lines: a trip can ride lines drawn on other maps. */
  lineById: Map<string, TLine>;
  info: Record<string, AtlasStation>;
  stops: Stop[];
  to: string | null;
  rideIndex: number;
  stateOf: (id: string) => StationState;
  understood: ReadonlySet<string>;
  onRide: (i: number) => void;
  onClear: () => void;
  lineFocus: string | null;
  onLineFocus: (id: string | null) => void;
};

export function RouteCard({ map, lineById, info, stops, to, rideIndex, stateOf, understood, onRide, onClear, lineFocus, onLineFocus }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  // On phones the line list stays folded until asked for, so the map gets the room.
  const [linesOpen, setLinesOpen] = useState(false);
  const view = to && stops.length ? "trip" : "lines";
  const open = view === "trip" ? !collapsed : linesOpen;
  const toggleSheet = () => (view === "trip" ? setCollapsed(c => !c) : setLinesOpen(o => !o));
  const name = (id: string | null) => (id ? info[id].name : "");

  return (
    <aside className={s.card} data-view={view} data-collapsed={collapsed} data-lines-open={linesOpen} aria-label={view === "trip" ? "Your trip" : "Lines"}>
      <button type="button" className={s.sheetHandle} onClick={toggleSheet} aria-expanded={open} aria-label={open ? "Fold panel" : "Unfold panel"}>
        <span />
      </button>
      <AnimatePresence mode="wait" initial={false}>
        {view === "trip" && to ? (
          <motion.div
            key={`trip-${to}`}
            className={s.cardInner}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            <TripView
              {...{ stops, to, rideIndex, stateOf, understood, onRide, onClear, info, name }}
              phase={map.phase}
              line={lineById}
              collapsed={collapsed}
              onToggle={() => setCollapsed(c => !c)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="lines"
            className={s.cardInner}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            <div className={s.cardHead}>
              <p className={s.kicker}>Plan a trip</p>
              <h2 className={s.cardTitle}>Where to?</h2>
              <p className={s.cardLede}>Pick a station on the map or search for one. The route shows every stop you need first, in order.</p>
              <button type="button" className={s.sheetToggle} onClick={toggleSheet}>
                {linesOpen ? "Hide lines" : `See all ${map.lines.length} lines`} <ChevronDown size={14} style={{ rotate: linesOpen ? "180deg" : "0deg" }} />
              </button>
            </div>
            <div className={s.cardScroll}>
              <p className={s.kicker} style={{ marginBottom: 8 }}>
                {map.lines.length} lines
              </p>
              <ul className={s.lineList}>
                {map.lines.map(l => {
                  const count = new Set([...l.stations, ...l.branches.flat()]).size;
                  return (
                    <li key={l.id}>
                      <button
                        type="button"
                        className={s.lineRow}
                        data-on={lineFocus === l.id}
                        onPointerEnter={() => onLineFocus(l.id)}
                        onPointerLeave={() => onLineFocus(null)}
                        onFocus={() => onLineFocus(l.id)}
                        onBlur={() => onLineFocus(null)}
                        onClick={() => onLineFocus(lineFocus === l.id ? null : l.id)}
                      >
                        <span className={s.lineBar} style={{ background: l.color }} />
                        <span className={s.lineName}>{l.name}</span>
                        <span className={s.lineMeta}>
                          {name(l.stations[0])} → {name(l.stations[l.stations.length - 1])} · {count} stations
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

function TripView({
  stops,
  to,
  rideIndex,
  stateOf,
  understood,
  onRide,
  onClear,
  info,
  phase,
  line,
  name,
  collapsed,
  onToggle,
}: Omit<Props, "lineFocus" | "onLineFocus" | "map" | "lineById"> & {
  to: string;
  phase: number;
  line: Map<string, TLine>;
  name: (id: string | null) => string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const total = stops.reduce((m, x) => m + minutes(info[x.id].words), 0);
  const visited = stops.filter(x => understood.has(x.id));
  const left = stops.filter(x => !understood.has(x.id)).reduce((m, x) => m + minutes(info[x.id].words), 0);
  const current = stops[rideIndex];
  const changes = stops.filter(x => x.kind === "change" || x.kind === "back").length;

  return (
    <>
      <div className={s.cardHead}>
        <div className={s.tripTop}>
          <p className={s.kicker}>Trip to</p>
          <button type="button" className={s.iconBtn} onClick={onClear} aria-label="End trip">
            <X size={16} />
          </button>
        </div>
        <h2 className={s.cardTitle}>{name(to)}</h2>
        <p className={s.tripStats}>
          <span>
            <b>{stops.length}</b> {stops.length === 1 ? "stop" : "stops"}
          </span>
          <span>
            <b>{visited.length}</b> visited
          </span>
          <span>
            <b>{changes}</b> {changes === 1 ? "change" : "changes"}
          </span>
          <span>
            <b>{total}</b> min{visited.length > 0 && left > 0 ? ` · ${left} left` : ""}
          </span>
        </p>
        <div className={s.progress} aria-hidden>
          {stops.map(x => (
            <span key={x.id} data-on={understood.has(x.id)} style={{ background: understood.has(x.id) ? line.get(x.line ?? "")?.color : undefined }} />
          ))}
        </div>
        <button type="button" className={s.sheetToggle} onClick={onToggle}>
          {collapsed ? "Show stops" : "Hide stops"} <ChevronDown size={14} style={{ rotate: collapsed ? "180deg" : "0deg" }} />
        </button>
      </div>

      <ol className={s.stops} key={to}>
        {stops.map((x, i) => {
          const st = info[x.id];
          const l = x.line ? line.get(x.line) : undefined;
          const state = stateOf(x.id);
          const note =
            x.kind === "start"
              ? l && `Board the ${l.name}`
              : x.kind === "change"
                ? l && `Change to the ${l.name} at ${name(stops[i - 1].id)}`
                : x.kind === "back"
                  ? l && `Back to ${name(x.from)}, take the ${l.name}`
                  : x.kind === "also"
                    ? `Also start here${l ? `, on the ${l.name}` : ""}`
                    : null;
          return (
            <motion.li
              key={x.id}
              className={s.stop}
              data-current={i === rideIndex}
              data-state={state}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.08 + i * 0.04 }}
              style={{ "--c": l?.color ?? "var(--t-ink-3)", "--cn": (stops[i + 1]?.line && line.get(stops[i + 1].line!)?.color) || "var(--t-rule)" } as React.CSSProperties}
            >
              <span className={s.rail} data-first={i === 0} data-last={i === stops.length - 1} aria-hidden>
                <i />
              </span>
              <div className={s.stopBody}>
                {note && (
                  <span className={s.change}>
                    <span className={s.roundel} style={{ background: l?.color }} />
                    {note}
                  </span>
                )}
                <button type="button" className={s.stopName} onClick={() => onRide(i)} aria-current={i === rideIndex ? "step" : undefined}>
                  {st.name}
                  {st.phase !== phase && <span className={s.zoneTag}>Zone {st.phase}</span>}
                </button>
                <span className={s.stopMeta}>
                  {minutes(st.words)} min · <span data-state={state}>{state === "done" ? "visited" : state === "ready" ? "ready" : "earlier stops first"}</span>
                </span>
              </div>
              <Link href={stationHref(x.id, to)} className={s.stopOpen} aria-label={`Open ${st.name}`}>
                <ArrowRight size={15} />
              </Link>
            </motion.li>
          );
        })}
      </ol>

      <div className={s.rideBar}>
        <button type="button" className={s.rideBtn} onClick={() => onRide(rideIndex - 1)} disabled={rideIndex === 0} aria-label="Previous stop">
          <ArrowLeft size={16} />
        </button>
        <div className={s.rideNow}>
          <span className={s.kicker}>
            Stop {rideIndex + 1} of {stops.length}
          </span>
          <b>{name(current?.id ?? null)}</b>
        </div>
        <Link href={stationHref(current.id, to)} className={s.board}>
          Read
        </Link>
        <button type="button" className={s.nextBtn} onClick={() => onRide(rideIndex + 1)} disabled={rideIndex >= stops.length - 1}>
          Next stop <ArrowRight size={15} />
        </button>
      </div>
    </>
  );
}
