import { scaleLinear } from "../../lib/chart.ts";
import { line, rect, text, svg, type Figure, type Tone } from "../../lib/svg.ts";

// sources/kramer-voice-ai-primer.md, 5.1 latency table (ms). Grouped here:
// audio in = mic 40 + opus enc 21 + network 10 + packets 2 + jitter 40 + opus dec 1 = 114
// audio out = opus enc 21 + packets 2 + network 10 + jitter 40 + opus dec 1 + speaker 15 = 89
// Total 1,293. 500 ms typical human response, 1,500 ms target: same source.
const STAGES: { label: string[]; ms: number; tone: Tone }[] = [
  { label: ["audio in"], ms: 114, tone: "grey" },
  { label: ["speech-to-text", "+ end of turn"], ms: 300, tone: "blue" },
  { label: ["LLM time to", "first token"], ms: 650, tone: "orange" },
  { label: ["sentence"], ms: 20, tone: "grey" },
  { label: ["TTS first audio"], ms: 120, tone: "purple" },
  { label: ["audio out"], ms: 89, tone: "grey" },
];

const budget: Figure = {
  slug: "latency-budget",
  alt: "The time from the caller finishing speaking to hearing the first word of the reply, in one typical chained voice agent: about 114 ms to capture and send the audio, 300 ms for transcription and deciding the turn is over, 650 ms for the LLM's first token, 20 ms to collect a sentence, 120 ms for the first text-to-speech audio, and 89 ms to send and play it. Total 1,293 ms. A typical human reply comes after about 500 ms; 1,500 ms is the suggested target for a voice agent.",
  render() {
    const p = { x: 30, y: 60, w: 840, h: 44 };
    const xs = scaleLinear().domain([0, 1600]).range([p.x, p.x + p.w]);
    let b = "";
    let t = 0;
    STAGES.forEach((s, i) => {
      const x0 = xs(t), x1 = xs(t + s.ms);
      b += rect(x0, p.y, x1 - x0 - 1.5, p.h, { tone: s.tone, fill: "soft", sw: 1.8, r: 2 });
      const mid = (x0 + x1) / 2;
      const wide = x1 - x0 > 70;
      if (wide) {
        b += text(mid, p.y + p.h / 2, `${s.ms} ms`, { anchor: "middle", baseline: "middle", size: 12.5, weight: 700, tone: s.tone === "grey" ? "ink" : "ink" });
      }
      // labels alternate above/below to avoid collisions on thin segments
      const above = i % 2 === 0;
      const last = i === STAGES.length - 1;
      const ly = last ? p.y + p.h / 2 - 7 : above ? p.y - 30 : p.y + p.h + 18;
      const lab = wide ? s.label : [...s.label.slice(0, 1), `${s.ms} ms`];
      lab.forEach((l, j) => {
        b += text(last ? x1 + 10 : mid, ly + j * 15, l, { anchor: last ? "start" : "middle", baseline: last ? "middle" : "auto", size: 12, tone: s.tone === "grey" ? "muted" : s.tone });
      });
      t += s.ms;
    });
    // markers
    const marks = [
      { ms: 500, label: "500 ms: a typical human reply", tone: "green" as Tone },
      { ms: 1293, label: "1,293 ms: this agent", tone: "ink" as Tone },
      { ms: 1500, label: "1,500 ms: target", tone: "red" as Tone },
    ];
    const my = p.y + p.h + 62;
    marks.forEach((m, i) => {
      b += line(xs(m.ms), m.ms === 1293 ? p.y + p.h : p.y - 4, xs(m.ms), my + i * 18 - 12, { tone: m.tone === "ink" ? "axis" : m.tone, dash: true, sw: 1.3 });
      b += text(xs(m.ms) - 6, my + i * 18, m.label, { anchor: "end", size: 12.5, weight: 600, tone: m.tone });
    });
    // axis
    const ay = my + 66;
    b += line(p.x, ay, p.x + p.w, ay, { tone: "axis" });
    for (const v of [0, 250, 500, 750, 1000, 1250, 1500]) {
      b += line(xs(v), ay, xs(v), ay + 5, { tone: "axis" });
      b += text(xs(v), ay + 20, v === 0 ? "0" : `${v.toLocaleString("en-US")} ms`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += text(p.x, 10, "From the caller going quiet to hearing the first word back", { size: 13, tone: "muted" });
    return svg(
      {
        width: 900,
        height: ay + 30,
        title: "Where the time goes in one voice agent turn",
        credit: "Data: Kramer et al., “Voice AI & Voice Agents: An Illustrated Primer” (Pipecat, 2025, revised 2026). One typical setup.",
        desc: budget.alt,
      },
      b,
    );
  },
};

export default [budget];
