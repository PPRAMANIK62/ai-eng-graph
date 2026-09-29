import { arrow, box, line, rect, text, svg, type Figure } from "../../lib/svg.ts";

// sources/wang-vall-e.md: 3-second acoustic prompt, AR model for the first
// quantizer, NAR model for quantizers 2-8, codec decoder to waveform; EnCodec
// at 24 kHz → 75 Hz frames, 8 quantizers, a 10-second clip is 750 × 8 codes.
// 240,000 = 24,000 × 10 and 6,000 = 750 × 8 are arithmetic on those numbers.
const codec: Figure = {
  slug: "codec",
  alt: "How codec-based text-to-speech works. Top: the text and a 3-second sample of the target voice go into a language model that predicts the first code of each audio frame one after another. A second model fills in the other 7 codes of each frame. The codec decoder turns the codes back into a waveform. Bottom: ten seconds of 24 kHz audio is 240,000 samples, but only 750 codec frames of 8 codes each, 6,000 codes in total.",
  render() {
    let b = "";
    b += text(20, 10, "Predict codec codes like text tokens, then decode them to sound", { size: 13.5, weight: 600 });
    const y = 40;
    b += box(20, y, 150, 30, "text to say", { tone: "grey", size: 12.5 });
    b += box(20, y + 40, 150, 30, "3-second voice sample", { tone: "grey", size: 12.5 });
    b += arrow(172, y + 15, 208, y + 45, { tone: "muted" });
    b += arrow(172, y + 55, 208, y + 55, { tone: "muted" });
    b += box(210, y + 20, 170, 52, ["model 1: first code", "of each frame, in order"], { tone: "orange", size: 12.5 });
    b += arrow(382, y + 46, 412, y + 46, { tone: "muted" });
    b += box(414, y + 20, 170, 52, ["model 2: fills in", "the other 7 codes"], { tone: "purple", size: 12.5 });
    b += arrow(586, y + 46, 616, y + 46, { tone: "muted" });
    b += box(618, y + 20, 120, 52, "codec decoder", { tone: "blue", size: 12.5, weight: 600 });
    b += arrow(740, y + 46, 770, y + 46, { tone: "muted" });
    // tiny waveform
    let d = `M772,${y + 46}`;
    for (let i = 0; i <= 50; i++) {
      const x = 772 + i * 2.6;
      const a = 14 * Math.abs(Math.sin(i * 0.5) * Math.cos(i * 0.17)) + 1;
      d += ` L${x.toFixed(1)},${(y + 46 + (i % 2 ? a : -a)).toFixed(1)}`;
    }
    b += `<path d="${d}" class="s-grey" fill="none" stroke-width="1.2"/>`;
    b += text(837, y + 84, "waveform", { anchor: "middle", size: 12, tone: "muted" });

    // Bottom: sequence length comparison
    const y2 = 150;
    b += line(20, y2 - 12, 910, y2 - 12, { tone: "grid", sw: 1 });
    b += text(20, y2 + 8, "Why: ten seconds of speech, counted two ways", { size: 13.5, weight: 600 });
    const x0 = 250, full = 640;
    const rows = [
      { label: "raw 24 kHz samples", n: 240000, tone: "grey" as const, note: "240,000 values, each 1 of 65,536" },
      { label: "codec frames (75 a second)", n: 750, tone: "blue" as const, note: "750 frames × 8 codes = 6,000 codes, each 1 of 1,024" },
    ];
    rows.forEach((r, i) => {
      const cy = y2 + 40 + i * 50;
      b += text(x0 - 12, cy + 11, r.label, { anchor: "end", baseline: "middle", size: 12.5 });
      const w = Math.max(3, (r.n / 240000) * full);
      b += rect(x0, cy, w, 22, { tone: r.tone, fill: i === 0 ? "soft" : "solid", stroke: i === 0, r: 2 });
      b += text(i === 0 ? x0 + 10 : x0 + w + 10, cy + 11, r.note, { baseline: "middle", size: 12.5, weight: 600, tone: i === 0 ? "ink" : "blue" });
    });
    b += text(x0, y2 + 150, "320 times fewer time steps in the sequence the model predicts", { size: 12, tone: "muted" });
    return svg(
      {
        width: 930,
        height: y2 + 160,
        title: "How codec-based text-to-speech works",
        credit: "Adapted from Wang et al., “Neural Codec Language Models are Zero-Shot Text to Speech Synthesizers” (VALL-E, Microsoft, 2023).",
        desc: codec.alt,
      },
      b,
    );
  },
};

export default [codec];
