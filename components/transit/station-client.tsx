"use client";

import { useMemo } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { trailTo, type Graph } from "@/lib/graph";
import { useHydrated, useUnderstood } from "@/lib/progress";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import type { LinkedNode } from "@/lib/graph";
import type { AtlasStation, TLine } from "./model";
import { mainLine, minutes, planTrip } from "./route";
import { mapHref, stationHref, useTrip } from "./trip";
import { transitFonts } from "./fonts";
import { ThemeSwitch } from "@/components/theme-switch";
import s from "./transit.module.css";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export type StationInfo = Record<string, AtlasStation>;

type Seq = {
  mode: "route" | "line" | "none";
  /** The destination (route) or the line (line). */
  label: string;
  stops: { id: string; color: string }[];
  index: number;
  to: string | null;
};

/** The sequence this station sits in: the active trip if it passes here, else the station's main line. */
function useSequence(graph: Graph, lines: TLine[], edgeLines: Record<string, string[]>, info: StationInfo, id: string): Seq {
  const { to: rawTo } = useTrip();
  const to = rawTo && info[rawTo]?.readable ? rawTo : null;
  return useMemo(() => {
    const color = new Map(lines.map(l => [l.id, l.color]));
    if (to && trailTo(graph, to).includes(id)) {
      const stops = planTrip(graph, edgeLines, to);
      return {
        mode: "route",
        label: info[to].name,
        stops: stops.map(x => ({ id: x.id, color: color.get(x.line ?? "") ?? "var(--t-ink-3)" })),
        index: stops.findIndex(x => x.id === id),
        to,
      };
    }
    // Transfers ride other zones' lines too; the main line is one from the station's own zone.
    const main = mainLine(lines.filter(l => l.phase === info[id].phase), id);
    if (main)
      return {
        mode: "line",
        label: main.line.name,
        stops: main.stops.map(x => ({ id: x, color: main.line.color })),
        index: main.stops.indexOf(id),
        to,
      };
    return { mode: "none", label: "", stops: [{ id, color: "var(--t-ink-3)" }], index: 0, to };
  }, [graph, lines, edgeLines, info, id, to]);
}

type Shared = { graph: Graph; lines: TLine[]; edgeLines: Record<string, string[]>; info: StationInfo; id: string };

/** Signage at the top of a station page: where this stop sits on your route or its line. */
export function StationStrip({ graph, lines, edgeLines, info, id, serving }: Shared & { serving: string[] }) {
  const seq = useSequence(graph, lines, edgeLines, info, id);
  const { understood } = useUnderstood();
  const hydrated = useHydrated();
  const done = (x: string) => hydrated && understood.has(x);
  const lo = Math.max(0, seq.index - 2);
  const hi = Math.min(seq.stops.length, seq.index + 3);
  const shown = seq.stops.slice(lo, hi);
  const lineById = new Map(lines.map(l => [l.id, l]));

  return (
    <div className={s.sign}>
      <div className={s.signTop}>
        <Link href={mapHref(info[id].phase, seq.to, id)} className={s.signBack}>
          <ArrowLeft size={15} /> Map
        </Link>
        <span className={s.signWhere}>
          {seq.mode === "route" ? (
            <>
              Trip to <b>{seq.label}</b> · stop {seq.index + 1} of {seq.stops.length}
            </>
          ) : seq.mode === "line" ? (
            <>
              <b>{seq.label}</b> · stop {seq.index + 1} of {seq.stops.length}
            </>
          ) : (
            <>Not on a line yet</>
          )}
        </span>
        {serving.length > 0 && (
          <span className={s.signLines} aria-label="Lines serving this station">
            {serving.map(l => {
              const line = lineById.get(l)!;
              return (
                <span key={l} className={s.signLine} style={{ background: line.color, color: line.ink }}>
                  {line.name.replace(/ line$/, "")}
                </span>
              );
            })}
          </span>
        )}
        <ThemeSwitch id="station" />
      </div>

      {/* The trip lives in this browser, so the strip waits for hydration rather than flash the wrong line. */}
      {!hydrated ? (
        <div className={s.stripWait} />
      ) : (
      <ol className={s.strip} key={`${seq.mode}-${seq.label}`}>
        {lo > 0 && <li className={s.stripMore} aria-hidden>···</li>}
        {shown.map((x, k) => {
          const i = lo + k;
          const here = i === seq.index;
          const nextColor = seq.stops[i + 1]?.color;
          return (
            <li key={x.id} className={s.stripStop} data-here={here} data-done={done(x.id)} data-past={i < seq.index} data-far={Math.abs(i - seq.index) > 1}>
              {i < seq.stops.length - 1 && (
                <motion.span
                  className={s.stripTrack}
                  style={{ background: nextColor }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.1 + k * 0.06 }}
                />
              )}
              <motion.span
                className={s.stripDot}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.45, bounce: 0, delay: 0.08 + k * 0.06 }}
              />
              {here ? (
                <span className={s.stripName}>
                  <small>You are here</small>
                  {info[x.id].name}
                </span>
              ) : info[x.id].readable ? (
                <Link href={stationHref(x.id, seq.to)} className={s.stripName}>
                  <small>{i === seq.index + 1 ? "Next" : i < seq.index ? "Earlier" : "Later"}</small>
                  {info[x.id].name}
                </Link>
              ) : (
                <span className={s.stripName} data-planned>
                  <small>Opening later</small>
                  {info[x.id].name}
                </span>
              )}
            </li>
          );
        })}
        {hi < seq.stops.length && <li className={s.stripMore} aria-hidden>···</li>}
      </ol>
      )}
    </div>
  );
}

/** End of an article: mark it, then ride on. */
export function StationEnd(props: Shared) {
  const { id, info } = props;
  const seq = useSequence(props.graph, props.lines, props.edgeLines, props.info, id);
  const { understood, toggle } = useUnderstood();
  const hydrated = useHydrated();
  const on = hydrated && understood.has(id);
  const next = seq.stops[seq.index + 1];
  const nextOk = next && info[next.id].readable;

  return (
    <div className={s.end}>
      <p className={s.endTitle}>Got it?</p>
      <p className={s.endLede}>Mark it and this station fills in on the map, and the stops after it get closer.</p>
      <div className={s.endRow}>
        <motion.button
          type="button"
          className={s.mark}
          data-on={on}
          aria-pressed={on}
          onClick={() => toggle(id)}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", duration: 0.25, bounce: 0 }}
        >
          <span className={s.markBox}>
            <AnimatePresence initial={false}>
              {on && (
                <motion.span key="c" style={{ display: "grid" }} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ type: "spring", duration: 0.3, bounce: 0 }}>
                  <Check size={13} strokeWidth={3.4} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
          {on ? "Understood" : "Mark as understood"}
        </motion.button>

        {nextOk ? (
          <Link href={stationHref(next.id, seq.to)} className={s.nextStop} style={{ "--c": next.color } as React.CSSProperties}>
            <span>
              <small>Next stop</small>
              {info[next.id].name}
            </span>
            <ArrowRight size={18} />
          </Link>
        ) : seq.mode === "route" && seq.index === seq.stops.length - 1 ? (
          <Link href={mapHref(info[id].phase, seq.to, id)} className={s.nextStop} style={{ "--c": "var(--t-ink)" } as React.CSSProperties}>
            <span>
              <small>You&apos;ve arrived</small>
              Back to the map
            </span>
            <ArrowRight size={18} />
          </Link>
        ) : (
          <Link href={mapHref(info[id].phase, seq.to, id)} className={s.nextStop} style={{ "--c": "var(--t-ink)" } as React.CSSProperties}>
            <span>
              <small>{seq.mode === "line" ? "End of the line" : "No next stop"}</small>
              Back to the map
            </span>
            <ArrowRight size={18} />
          </Link>
        )}
      </div>
      {seq.mode === "route" && (
        <p className={s.endNote}>
          {minutes(seq.stops.slice(seq.index + 1).reduce((m, x) => m + info[x.id].words, 0))} min of reading left on this trip.
        </p>
      )}
    </div>
  );
}

/** In-text concept links: go to that station, keep the trip, show its note on hover. */
export function TransitConceptLink({ node, children }: { node: LinkedNode; children: React.ReactNode }) {
  const { to } = useTrip();
  const { understood } = useUnderstood();
  const hydrated = useHydrated();
  const done = hydrated && understood.has(node.id);
  const trigger = node.readable ? (
    <Link href={stationHref(node.id, to)} className={s.clink} data-done={done} />
  ) : (
    <span className={s.clink} data-planned tabIndex={0} />
  );
  return (
    <HoverCard>
      <HoverCardTrigger delay={150} closeDelay={80} render={trigger}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent side="top" sideOffset={8} className={`${transitFonts} ${s.pop}`}>
        <b>{node.title}</b>
        <p>{node.note}</p>
        <span>{node.readable ? `${minutes(node.words)} min read${done ? " · visited" : ""}` : "Planned station, opening later"}</span>
      </HoverCardContent>
    </HoverCard>
  );
}
