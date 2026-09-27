import { arrow, box, line, rect, text, svg, type Figure, type Tone } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// Figure: checking one answer claim by claim. An illustrative example (the refund
// policy from the article), scored with the two metrics defined in
// sources/gao-alce.md: citation recall per sentence (do its citations together
// support it?) and citation precision per citation (is it needed?).

type Row = {
  sentence: string[];
  cites: { id: string; verdict: "supports" | "irrelevant" }[];
  recall: 0 | 1;
  note: string;
};

const ROWS: Row[] = [
  {
    sentence: ["“Refunds are available within", "30 days of purchase.”"],
    cites: [{ id: "[1]", verdict: "supports" }],
    recall: 1,
    note: "supported",
  },
  {
    sentence: ["“Opened software can't", "be refunded.”"],
    cites: [
      { id: "[2]", verdict: "supports" },
      { id: "[3]", verdict: "irrelevant" },
    ],
    recall: 1,
    note: "supported, but [3] adds nothing",
  },
  {
    sentence: ["“Most stores accept returns", "of unopened items.”"],
    cites: [],
    recall: 0,
    note: "no citation: from memory",
  },
];

const PASSAGES = [
  { id: "[1]", lines: ["Refunds are available within", "30 days of purchase."] },
  { id: "[2]", lines: ["Opened software is not", "refundable."] },
  { id: "[3]", lines: ["Our support team is open", "Monday to Friday."] },
];

const claimCheck: Figure = {
  slug: "claim-check",
  alt: "One answer split into three sentences, each checked against the passages it cites. The first sentence cites passage 1, which supports it: recall 1. The second cites passages 2 and 3; passage 2 supports it and passage 3, about support hours, adds nothing, so recall is 1 but passage 3 is an irrelevant citation. The third sentence, that most stores accept returns of unopened items, has no citation and comes from the model's memory: recall 0. Citation recall is 2 of 3 sentences, citation precision is 2 of 3 citations.",
  render() {
    const sx = 24, sw = 250, cx = 300, px = 470, pw = 220, vx = 780, rh = 62, rg = 22, top = 28;
    let body = "";
    body += text(sx, 12, "The answer, one sentence per row", { size: 12.5, weight: 600, tone: "muted" });
    body += text(cx, 12, "Cites", { size: 12.5, weight: 600, tone: "muted" });
    body += text(px, 12, "Retrieved passages", { size: 12.5, weight: 600, tone: "muted" });
    body += text(vx + 70, 12, "Recall", { size: 12.5, weight: 600, tone: "muted", anchor: "middle" });

    const rowY = (i: number) => top + i * (rh + rg);
    // passages column, spread over the same height
    const colH = 3 * rh + 2 * rg;
    const ph = 54, pg = (colH - 3 * ph) / 2;
    const passY: Record<string, number> = {};
    PASSAGES.forEach((p, i) => {
      const y = top + i * (ph + pg);
      passY[p.id] = y + ph / 2;
      body += rect(px, y, pw, ph, { tone: "grey", fill: "soft" });
      body += text(px + 12, y + 20, p.id, { size: 13, weight: 700, tone: "blue" });
      body += text(px + 42, y + 20, p.lines[0], { size: 13 });
      body += text(px + 42, y + 38, p.lines[1], { size: 13 });
    });

    ROWS.forEach((r, i) => {
      const y = rowY(i), mid = y + rh / 2;
      const tone: Tone = r.recall ? "green" : "red";
      body += box(sx, y, sw, rh, r.sentence, { tone, fill: "soft", size: 13 });
      if (r.cites.length === 0) {
        body += text(cx, mid, "none", { size: 13, tone: "red", baseline: "middle", weight: 600 });
      }
      r.cites.forEach((c, k) => {
        const tx = cx;
        const cy = r.cites.length === 1 ? mid : mid + (k === 0 ? -15 : 15);
        const ct: Tone = c.verdict === "supports" ? "green" : "orange";
        body += rect(tx, cy - 12, 40, 24, { tone: ct, fill: "soft", r: 4 });
        body += text(tx + 20, cy, c.id, { size: 13, weight: 700, anchor: "middle", baseline: "middle", tone: ct });
        body += line(tx + 40, cy, px - 4, passY[c.id], { tone: ct, sw: 1.4, dash: c.verdict === "irrelevant" });
      });
      body += text(vx + 70, mid - 6, String(r.recall), { size: 22, weight: 700, anchor: "middle", baseline: "middle", tone });
      body += text(vx + 70, mid + 16, r.note, { size: 11.5, anchor: "middle", tone: "muted" });
    });

    const by = top + colH + 36;
    body += line(sx, by - 16, vx + 160, by - 16, { tone: "grid", sw: 1 });
    body += text(sx, by + 4, "Citation recall = sentences fully supported ÷ sentences = 2 ÷ 3", { size: 14, weight: 600 });
    body += text(sx, by + 28, "Citation precision = citations that are needed ÷ citations = 2 ÷ 3  (the [3] on row 2 is irrelevant)", { size: 14, weight: 600 });
    return svg(
      {
        width: vx + 190,
        height: by + 40,
        title: "Grounding is checked claim by claim",
        credit: "Illustrative example. Metrics as defined in Gao et al., “Enabling LLMs to Generate Text with Citations” (ALCE, 2023).",
        desc: claimCheck.alt,
      },
      body,
    );
  },
};

export default [claimCheck];
