import { arrow, box, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// sources/anthropic-batch-processing.md: custom_id per request, most batches
// finish within 1 hour, expiry at 24 hours, results in any order, four result
// types, 50% of standard prices. sources/openai-batch-api.md: same 24h window
// and 50% discount, output order may not match input.
const flow: Figure = {
  slug: "flow",
  alt: "How a batch runs. You build a list of ordinary requests, each with a custom_id such as ticket-1, ticket-2 and ticket-3. You submit it as one batch and poll its status. Most batches finish within an hour; anything not done in 24 hours expires. Results come back as a file in any order, for example ticket-3, ticket-1, ticket-2, and you match them to requests by custom_id. Each result is succeeded, errored, canceled or expired. Everything is billed at 50% of the normal price.",
  render() {
    let b = "";
    // requests
    b += text(20, 10, "1. Your requests", { size: 13.5, weight: 700, tone: "blue" });
    ["ticket-1", "ticket-2", "ticket-3"].forEach((id, i) => {
      b += rect(20, 26 + i * 44, 190, 36, { tone: "blue", fill: "soft" });
      b += text(32, 44 + i * 44, `custom_id: ${id}`, { size: 12, mono: true, baseline: "middle" });
    });
    b += text(20, 172, "each an ordinary request", { size: 12, tone: "muted", italic: true });
    b += arrow(214, 92, 262, 92, { tone: "muted", sw: 2 });

    // batch
    b += text(268, 10, "2. One batch, run later", { size: 13.5, weight: 700, tone: "orange" });
    b += box(268, 40, 220, 104, "", { tone: "orange" });
    b += text(378, 66, "submit, then poll", { anchor: "middle", size: 13, weight: 600 });
    b += text(378, 92, "most finish within 1 hour*", { anchor: "middle", size: 12.5 });
    b += text(378, 114, "not done in 24 hours: expires", { anchor: "middle", size: 12.5 });
    b += text(378, 172, "billed at 50% of the normal price", { anchor: "middle", size: 12, tone: "muted", italic: true });
    b += arrow(492, 92, 540, 92, { tone: "muted", sw: 2 });

    // results
    b += text(546, 10, "3. Results, in any order", { size: 13.5, weight: 700, tone: "green" });
    const res: [string, string, Tone][] = [
      ["ticket-3", "succeeded", "green"],
      ["ticket-1", "errored", "red"],
      ["ticket-2", "succeeded", "green"],
    ];
    res.forEach(([id, st, tone], i) => {
      b += rect(546, 26 + i * 44, 250, 36, { tone, fill: "soft" });
      b += text(558, 44 + i * 44, id, { size: 12, mono: true, baseline: "middle" });
      b += text(784, 44 + i * 44, st, { size: 12, anchor: "end", baseline: "middle", tone, weight: 600 });
    });
    b += text(546, 172, "match on custom_id, never on position", { size: 12, tone: "muted", italic: true });
    b += text(546, 192, "result types: succeeded, errored, canceled, expired", { size: 12, tone: "muted" });
    return svg(
      {
        width: 880,
        height: 205,
        title: "A batch: many ordinary requests, one job, results later",
        credit: "From Anthropic's Message Batches and OpenAI's Batch API docs (both 50% off, 24-hour window). *Anthropic's figure.",
        desc: flow.alt,
      },
      b,
    );
  },
};

export default [flow];
