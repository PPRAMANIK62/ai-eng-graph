// Small SVG toolkit for the article figures. Every helper returns a string.
// Figures use the site's design system (the transit map): each tone reads a site token
// (--t-*, --line-N from app/globals.css) with a fixed fallback. Inside the site the SVG is
// inlined, so it follows the site's theme exactly; opened on its own (GitHub, a file viewer)
// it falls back to the same palette and follows the OS light/dark setting.

export type Tone = "ink" | "muted" | "blue" | "orange" | "green" | "red" | "purple" | "grey";

// Site fonts are CSS variables set by next/font; named families are the fallback outside the site.
export const FONT = "var(--transit-text), 'Public Sans', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif";
export const DISPLAY = "var(--transit-sign), Overpass, 'Noto Sans', 'Helvetica Neue', Arial, sans-serif";
export const MONO = "'JetBrains Mono', 'Noto Sans Mono', Menlo, Consolas, monospace";

// tone -> [site token, light fallback, dark fallback]. Tones map onto metro lines:
// blue = cobalt line, red = red line, green = green line, orange = orange line, purple = violet line.
const PALETTE: Record<string, [string, string, string]> = {
  bg: ["--t-surface", "#ffffff", "#161b23"],
  ink: ["--t-ink", "#0d1117", "#eef1f5"],
  muted: ["--t-ink-2", "#4a5261", "#a9b2bf"],
  line: ["--t-ink-3", "#8a93a0", "#6c7686"],
  grid: ["--t-rule", "#dde1e7", "#2a313c"],
  blue: ["--line-1", "#0065bd", "#3f8dff"],
  orange: ["--line-3", "#f26b1d", "#ff8a3d"],
  green: ["--line-2", "#00a650", "#20c46b"],
  red: ["--line-0", "#e4002b", "#ff4458"],
  purple: ["--line-4", "#8a3fa0", "#b673d6"],
  grey: ["--t-ink-3", "#8a93a0", "#6c7686"],
  "blue-soft": ["--line-1-soft", "#dcebf8", "#132a4a"],
  "orange-soft": ["--line-3-soft", "#fde6d8", "#3d2210"],
  "green-soft": ["--line-2-soft", "#d6f2e2", "#0f3320"],
  "red-soft": ["--line-0-soft", "#fbd9df", "#40121a"],
  "purple-soft": ["--line-4-soft", "#eedff3", "#2e1a3a"],
  "grey-soft": ["--t-panel", "#f3f5f8", "#1b212b"],
  "ink-soft": ["--t-panel", "#f3f5f8", "#1b212b"],
  "muted-soft": ["--t-panel", "#f3f5f8", "#1b212b"],
};
const LIGHT = Object.fromEntries(Object.entries(PALETTE).map(([k, [, l]]) => [k, l]));
const DARK = Object.fromEntries(Object.entries(PALETTE).map(([k, [, , d]]) => [k, d]));
const vars = (theme: 1 | 2) => Object.entries(PALETTE).map(([k, v]) => `--${k}:var(${v[0]},${v[theme]})`).join(";");

// Every rule is scoped to .fig so an inlined figure can't restyle the page around it.
const STYLE = `
.fig{${vars(1)}}
@media (prefers-color-scheme: dark){.fig{${vars(2)}}}
.fig .bg{fill:var(--bg)}
.fig text{font-family:${FONT};fill:var(--ink)}
.fig .display{font-family:${DISPLAY}}
.fig .mono{font-family:${MONO}}
.fig .grid{stroke:var(--grid)}
.fig .axis{stroke:var(--line)}
${(["ink", "muted", "blue", "orange", "green", "red", "purple", "grey"] as Tone[])
  .map(
    (t) =>
      `.fig .f-${t}{fill:var(--${t})}.fig .s-${t}{stroke:var(--${t})}.fig .fs-${t}{fill:var(--${t}-soft)}.fig .t-${t}{fill:var(--${t})}`,
  )
  .join("\n")}
`;

/** Swap CSS variables for fixed colors, for renderers without var() support (PNG previews). */
export const flatten = (s: string, theme: "light" | "dark" = "light") => {
  const m: Record<string, string> = theme === "light" ? LIGHT : DARK;
  return s
    .replace(/@media[^{]*\{\.fig\{[^}]*\}\}/, "")
    .replace(/\.fig\{[^}]*\}/, "")
    .replace(/var\(--transit-[a-z]+\),\s*/g, "")
    .replace(/var\(--([a-z-]+)\)/g, (_, k: string) => m[k] ?? "#f0f");
};

export const esc = (s: string | number) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Rough text width, good enough for sizing boxes around labels. */
export const measure = (s: string, size = 14, mono = false) =>
  [...s].reduce((w, ch) => {
    if (mono) return w + 0.6;
    if (/[ᄀ-￿]/.test(ch)) return w + 1.0;
    if (/[ilj.,:;'!|()\[\]1 ]/.test(ch)) return w + 0.32;
    if (/[mwMW@]/.test(ch)) return w + 0.85;
    if (/[A-Z0-9]/.test(ch)) return w + 0.64;
    return w + 0.54;
  }, 0) * size;

export const fmt = (n: number, digits = 2) => (Math.round(n * 10 ** digits) / 10 ** digits).toString();

type TextOpts = {
  size?: number;
  anchor?: "start" | "middle" | "end";
  weight?: number;
  tone?: Tone;
  mono?: boolean;
  italic?: boolean;
  baseline?: "auto" | "middle" | "hanging";
  rotate?: number;
  /** Signage face, for titles. */
  display?: boolean;
};

export function text(x: number, y: number, s: string, o: TextOpts = {}) {
  const attrs = [
    `x="${fmt(x)}"`,
    `y="${fmt(y)}"`,
    `font-size="${o.size ?? 14}"`,
    o.anchor && o.anchor !== "start" ? `text-anchor="${o.anchor}"` : "",
    o.weight ? `font-weight="${o.weight}"` : "",
    o.italic ? `font-style="italic"` : "",
    o.baseline && o.baseline !== "auto" ? `dominant-baseline="${o.baseline === "middle" ? "central" : "hanging"}"` : "",
    o.rotate ? `transform="rotate(${o.rotate} ${fmt(x)} ${fmt(y)})"` : "",
    `class="t-${o.tone ?? "ink"}${o.mono ? " mono" : ""}${o.display ? " display" : ""}"`,
  ].filter(Boolean);
  return `<text ${attrs.join(" ")} xml:space="preserve">${esc(s)}</text>`;
}

/** Several lines of text, top line at y. */
export function lines(x: number, y: number, ls: string[], o: TextOpts & { gap?: number } = {}) {
  const gap = o.gap ?? (o.size ?? 14) * 1.35;
  return ls.map((l, i) => text(x, y + i * gap, l, o)).join("");
}

/** Greedy word wrap by estimated width. */
export function wrap(s: string, width: number, size = 14, mono = false) {
  const out: string[] = [];
  let cur = "";
  for (const word of s.split(/\s+/)) {
    const next = cur ? `${cur} ${word}` : word;
    if (cur && measure(next, size, mono) > width) {
      out.push(cur);
      cur = word;
    } else cur = next;
  }
  if (cur) out.push(cur);
  return out;
}

type RectOpts = { tone?: Tone; fill?: "soft" | "solid" | "none"; stroke?: boolean; r?: number; dash?: boolean; sw?: number; opacity?: number };

export function rect(x: number, y: number, w: number, h: number, o: RectOpts = {}) {
  const tone = o.tone ?? "grey";
  const fill = o.fill ?? "soft";
  const cls = [fill === "soft" ? `fs-${tone}` : fill === "solid" ? `f-${tone}` : "", o.stroke === false ? "" : `s-${tone}`]
    .filter(Boolean)
    .join(" ");
  return `<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(w)}" height="${fmt(h)}" rx="${o.r ?? 6}" class="${cls}"${
    fill === "none" ? ` fill="none"` : ""
  }${o.stroke === false ? "" : ` stroke-width="${o.sw ?? 1.5}"`}${o.dash ? ` stroke-dasharray="5 4"` : ""}${
    o.opacity !== undefined ? ` opacity="${o.opacity}"` : ""
  }/>`;
}

/** A box with centered (possibly multi-line) label. */
export function box(
  x: number,
  y: number,
  w: number,
  h: number,
  label: string | string[],
  o: RectOpts & { size?: number; weight?: number; textTone?: Tone; mono?: boolean } = {},
) {
  const ls = Array.isArray(label) ? label : [label];
  const size = o.size ?? 14;
  const gap = size * 1.3;
  const top = y + h / 2 - ((ls.length - 1) * gap) / 2;
  return (
    rect(x, y, w, h, o) +
    ls
      .map((l, i) =>
        text(x + w / 2, top + i * gap, l, {
          size,
          anchor: "middle",
          baseline: "middle",
          weight: o.weight,
          tone: o.textTone ?? "ink",
          mono: o.mono,
        }),
      )
      .join("")
  );
}

type LineOpts = { tone?: Tone | "axis" | "grid"; sw?: number; dash?: boolean; arrow?: boolean; arrowStart?: boolean };

export function line(x1: number, y1: number, x2: number, y2: number, o: LineOpts = {}) {
  const tone = o.tone ?? "grey";
  const cls = tone === "axis" || tone === "grid" ? tone : `s-${tone}`;
  const marker = tone === "axis" || tone === "grid" ? "grey" : tone;
  return `<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" class="${cls}" stroke-width="${o.sw ?? 1.5}"${
    o.dash ? ` stroke-dasharray="5 4"` : ""
  }${o.arrow ? ` marker-end="url(#ah-${marker})"` : ""}${o.arrowStart ? ` marker-start="url(#as-${marker})"` : ""}/>`;
}

export const arrow = (x1: number, y1: number, x2: number, y2: number, o: Omit<LineOpts, "arrow"> = {}) =>
  line(x1, y1, x2, y2, { ...o, arrow: true });

/** A path with the same styling rules as line(). */
export function path(d: string, o: LineOpts & { fill?: Tone; fillSoft?: boolean } = {}) {
  const tone = o.tone ?? "grey";
  const cls = [tone === "axis" || tone === "grid" ? tone : `s-${tone}`, o.fill ? (o.fillSoft ? `fs-${o.fill}` : `f-${o.fill}`) : ""]
    .filter(Boolean)
    .join(" ");
  const marker = tone === "axis" || tone === "grid" ? "grey" : tone;
  return `<path d="${d}" class="${cls}" stroke-width="${o.sw ?? 1.5}"${o.fill ? "" : ` fill="none"`}${
    o.dash ? ` stroke-dasharray="5 4"` : ""
  }${o.arrow ? ` marker-end="url(#ah-${marker})"` : ""}${o.arrowStart ? ` marker-start="url(#as-${marker})"` : ""}/>`;
}

export function circle(cx: number, cy: number, r: number, o: { tone?: Tone; fill?: "soft" | "solid" | "none"; stroke?: boolean } = {}) {
  const tone = o.tone ?? "grey";
  const fill = o.fill ?? "solid";
  const cls = [fill === "soft" ? `fs-${tone}` : fill === "solid" ? `f-${tone}` : "", o.stroke ? `s-${tone}` : ""].filter(Boolean).join(" ");
  return `<circle cx="${fmt(cx)}" cy="${fmt(cy)}" r="${fmt(r)}" class="${cls}"${fill === "none" ? ` fill="none"` : ""}${
    o.stroke ? ` stroke-width="1.5"` : ""
  }/>`;
}

/** Curly-ish bracket drawn as a squared bracket with a center tick. side = where the tick points. */
export function bracket(x1: number, x2: number, y: number, label: string, o: { up?: boolean; tone?: Tone; size?: number } = {}) {
  const d = o.up ? -8 : 8;
  const mid = (x1 + x2) / 2;
  return (
    path(`M${x1},${y + d} L${x1},${y} L${x2},${y} L${x2},${y + d} M${mid},${y} L${mid},${y - d}`, { tone: o.tone ?? "muted" as Tone }) +
    text(mid, y - d - (o.up ? -14 : 6), label, { anchor: "middle", size: o.size ?? 13, tone: o.tone ?? "muted" })
  );
}

const TONES: Tone[] = ["ink", "muted", "blue", "orange", "green", "red", "purple", "grey"];
const MARKERS = TONES.map(
  (t) =>
    `<marker id="ah-${t}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="f-${t}"/></marker>` +
    `<marker id="as-${t}" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10,0 L0,5 L10,10 z" class="f-${t}"/></marker>`,
).join("");

export type Frame = {
  width: number;
  height: number;
  /** Short title shown at the top of the figure. */
  title?: string;
  /** Credit line shown at the bottom, e.g. "Adapted from ...". */
  credit?: string;
  /** Accessible description, usually the markdown alt text. */
  desc: string;
};

export const TITLE_H = 44;
export const CREDIT_H = 30;

/**
 * Wrap figure content in an <svg>. Content is drawn in a coordinate system
 * where (0, 0) is the top-left of the area below the title.
 */
export function svg(f: Frame, body: string) {
  const top = f.title ? TITLE_H : 16;
  const bottom = f.credit ? CREDIT_H : 12;
  const W = f.width;
  const H = f.height + top + bottom;
  // Several figures can share a page once inlined, so ids come from the content.
  const id = `fig-${hash(f.desc)}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" class="fig" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="${id}-t ${id}-d">
<title id="${id}-t">${esc(f.title ?? f.desc)}</title>
<desc id="${id}-d">${esc(f.desc)}</desc>
<style>${STYLE}</style>
<defs>${MARKERS}</defs>
<rect class="bg" x="0" y="0" width="${W}" height="${H}"/>
${f.title ? text(24, 30, f.title, { size: 17, weight: 700, display: true }) : ""}
<g transform="translate(0 ${top})">${body}</g>
${f.credit ? text(24, H - 11, f.credit, { size: 11.5, tone: "muted", italic: true }) : ""}
</svg>
`;
}

/** Short stable hash, for ids. */
function hash(s: string) {
  let h = 5381;
  for (const ch of s) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
  return h.toString(36);
}

export type Figure = {
  /** File name part after the node id: nodes/phase-N/img/<node>-<slug>.svg */
  slug: string;
  /** Markdown alt text: what the figure shows, in plain words. */
  alt: string;
  render: () => string;
};
