import { arrow, lines, path, rect, svg, text, wrap, type Figure, type Tone } from "../../lib/svg.ts";

// Error analysis in four steps. Numbers: about 100 traces, first 30 by hand,
// saturation (sources/husain-shankar-error-analysis.md). The three categories and
// "over 60% of all problems" are the Nurture Boss case (sources/husain-field-guide.md).
// The example notes are the article's own illustration.

type Step = { n: string; head: string; tone: Tone; body: string[] };

const alt =
  "Error analysis in four steps. 1: Collect about 100 diverse traces. 2: Open coding, a free-form note on the first thing wrong in each, the first 30 by hand. 3: Axial coding, group the notes into failure categories such as conversation flow, handoff to a person, and date handling. 4: Count each category; in the Nurture Boss case, three categories made up over 60% of all problems. The counted list decides which evals to write and what to fix first. An arrow loops back from new traces: repeat until new traces stop showing new kinds of failure.";

const steps: Figure = {
  slug: "steps",
  alt,
  render() {
    const bw = 196, gap = 26, x0 = 24, top = 8, bh = 232, headH = 40;
    const S: Step[] = [
      { n: "1", head: "Collect traces", tone: "blue", body: ["About 100 diverse", "sessions, full record", "of each. No users yet?", "Use synthetic inputs."] },
      { n: "2", head: "Open coding", tone: "purple", body: [] },
      { n: "3", head: "Axial coding", tone: "orange", body: [] },
      { n: "4", head: "Count", tone: "green", body: [] },
    ];
    let b = "";
    S.forEach((st, i) => {
      const x = x0 + i * (bw + gap);
      b += rect(x, top, bw, bh, { tone: st.tone, fill: "none", r: 10 });
      b += rect(x, top, bw, headH, { tone: st.tone, fill: "soft", r: 10 });
      b += rect(x + 0.75, top + headH - 10, bw - 1.5, 10, { tone: st.tone, fill: "soft", stroke: false, r: 0 });
      b += `<line x1="${x}" y1="${top + headH}" x2="${x + bw}" y2="${top + headH}" class="s-${st.tone}" stroke-width="1.5"/>`;
      b += text(x + 14, top + headH / 2, st.n, { size: 15, weight: 700, baseline: "middle", tone: st.tone });
      b += text(x + 32, top + headH / 2, st.head, { size: 14, weight: 700, baseline: "middle" });
      if (i < S.length - 1) b += arrow(x + bw + 4, top + bh / 2, x + bw + gap - 4, top + bh / 2, { tone: "muted", sw: 2 });
    });
    const bx = (i: number) => x0 + i * (bw + gap);
    const y0 = top + headH + 24;

    // 1: traces
    b += lines(bx(0) + 14, y0, S[0].body, { size: 13, gap: 19 });
    for (let k = 0; k < 5; k++) b += rect(bx(0) + 14 + k * 34, y0 + 92, 26, 34, { tone: "blue", fill: "soft", r: 3 });
    b += text(bx(0) + 14, y0 + 148, "one trace = one session", { size: 12, tone: "muted" });

    // 2: notes
    const notes = ["“Sunday slot, office closed”", "“no handoff, asked twice”", "“booked the wrong week”"];
    notes.forEach((nt, k) => {
      const y = y0 + k * 34;
      b += rect(bx(1) + 12, y - 6, bw - 24, 26, { tone: "purple", fill: "soft", r: 4, stroke: false });
      b += text(bx(1) + 20, y + 7, nt, { size: 12, baseline: "middle", italic: true });
    });
    b += lines(bx(1) + 14, y0 + 112, ["Free-form, first failure", "in each trace. First 30", "yourself."], { size: 12.5, tone: "muted", gap: 17 });

    // 3: categories
    const cats = ["conversation flow", "handoff to a person", "date handling", "…"];
    cats.forEach((c, k) => {
      const y = y0 + k * 30;
      if (c !== "…") b += rect(bx(2) + 12, y - 8, bw - 24, 24, { tone: "orange", fill: "soft", r: 4 });
      b += text(bx(2) + (c === "…" ? bw / 2 : 22), y + 4, c, { size: 13, baseline: "middle", anchor: c === "…" ? "middle" : "start" });
    });
    b += lines(bx(2) + 14, y0 + 122, ["Group similar notes into", "a failure taxonomy."], { size: 12.5, tone: "muted", gap: 17 });

    // 4: count
    b += text(bx(3) + bw / 2, y0 + 20, "over 60%", { size: 24, weight: 700, anchor: "middle", tone: "green" });
    b += lines(bx(3) + bw / 2, y0 + 48, ["of all problems came from", "the top three categories", "(Nurture Boss)"], { size: 12.5, anchor: "middle", gap: 17 });
    b += lines(bx(3) + 14, y0 + 122, wrap("The counts decide which evals to write and what to fix first.", bw - 28, 12.5), { size: 12.5, tone: "muted", gap: 17 });

    // loop back
    const xa = bx(3) + bw / 2, xb = bx(0) + bw / 2, ly = top + bh + 34;
    b += path(`M${xa},${top + bh + 4} L${xa},${ly} L${xb},${ly} L${xb},${top + bh + 8}`, { tone: "muted", sw: 2, arrow: true });
    b += `<rect x="${(xa + xb) / 2 - 230}" y="${ly - 12}" width="460" height="24" class="bg"/>`;
    b += text((xa + xb) / 2, ly, "Read fresh traces until they stop showing new kinds of failure.", { size: 13, anchor: "middle", baseline: "middle", tone: "muted" });

    const W = x0 * 2 + S.length * bw + (S.length - 1) * gap;
    return svg({ width: W, height: ly + 18, title: "Error analysis: read, note, group, count", credit: "Example notes are illustrative. The 60% figure is from the Nurture Boss case (Husain, 2025).", desc: alt }, b);
  },
};

export default [steps];
