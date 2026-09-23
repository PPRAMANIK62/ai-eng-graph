import { arrow, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Messages and input_tokens (12 and 30) from nodes/phase-1/chat-api.md and
// sources/anthropic-working-with-messages.md. Call 3's contents and token count are
// not given anywhere, so it is drawn as placeholders and marked "not measured".

type Msg = { role: "user" | "assistant"; content: string; isNew: boolean; placeholder?: boolean };

const CALLS: { head: string; msgs: Msg[]; tokens: number | null }[] = [
  { head: "Call 1", tokens: 12, msgs: [{ role: "user", content: "\"Hello, Claude\"", isNew: true }] },
  {
    head: "Call 2",
    tokens: 30,
    msgs: [
      { role: "user", content: "\"Hello, Claude\"", isNew: false },
      { role: "assistant", content: "\"Hello!\"", isNew: true },
      { role: "user", content: "\"Can you describe LLMs to me?\"", isNew: true },
    ],
  },
  {
    head: "Call 3",
    tokens: null,
    msgs: [
      { role: "user", content: "\"Hello, Claude\"", isNew: false },
      { role: "assistant", content: "\"Hello!\"", isNew: false },
      { role: "user", content: "\"Can you describe LLMs to me?\"", isNew: false },
      { role: "assistant", content: "the reply about LLMs", isNew: true, placeholder: true },
      { role: "user", content: "your next message", isNew: true, placeholder: true },
    ],
  },
];

const figure: Figure = {
  slug: "resend",
  alt: "Three request bodies for the same chat, side by side. Call 1 sends one user message and uses 12 input tokens. Call 2 sends that message again, plus the reply \"Hello!\" and a new question, and uses 30 input tokens. Call 3 sends all of that again plus the next reply and message, so its input is bigger still. Older messages are grey, new ones are highlighted.",
  render() {
    const X = 24, CW = 290, GAP = 34, top = 40, ROW = 36, CH = 30;
    const boxH = 16 + 5 * ROW + 6;
    const perTok = 150 / 30; // px per input token, so 30 tokens = 150 px
    let b = "";
    CALLS.forEach((c, i) => {
      const x = X + i * (CW + GAP);
      b += text(x, 22, c.head, { size: 14.5, weight: 600 });
      b += text(x + CW, 22, "messages: [ … ]", { anchor: "end", size: 12, tone: "muted", mono: true });
      b += rect(x, top, CW, boxH, { tone: "grey", fill: "none", r: 8, sw: 1.2 });
      c.msgs.forEach((m, j) => {
        const y = top + 12 + j * ROW;
        const tone: Tone = m.isNew ? "blue" : "grey";
        b += rect(x + 10, y, CW - 20, CH, { tone, fill: "soft", r: 5, sw: 1.1, dash: m.placeholder, opacity: m.isNew ? 1 : 0.9 });
        b += text(x + 20, y + CH / 2, m.role === "user" ? "user" : "asst", { baseline: "middle", size: 12, mono: true, tone: m.isNew ? "blue" : "muted", weight: 600 });
        b += text(x + 64, y + CH / 2, m.content, {
          baseline: "middle",
          size: 12.5,
          tone: m.isNew && !m.placeholder ? "ink" : "muted",
          italic: m.placeholder,
        });
      });
      // input_tokens bar
      const by = top + boxH + 22;
      b += text(x, by, "input_tokens", { size: 12, tone: "muted", mono: true });
      const barY = by + 10;
      if (c.tokens !== null) {
        const w = c.tokens * perTok;
        b += rect(x, barY, w, 22, { tone: "orange", fill: "solid", stroke: false, r: 3 });
        b += text(x + w + 8, barY + 11, String(c.tokens), { baseline: "middle", size: 14, weight: 700, tone: "orange" });
      } else {
        const w = 30 * perTok;
        b += rect(x, barY, w, 22, { tone: "orange", fill: "solid", stroke: false, r: 3, opacity: 0.35 });
        b += arrow(x + w + 4, barY + 11, x + w + 44, barY + 11, { tone: "orange", sw: 2, dash: true });
        b += text(x + w + 50, barY + 5, "more than 30", { baseline: "middle", size: 12.5, weight: 600, tone: "orange" });
        b += text(x + w + 50, barY + 20, "not measured", { baseline: "middle", size: 12, tone: "muted", italic: true });
      }
      if (i < CALLS.length - 1) b += arrow(x + CW + 6, top + boxH / 2, x + CW + GAP - 6, top + boxH / 2, { tone: "muted" });
    });
    // legend
    const ly = top + boxH + 84;
    b += rect(X, ly - 8, 16, 16, { tone: "blue", r: 3, sw: 1.1 });
    b += text(X + 24, ly, "new since the last call", { baseline: "middle", size: 12.5 });
    b += rect(X + 200, ly - 8, 16, 16, { tone: "grey", r: 3, sw: 1.1 });
    b += text(X + 224, ly, "sent again, unchanged", { baseline: "middle", size: 12.5 });
    b += rect(X + 400, ly - 8, 16, 16, { tone: "blue", r: 3, sw: 1.1, dash: true });
    b += text(X + 424, ly, "placeholder, not from the docs", { baseline: "middle", size: 12.5 });
    return svg(
      {
        width: X * 2 + CW * 3 + GAP * 2,
        height: ly + 14,
        title: "The model remembers nothing: every call resends the whole list",
        credit: "Calls 1 and 2 and their token counts: Anthropic's \"Using the Messages API\" docs (checked 2026-09-23).",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
