import { arrow, box, path, text, svg, type Figure, type Tone } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// Figure: the four states of one chat turn. State names and what each is for
// come from sources/vercel-ai-sdk-chatbot.md (spinner while submitted, Stop
// while submitted/streaming, input enabled only when ready, generic error +
// retry via regenerate). The transitions are our own design, not the SDK's spec.

type S = { name: string; tone: Tone; show: string[] };
const STATES: S[] = [
  { name: "Submitted", tone: "blue", show: ["nothing back yet:", "spinner + Stop"] },
  { name: "Streaming", tone: "purple", show: ["growing text", "+ Stop"] },
  { name: "Ready", tone: "green", show: ["input enabled,", "regenerate"] },
];

const states: Figure = {
  slug: "states",
  alt: "A state diagram for one chat turn. Submitted: the request is sent and nothing has arrived, so show a spinner and a Stop button. Streaming: text is arriving, so show the growing text and the Stop button. Ready: the answer is complete, so re-enable the input and offer regenerate. Error: show a generic message and a retry button. Stop from submitted or streaming aborts the request and goes to ready. Retry from error sends the request again.",
  render() {
    const x0 = 24, w = 190, h = 92, gap = 70, y = 40;
    let b = "";
    const xs = STATES.map((_, i) => x0 + 110 + i * (w + gap));
    // send
    b += text(x0, y + h / 2 - 8, "User", { size: 13, weight: 600, tone: "muted" });
    b += text(x0, y + h / 2 + 10, "sends", { size: 13, weight: 600, tone: "muted" });
    b += arrow(x0 + 50, y + h / 2, xs[0] - 4, y + h / 2, { tone: "muted" });
    STATES.forEach((s, i) => {
      const x = xs[i];
      b += box(x, y, w, h, [], { tone: s.tone, fill: "soft" });
      b += text(x + w / 2, y + 26, s.name, { size: 15, weight: 700, anchor: "middle", tone: s.tone });
      b += text(x + w / 2, y + 52, s.show[0], { size: 13, anchor: "middle" });
      b += text(x + w / 2, y + 72, s.show[1], { size: 13, anchor: "middle" });
    });
    b += arrow(xs[0] + w + 2, y + h / 2, xs[1] - 4, y + h / 2, { tone: "muted" });
    b += text(xs[0] + w + gap / 2, y + h / 2 - 8, "first", { size: 12, anchor: "middle", tone: "muted" });
    b += text(xs[0] + w + gap / 2, y + h / 2 + 18, "token", { size: 12, anchor: "middle", tone: "muted" });
    b += arrow(xs[1] + w + 2, y + h / 2, xs[2] - 4, y + h / 2, { tone: "muted" });
    b += text(xs[1] + w + gap / 2, y + h / 2 - 8, "done", { size: 12, anchor: "middle", tone: "muted" });

    // Stop: arcs over the top from submitted and streaming to ready
    const top = y - 18;
    b += path(`M${xs[0] + w / 2},${y} L${xs[0] + w / 2},${top} L${xs[2] + w / 2 - 12},${top} L${xs[2] + w / 2 - 12},${y - 3}`, { tone: "orange", arrow: true, dash: true });
    b += path(`M${xs[1] + w / 2},${y} L${xs[1] + w / 2},${top}`, { tone: "orange", dash: true });
    b += text(xs[1] + w / 2 + 70, top - 8, "Stop: abort the request, keep the partial text", { size: 12.5, tone: "orange", weight: 600 });

    // Error below
    const ey = y + h + 70, ex = xs[1];
    b += box(ex, ey, w, h, [], { tone: "red", fill: "soft" });
    b += text(ex + w / 2, ey + 26, "Error", { size: 15, weight: 700, anchor: "middle", tone: "red" });
    b += text(ex + w / 2, ey + 52, "“Something went wrong”", { size: 13, anchor: "middle" });
    b += text(ex + w / 2, ey + 72, "+ Retry", { size: 13, anchor: "middle" });
    b += arrow(xs[0] + w / 2, y + h + 2, ex + 10, ey + h / 2, { tone: "red" });
    b += arrow(xs[1] + w / 2, y + h + 2, xs[1] + w / 2, ey - 4, { tone: "red" });
    b += text(xs[1] + w / 2 + 8, y + h + 36, "fails", { size: 12, tone: "red" });
    b += path(`M${ex},${ey + h - 14} L${xs[0] + 20},${ey + h - 14} L${xs[0] + 20},${y + h + 3}`, { tone: "muted", arrow: true });
    b += text(xs[0] + 28, ey + h - 22, "Retry", { size: 12, tone: "muted" });

    b += text(xs[2], ey + 30, "Send button: disabled", { size: 13, weight: 600 });
    b += text(xs[2], ey + 50, "unless the state is Ready.", { size: 13, weight: 600 });
    b += text(xs[2], ey + 74, "Spinner: only in Submitted.", { size: 13, tone: "muted" });

    return svg(
      {
        width: xs[2] + w + 24,
        height: ey + h + 10,
        title: "One chat turn, four states",
        credit: "State names from Vercel's AI SDK (useChat). Transitions are our own design.",
        desc: states.alt,
      },
      b,
    );
  },
};

export default [states];
