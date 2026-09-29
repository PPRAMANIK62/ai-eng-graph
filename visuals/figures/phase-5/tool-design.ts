import { arrow, box, line, rect, svg, text, type Figure } from "../../lib/svg.ts";

// Tool names and what each task tool does: sources/anthropic-writing-tools-for-agents.md
// ("Choosing the right tools for agents").
const GROUPS = [
  { api: ["list_users", "list_events", "create_event"], task: "schedule_event", what: "finds a free slot and books it" },
  { api: ["read_logs"], task: "search_logs", what: "only matching lines, with context" },
  { api: ["get_customer_by_id", "list_transactions", "list_notes"], task: "get_customer_context", what: "everything relevant about one customer" },
];

const apiVsTask: Figure = {
  slug: "api-vs-task",
  alt: "Two ways to give an agent the same abilities. Left, tools that mirror the API: list_users, list_events, create_event, read_logs, get_customer_by_id, list_transactions and list_notes, seven tools, with each intermediate result passing through the model. Right, tools built around tasks: schedule_event (finds availability and books), search_logs (only matching lines with context) and get_customer_context (everything relevant about one customer), three tools. Arrows show which API tools each task tool replaces.",
  render() {
    let b = "";
    const LX = 24;
    const RX = 470;
    b += text(LX, 8, "Tools that mirror the API", { size: 14.5, weight: 700, tone: "orange" });
    b += text(LX, 28, "7 tools; the model chains them and reads every result", { size: 12.5, tone: "muted" });
    b += text(RX, 8, "Tools built around the task", { size: 14.5, weight: 700, tone: "blue" });
    b += text(RX, 28, "3 tools; the chaining happens in your code", { size: 12.5, tone: "muted" });
    let y = 52;
    const rowH = 36;
    const gap = 22;
    for (const g of GROUPS) {
      const top = y;
      for (const name of g.api) {
        b += box(LX, y, 200, 28, name, { tone: "orange", size: 13, mono: true });
        y += rowH;
      }
      const bottom = y - rowH + 28;
      const mid = (top + bottom) / 2;
      // bracket the group and point it at the task tool
      b += line(LX + 212, top + 14, LX + 226, top + 14, { tone: "muted" });
      b += line(LX + 212, bottom - 14, LX + 226, bottom - 14, { tone: "muted" });
      b += line(LX + 226, top + 14, LX + 226, bottom - 14, { tone: "muted" });
      b += arrow(LX + 226, mid, RX - 8, mid, { tone: "muted" });
      b += box(RX, mid - 16, 210, 32, g.task, { tone: "blue", size: 13, weight: 600, mono: true });
      b += text(RX + 222, mid, g.what, { size: 12.5, baseline: "middle", tone: "muted" });
      y += gap;
    }
    const h = y - gap + 8;
    return svg(
      {
        width: 960,
        height: h,
        title: "Design tools around the job, not around the endpoints",
        credit: "Examples from Anthropic, “Writing effective tools for agents” (2025).",
        desc: apiVsTask.alt,
      },
      b,
    );
  },
};

// sources/anthropic-writing-tools-for-agents.md: the Slack thread example,
// detailed response 206 tokens, concise 72 tokens (~1/3).
const responseFormat: Figure = {
  slug: "response-format",
  alt: "Bar chart of tokens for the same Slack thread returned two ways: detailed format 206 tokens, including thread_ts, channel_id and user_id for follow-up calls; concise format 72 tokens, thread content only. The concise response uses about a third of the tokens.",
  render() {
    let b = "";
    const x0 = 150;
    const scale = 1.8; // px per token
    const rows = [
      { label: "detailed", value: 206, tone: "orange" as const, note: "content + thread_ts, channel_id, user_id" },
      { label: "concise", value: 72, tone: "blue" as const, note: "thread content only" },
    ];
    rows.forEach((r, i) => {
      const y = 14 + i * 64;
      b += text(x0 - 12, y + 16, `"${r.label}"`, { anchor: "end", baseline: "middle", size: 13.5, mono: true });
      b += rect(x0, y, r.value * scale, 32, { tone: r.tone, fill: "solid", stroke: false, r: 2 });
      b += text(x0 + r.value * scale + 10, y + 10, `${r.value} tokens`, { baseline: "middle", size: 13, weight: 700, tone: r.tone });
      b += text(x0 + r.value * scale + 10, y + 27, r.note, { baseline: "middle", size: 12, tone: "muted" });
    });
    b += line(x0, 4, x0, 124, { tone: "axis" });
    b += text(x0, 146, "Same thread lookup, chosen by a response_format parameter. Keep IDs when a follow-up call needs them.", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: 860,
        height: 160,
        title: "A concise mode used about a third of the tokens",
        credit: "Data: Anthropic, “Writing effective tools for agents” (2025), Slack example.",
        desc: responseFormat.alt,
      },
      b,
    );
  },
};

export default [apiVsTask, responseFormat];
