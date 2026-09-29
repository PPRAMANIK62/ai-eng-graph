import { arrow, box, rect, svg, text, type Figure } from "../../lib/svg.ts";

// sources/langfuse-masking.md (client-side mask at export; card regex placeholder),
// sources/otel-genai-spans.md (message capture is opt-in), sources/openai-data-controls.md
// (provider retention). The message is our own example.
const flow: Figure = {
  slug: "flow",
  alt: "One user message with a name and a card number, and the three places it can go: to the model provider in the prompt, where retention depends on the provider's policy; to your trace store, where a masking function can replace the card number with a placeholder before export; and on into eval sets built from traces. The mask protects the trace, not what the provider received.",
  render() {
    let b = "";
    b += rect(20, 20, 250, 96, { tone: "grey", fill: "soft" });
    b += text(34, 42, "user message", { size: 12.5, weight: 700, tone: "muted" });
    b += text(34, 66, "“I'm Priya Shah, my card", { size: 13 });
    b += text(34, 86, "4111 1111 1111 1111 was", { size: 13 });
    b += text(34, 106, "charged twice.”", { size: 13 });
    b += box(320, 48, 110, 40, "your app", { tone: "blue", size: 13, weight: 600 });
    b += arrow(272, 68, 316, 68, { tone: "muted" });
    // provider
    b += box(520, 0, 250, 40, "model provider (the prompt)", { tone: "orange", size: 13, weight: 600 });
    b += text(530, 58, "full text; kept per the provider's policy", { size: 12, tone: "orange" });
    b += arrow(432, 60, 516, 22, { tone: "orange" });
    // mask + traces
    b += box(470, 104, 80, 36, "mask", { tone: "green", size: 13, weight: 700 });
    b += arrow(432, 78, 466, 114, { tone: "muted" });
    b += box(590, 104, 180, 36, "trace store", { tone: "blue", size: 13, weight: 600 });
    b += arrow(552, 122, 586, 122, { tone: "green" });
    b += text(470, 162, "“... my card [REDACTED CREDIT CARD] ...”", { size: 12, tone: "green" });
    b += text(470, 180, "(names need a detector; a regex misses them)", { size: 12, tone: "muted" });
    // evals
    b += box(590, 204, 180, 36, "eval sets, reviews", { tone: "grey", size: 13 });
    b += arrow(755, 142, 755, 200, { tone: "muted" });
    b += text(20, 170, "Message capture on LLM spans", { size: 12.5, weight: 600 });
    b += text(20, 188, "is opt-in: off by default.", { size: 12.5 });
    b += text(20, 224, "The mask cleans the trace,", { size: 12.5, weight: 600 });
    b += text(20, 242, "not what the provider got.", { size: 12.5, weight: 600 });
    return svg(
      {
        width: 800,
        height: 256,
        title: "Where one message with personal data can end up",
        credit: "Based on Langfuse masking docs, the OpenTelemetry GenAI spans spec and OpenAI data controls. Message is our example.",
        desc: flow.alt,
      },
      b,
    );
  },
};

export default [flow];
