import { arrow, bracket, esc, fmt, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Event order and texts ("Hello", "!", end_turn) from the Claude stream in
// nodes/phase-1/streaming.md and sources/anthropic-streaming.md. Horizontal spacing is
// not timing data; the figure says so.
// Provider columns: sources/anthropic-streaming.md, sources/openai-streaming-responses.md
// (event names and the `delta` field), sources/willison-streaming-llm-apis.md (Chat
// Completions chunks with "Why", " did", and data: [DONE]).

const CW = 7.2; // mono char width at 12 px, for placing highlights

// Noto Sans Mono first: the PNG preview renderer (resvg) falls back to a proportional
// font on the shared MONO list, which would put the highlights in the wrong place.
const CODE_FONT = "'Noto Sans Mono', 'JetBrains Mono', Menlo, Consolas, monospace";

/** Code text with a fixed-width font set inline. */
const code = (x: number, y: number, s: string, tone: Tone, size = 12, anchor: "start" | "middle" = "start", weight = 400) =>
  `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${size}" dominant-baseline="central"${anchor === "middle" ? ` text-anchor="middle"` : ""}${
    weight !== 400 ? ` font-weight="${weight}"` : ""
  } class="t-${tone}" style="font-family:${CODE_FONT}" xml:space="preserve">${esc(s)}</text>`;

type Ev = { x: number; name: string; sub?: string; row: 0 | 1; text?: boolean };

const EVENTS: Ev[] = [
  { x: 300, name: "message_start", row: 0 },
  { x: 372, name: "content_block_start", row: 1 },
  { x: 444, name: "ping", row: 0 },
  { x: 526, name: "text_delta \"Hello\"", row: 1, text: true },
  { x: 612, name: "text_delta \"!\"", row: 0, text: true },
  { x: 700, name: "content_block_stop", row: 1 },
  { x: 790, name: "message_delta", sub: "stop_reason: end_turn", row: 0 },
  { x: 880, name: "message_stop", row: 1 },
];

const timeline: Figure = {
  slug: "timeline",
  alt: "A timeline of one streamed Claude reply. Your app sends one POST. The API sends back events over time: message_start, content_block_start, a ping, a text delta \"Hello\", a text delta \"!\", content_block_stop, message_delta with stop reason end_turn, and message_stop. Below, the text on screen goes from empty to \"Hello\" to \"Hello!\". The gap before the first text delta is the time to first text; the whole span takes as long as it would without streaming.",
  render() {
    const L = 150, R = 950;
    const yApp = 96, yApi = 216, yScreen = 330;
    const t0 = 180;
    const first = EVENTS.find((e) => e.text)!.x;
    const last = EVENTS[EVENTS.length - 1]!.x;
    let b = "";
    // brackets above
    b += bracket(t0, last, 20, "whole reply: same total time as without streaming", { up: false, tone: "muted" });
    b += bracket(t0, first, 56, "time to first text", { up: false, tone: "blue" });
    // lanes
    const lane = (y: number, label: string) => text(24, y, label, { baseline: "middle", size: 13.5, weight: 600 }) + line(L, y, R, y, { tone: "axis", sw: 1.5 });
    b += lane(yApp, "Your app");
    b += lane(yApi, "Claude API");
    b += text(24, yScreen, "On screen", { baseline: "middle", size: 13.5, weight: 600 });
    // POST
    b += arrow(t0, yApp + 2, t0, yApi - 3, { tone: "ink", sw: 2 });
    b += text(t0 - 8, (yApp + yApi) / 2 - 8, "POST", { anchor: "end", size: 13, weight: 700 });
    b += text(t0 - 8, (yApp + yApi) / 2 + 10, "\"stream\": true", { anchor: "end", size: 12, tone: "muted" });
    // events
    for (const e of EVENTS) {
      const tone: Tone = e.text ? "blue" : "grey";
      b += arrow(e.x, yApi - 2, e.x, yApp + 4, { tone, sw: e.text ? 2.5 : 1.5 });
      const ly = yApi + 20 + e.row * 34;
      b += code(e.x, ly, e.name, e.text ? "blue" : "ink", 12, "middle", e.text ? 700 : 400);
      if (e.sub) b += code(e.x, ly + 16, e.sub, "muted", 12, "middle");
    }
    // screen lane
    const d1 = EVENTS[3]!.x, d2 = EVENTS[4]!.x;
    const seg = (x1: number, x2: number, s: string, tone: Tone, italic = false) =>
      rect(x1 + 2, yScreen - 15, x2 - x1 - 4, 30, { tone, r: 4, sw: 1.2 }) +
      text((x1 + x2) / 2, yScreen, s, { anchor: "middle", baseline: "middle", size: 13.5, weight: italic ? 400 : 600, italic, tone: italic ? "muted" : "ink" });
    b += seg(t0, d1, "(empty)", "grey", true);
    b += seg(d1, d2, "Hello", "blue");
    b += seg(d2, R, "Hello!", "blue");
    b += line(d1, yApi + 68, d1, yScreen - 15, { tone: "blue", dash: true, sw: 1 });
    b += line(d2, yApi + 68, d2, yScreen - 15, { tone: "blue", dash: true, sw: 1 });
    // time axis hint
    b += arrow(L, yScreen + 36, R, yScreen + 36, { tone: "muted", sw: 1 });
    b += text(R, yScreen + 54, "time", { anchor: "end", size: 12, tone: "muted" });
    return svg(
      {
        width: 980,
        height: yScreen + 62,
        title: "One POST, then the reply arrives as a series of events",
        credit: "Event order from Anthropic's streaming docs (\"Hello\" example). Spacing is illustrative, not measured timing.",
        desc: timeline.alt,
      },
      b,
    );
  },
};

// A raw line: plain text plus an optional highlighted part [start, end) in characters.
type Raw = { s: string; hl?: [number, number]; dim?: boolean };
const hlOf = (s: string, part: string): Raw => {
  const i = s.indexOf(part);
  return { s, hl: [i, i + part.length] };
};

const COLS: { head: string; sub: string; lines: Raw[]; field: string; note?: string }[] = [
  {
    head: "Claude",
    sub: "named events: event: + data:",
    lines: [
      { s: "event: message_start", dim: true },
      { s: "data: {\"type\":\"message_start\",…}", dim: true },
      { s: "event: content_block_delta" },
      hlOf("data: {…\"text_delta\",\"text\":\"Hello\"}}", "\"text\":\"Hello\""),
      { s: "event: message_stop" },
    ],
    field: "text in: delta.text",
  },
  {
    head: "OpenAI Responses",
    sub: "typed events: the type field names them",
    lines: [
      { s: "{\"type\":\"response.created\",…}", dim: true },
      { s: "{\"type\":\"response.output_text.delta\"," },
      hlOf("  …\"delta\":\"<next text>\"}", "\"delta\":\"<next text>\""),
      { s: "{\"type\":\"response.completed\",…}" },
    ],
    field: "text in: delta",
    note: "Docs show event objects, not raw lines",
  },
  {
    head: "OpenAI Chat Completions",
    sub: "no event names: data: chunks only",
    lines: [
      hlOf("data: {…\"delta\":{\"content\":\"Why\"}…}", "\"content\":\"Why\""),
      hlOf("data: {…\"delta\":{\"content\":\" did\"}…}", "\"content\":\" did\""),
      { s: "…" , dim: true },
      { s: "data: [DONE]" },
    ],
    field: "text in: choices[0].delta.content",
  },
];

const providers: Figure = {
  slug: "providers",
  alt: "Three columns of raw stream lines. Claude sends named events, with event: and data: lines, and the text sits in a text_delta's text field. OpenAI's Responses API sends typed events such as response.created, response.output_text.delta and response.completed, with the text in a delta field. OpenAI's Chat Completions sends unnamed data: chunks with the text in the first choice's delta.content, and ends with data: [DONE]. The text-bearing field is highlighted in each.",
  render() {
    const X = 20, W = 318, G = 14, top = 58, LH = 22;
    const H = 16 + 5 * LH + 8;
    let b = "";
    COLS.forEach((c, i) => {
      const x = X + i * (W + G);
      b += text(x, 16, c.head, { size: 14.5, weight: 600 });
      b += text(x, 36, c.sub, { size: 12, tone: "muted" });
      b += rect(x, top, W, H, { tone: "grey", fill: "soft", r: 6, sw: 1.1 });
      c.lines.forEach((l, j) => {
        const ly = top + 20 + j * LH;
        if (l.hl) b += rect(x + 10 + l.hl[0] * CW - 2, ly - 11, (l.hl[1] - l.hl[0]) * CW + 4, 19, { tone: "blue", fill: "soft", r: 3, sw: 1.1 });
        b += code(x + 10, ly, l.s, l.dim ? "muted" : "ink");
      });
      b += code(x, top + H + 18, c.field, "blue", 12.5, "start", 600);
      if (c.note) b += text(x, top + H + 42, c.note, { size: 12, italic: true, tone: "muted" });
    });
    return svg(
      {
        width: X * 2 + W * 3 + G * 2,
        height: top + H + 52,
        title: "Same SSE envelope, different contents inside",
        credit: "Redrawn from Simon Willison's curl output (2024) and Anthropic's and OpenAI's streaming docs (checked 2026-09-23). Long lines trimmed to … .",
        desc: providers.alt,
      },
      b,
    );
  },
};

export default [timeline, providers];
