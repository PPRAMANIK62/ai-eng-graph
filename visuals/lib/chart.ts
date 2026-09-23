// Chart helpers built on d3-scale / d3-shape. They draw into a plot box
// (x, y, w, h) inside a figure, so several charts can share one figure.
import { scaleBand, scaleLinear, scaleLog, type ScaleLinear, type ScaleLogarithmic } from "d3-scale";
import { line as d3line, curveMonotoneX } from "d3-shape";
import { circle, fmt, line, path, rect, text, type Tone } from "./svg.ts";

export type Plot = { x: number; y: number; w: number; h: number };

type Bar = { label: string; value: number; tone?: Tone; valueLabel?: string; fill?: "soft" | "solid" };

/** Vertical bars with category labels under them and values on top. */
export function columns(
  p: Plot,
  bars: Bar[],
  o: { max?: number; ticks?: number[]; tickFormat?: (n: number) => string; padding?: number; labelSize?: number; yLabel?: string } = {},
) {
  const x = scaleBand<string>().domain(bars.map((b) => b.label)).range([p.x, p.x + p.w]).padding(o.padding ?? 0.3);
  const y = scaleLinear().domain([0, o.max ?? Math.max(...bars.map((b) => b.value))]).range([p.y + p.h, p.y]);
  let s = yAxis(p, y, o.ticks ?? [], o.tickFormat, o.yLabel);
  for (const b of bars) {
    const bx = x(b.label)!;
    const by = y(b.value);
    s += rect(bx, by, x.bandwidth(), p.y + p.h - by, { tone: b.tone ?? "blue", fill: b.fill ?? "solid", stroke: false, r: 2 });
    s += text(bx + x.bandwidth() / 2, by - 6, b.valueLabel ?? String(b.value), { anchor: "middle", size: 12.5, weight: 600, tone: b.tone ?? "blue" });
    s += text(bx + x.bandwidth() / 2, p.y + p.h + 18, b.label, { anchor: "middle", size: o.labelSize ?? 12.5 });
  }
  s += line(p.x, p.y + p.h, p.x + p.w, p.y + p.h, { tone: "axis" });
  return { svg: s, x, y };
}

/** Horizontal bars with labels on the left and values at the bar end. */
export function barsH(
  p: Plot,
  bars: Bar[],
  o: { max?: number; labelWidth?: number; padding?: number; size?: number; log?: boolean; min?: number } = {},
) {
  const lw = o.labelWidth ?? 120;
  const yb = scaleBand<string>().domain(bars.map((b) => b.label)).range([p.y, p.y + p.h]).padding(o.padding ?? 0.25);
  const max = o.max ?? Math.max(...bars.map((b) => b.value));
  const xs: ScaleLinear<number, number> | ScaleLogarithmic<number, number> = o.log
    ? scaleLog().domain([o.min ?? 1, max]).range([p.x + lw, p.x + p.w - 60])
    : scaleLinear().domain([0, max]).range([p.x + lw, p.x + p.w - 60]);
  let s = "";
  for (const b of bars) {
    const by = yb(b.label)!;
    const bw = Math.max(2, xs(b.value) - (p.x + lw));
    s += text(p.x + lw - 10, by + yb.bandwidth() / 2, b.label, { anchor: "end", baseline: "middle", size: o.size ?? 13 });
    s += rect(p.x + lw, by, bw, yb.bandwidth(), { tone: b.tone ?? "blue", fill: b.fill ?? "solid", stroke: false, r: 2 });
    s += text(p.x + lw + bw + 8, by + yb.bandwidth() / 2, b.valueLabel ?? String(b.value), {
      baseline: "middle",
      size: 12.5,
      weight: 600,
      tone: b.tone ?? "blue",
    });
  }
  s += line(p.x + lw, p.y, p.x + lw, p.y + p.h, { tone: "axis" });
  return { svg: s, y: yb, x: xs };
}

/** Left axis with light grid lines. */
export function yAxis(p: Plot, y: (n: number) => number, ticks: number[], format = (n: number) => String(n), label?: string) {
  let s = "";
  for (const t of ticks) {
    const ty = y(t);
    s += line(p.x, ty, p.x + p.w, ty, { tone: "grid", sw: 1 });
    s += text(p.x - 8, ty, format(t), { anchor: "end", baseline: "middle", size: 11.5, tone: "muted" });
  }
  if (label) s += text(p.x - 42, p.y + p.h / 2, label, { anchor: "middle", size: 12, tone: "muted", rotate: -90 });
  return s;
}

/** Bottom axis ticks and label. */
export function xAxis(p: Plot, x: (n: number) => number, ticks: number[], format = (n: number) => String(n), label?: string) {
  let s = line(p.x, p.y + p.h, p.x + p.w, p.y + p.h, { tone: "axis" });
  for (const t of ticks) {
    const tx = x(t);
    s += line(tx, p.y + p.h, tx, p.y + p.h + 5, { tone: "axis" });
    s += text(tx, p.y + p.h + 19, format(t), { anchor: "middle", size: 11.5, tone: "muted" });
  }
  if (label) s += text(p.x + p.w / 2, p.y + p.h + 40, label, { anchor: "middle", size: 12, tone: "muted" });
  return s;
}

/** A smooth line through points, optionally with dots. */
export function series(points: [number, number][], o: { tone?: Tone; dots?: boolean; dash?: boolean; sw?: number; smooth?: boolean } = {}) {
  const gen = d3line();
  if (o.smooth !== false) gen.curve(curveMonotoneX);
  let s = path(gen(points) ?? "", { tone: o.tone ?? "blue", sw: o.sw ?? 2.5, dash: o.dash });
  if (o.dots) for (const [px, py] of points) s += circle(px, py, 4, { tone: o.tone ?? "blue" });
  return s;
}

export { scaleLinear, scaleLog, scaleBand, fmt };
