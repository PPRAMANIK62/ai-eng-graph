import { bracket, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Where the time goes in one call. Not to scale: no durations, only the order of the
// stages and what each number covers.
// TTFT = queueing + prefill + network (sources/nvidia-nim-benchmarking-metrics.md).
// Time to first answer token and end-to-end including reasoning
// (sources/artificial-analysis-methodology.md).
// Output vs input heuristic: sources/openai-latency-optimization.md.

const pathAlt =
  "One model call as a row of stages, not to scale. Network out and waiting in the provider's queue, then prefill of the whole prompt, then, for reasoning models only, thinking tokens, then the answer tokens one at a time, then the last bytes back. Brackets above: time to first token covers network, queue and prefill. For a reasoning model, time to first answer token runs on through the thinking. End-to-end time covers everything. Under each stage, what makes it longer: distance and region, how busy the server is, prompt length, how much the model thinks, and answer length.";

const requestPath: Figure = {
  slug: "request-path",
  alt: pathAlt,
  render() {
    type Seg = { label: string[]; w: number; tone: Tone; grows: string[]; dash?: boolean };
    const segs: Seg[] = [
      { label: ["network", "+ queue"], w: 130, tone: "grey", grows: ["distance,", "server load"] },
      { label: ["prefill"], w: 110, tone: "orange", grows: ["prompt", "length"] },
      { label: ["thinking", "tokens"], w: 170, tone: "purple", grows: ["reasoning", "models only"], dash: true },
      { label: ["answer tokens,", "one at a time"], w: 330, tone: "blue", grows: ["answer", "length"] },
      { label: ["last", "bytes"], w: 70, tone: "grey", grows: ["network"] },
    ];
    const x0 = 30;
    const by = 150;
    const bh = 56;
    let b = "";
    let x = x0;
    const starts: number[] = [];
    for (const s of segs) {
      starts.push(x);
      b += rect(x + 2, by, s.w - 4, bh, { tone: s.tone, fill: "soft", dash: s.dash, r: 4 });
      const top = by + bh / 2 - ((s.label.length - 1) * 17) / 2;
      s.label.forEach((l, i) => (b += text(x + s.w / 2, top + i * 17, l, { anchor: "middle", baseline: "middle", size: 13.5, weight: 600, tone: s.tone === "grey" ? "muted" : s.tone })));
      b += text(x + s.w / 2, by + bh + 26, s.grows[0], { anchor: "middle", size: 12.5, tone: "muted" });
      if (s.grows[1]) b += text(x + s.w / 2, by + bh + 43, s.grows[1], { anchor: "middle", size: 12.5, tone: "muted" });
      x += s.w;
    }
    const end = x;
    b += text(x0, by + bh + 72, "Under each stage: what makes it longer.", { size: 12, tone: "muted", italic: true });

    // Markers
    const firstTok = starts[2];
    const firstAnswer = starts[3];
    b += line(firstTok, by - 6, firstTok, by + bh + 6, { tone: "ink", sw: 1.5, dash: true });
    b += line(firstAnswer, by - 6, firstAnswer, by + bh + 6, { tone: "purple", sw: 1.5, dash: true });

    // Brackets, top down
    b += bracket(x0 + 2, end - 2, 22, "end-to-end time: everything, including thinking", { up: false, tone: "ink" });
    b += bracket(x0 + 2, firstAnswer, 70, "time to first answer token (reasoning models)", { tone: "purple" });
    b += bracket(x0 + 2, firstTok, 118, "time to first token", { tone: "ink" });

    return svg(
      {
        width: end + x0,
        height: by + bh + 84,
        title: "Where the time goes in one model call",
        credit: "Not to scale. Stages from NVIDIA's NIM benchmarking docs (2026) and Artificial Analysis's methodology (2026).",
        desc: pathAlt,
      },
      b,
    );
  },
};

const leverAlt =
  "Two bars comparing rules of thumb for cutting latency. Cutting the output by half cuts about 50% of the response time. Cutting the prompt by half cuts only 1 to 5%, unless the context is very large.";

const levers: Figure = {
  slug: "output-vs-prompt",
  alt: leverAlt,
  render() {
    const x0 = 210;
    const W = 480;
    const scale = (p: number) => x0 + (p / 60) * W;
    let b = "";
    const rows = [
      { y: 20, label: "Halve the output", lo: 50, hi: 50, tone: "blue" as Tone, value: "about 50% less time" },
      { y: 90, label: "Halve the prompt", lo: 1, hi: 5, tone: "orange" as Tone, value: "1–5% less time" },
    ];
    for (const r of rows) {
      b += text(x0 - 14, r.y + 22, r.label, { anchor: "end", baseline: "middle", size: 14, weight: 600 });
      b += rect(x0, r.y, scale(r.lo) - x0, 44, { tone: r.tone, fill: "solid", stroke: false, r: 2 });
      if (r.hi > r.lo) b += rect(scale(r.lo), r.y, scale(r.hi) - scale(r.lo), 44, { tone: r.tone, fill: "soft", stroke: true, r: 2 });
      b += text(scale(r.hi) + 10, r.y + 22, r.value, { baseline: "middle", size: 13.5, weight: 600, tone: r.tone });
    }
    b += line(x0, 10, x0, 144, { tone: "axis" });
    for (const t of [0, 10, 20, 30, 40, 50, 60]) {
      b += line(scale(t), 144, scale(t), 149, { tone: "axis" });
      b += text(scale(t), 164, `${t}%`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += line(x0, 144, scale(60), 144, { tone: "axis" });
    b += text(x0 + W / 2, 186, "share of total response time saved", { anchor: "middle", size: 12, tone: "muted" });
    b += text(24, 214, "The prompt matters more only with very large contexts (long documents, images).", { size: 12.5, tone: "muted" });
    return svg(
      {
        width: x0 + W + 180,
        height: 226,
        title: "Shorter answers save far more time than shorter prompts",
        credit: "Rules of thumb from OpenAI's latency optimization guide, not a measurement.",
        desc: leverAlt,
      },
      b,
    );
  },
};

export default [requestPath, levers];
