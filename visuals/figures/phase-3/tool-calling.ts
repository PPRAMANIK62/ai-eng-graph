import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// The round trip: sources/anthropic-tool-use-overview.md (get_weather example,
// its input, the "15 degrees Celsius, partly cloudy" result and the final answer)
// and sources/anthropic-how-tool-use-works.md (stop_reason tool_use, tool_result,
// "The model never executes anything on its own").
const roundTrip: Figure = {
  slug: "round-trip",
  alt: "The tool-calling round trip for one question. Request 1: your app sends the user's message and the get_weather tool definition. The model replies with stop_reason tool_use and a tool_use block naming get_weather with location San Francisco, CA. Your code runs the lookup and gets \"15 degrees Celsius, partly cloudy\". Request 2: your app sends the whole history plus a tool_result block with that text, linked by the call's id. The model replies with end_turn and the answer in plain words. The model never runs the function; your code does.",
  render() {
    const APP = 150; // x of the app lane centre
    const API = 690; // x of the model lane centre
    let b = "";
    // lane headers
    b += box(APP - 110, 0, 220, 38, "Your app", { tone: "blue", size: 14, weight: 700 });
    b += box(API - 110, 0, 220, 38, "Model (via the API)", { tone: "orange", size: 14, weight: 700 });
    b += line(APP, 38, APP, 470, { tone: "grid", sw: 1.5, dash: true });
    b += line(API, 38, API, 470, { tone: "grid", sw: 1.5, dash: true });

    const msg = (y: number, dir: "right" | "left", label: string, lines: string[], tone: Tone) => {
      let s = "";
      const x1 = dir === "right" ? APP + 6 : API - 6;
      const x2 = dir === "right" ? API - 8 : APP + 8;
      s += arrow(x1, y, x2, y, { tone, sw: 2 });
      s += text((APP + API) / 2, y - 10, label, { anchor: "middle", size: 13, weight: 700, tone });
      lines.forEach((l, i) => {
        s += text((APP + API) / 2, y + 20 + i * 18, l, { anchor: "middle", size: 12.5, mono: true, tone: "muted" });
      });
      return s;
    };

    b += text(24, 70, "1", { size: 18, weight: 700, tone: "muted", display: true });
    b += msg(80, "right", "Request 1: messages + tools", ['user: "What\'s the weather in San Francisco?"', "tools: [get_weather(location)]"], "blue");

    b += text(24, 168, "2", { size: 18, weight: 700, tone: "muted", display: true });
    b += msg(178, "left", "Reply: stop_reason \"tool_use\"", ['tool_use: get_weather', '{"location": "San Francisco, CA"}'], "orange");

    // your code runs it
    b += rect(APP - 130, 236, 260, 62, { tone: "green", fill: "soft" });
    b += text(APP, 258, "Your code runs get_weather", { anchor: "middle", size: 13, weight: 700, tone: "green" });
    b += text(APP, 280, '"15 degrees Celsius, partly cloudy"', { anchor: "middle", size: 12, mono: true });
    b += text(24, 272, "3", { size: 18, weight: 700, tone: "muted", display: true });
    b += text(API, 266, "the model waits:", { anchor: "middle", size: 12.5, tone: "muted", italic: true });
    b += text(API, 284, "it can't run your code", { anchor: "middle", size: 12.5, tone: "muted", italic: true });

    b += text(24, 334, "4", { size: 18, weight: 700, tone: "muted", display: true });
    b += msg(344, "right", "Request 2: whole history + tool_result", ["tool_result (same id as the call):", '"15 degrees Celsius, partly cloudy"'], "blue");

    b += text(24, 432, "5", { size: 18, weight: 700, tone: "muted", display: true });
    b += msg(442, "left", "Reply: stop_reason \"end_turn\"", ['"The current weather in San Francisco is', '15 degrees Celsius with partly cloudy skies."'], "orange");

    return svg(
      {
        width: 860,
        height: 500,
        title: "A tool call is a round trip through your code",
        credit: "Example from Anthropic's tool use docs (get_weather). OpenAI's function calling runs the same five steps.",
        desc: roundTrip.alt,
      },
      b,
    );
  },
};

// sources/patil-bfcl.md, Table 1, row gpt-4o-2024-11-20 (FC), overall 65.8,
// second in the table behind the same model in prompting mode (66.4).
const ROWS: { label: string; value: number; group: string }[] = [
  { label: "Pick among several tools", value: 93.5, group: "single" },
  { label: "No tool fits: don't call", value: 83.1, group: "single" },
  { label: "One tool, one call", value: 77.2, group: "single" },
  { label: "Basic conversation", value: 62.5, group: "multi" },
  { label: "Long context", value: 58.0, group: "multi" },
  { label: "Missing parameter", value: 37.5, group: "multi" },
  { label: "Missing function", value: 6.0, group: "multi" },
  { label: "Memory", value: 0.0, group: "agentic" },
];

const bfcl: Figure = {
  slug: "bfcl",
  alt: "Bar chart of one model's BFCL scores by category, from the 2025 paper: GPT-4o 2024-11-20 in native tool-calling mode. Single-turn, pick among several tools: 93.5%. Single-turn, one tool: 77.2%. Recognise that no tool fits (irrelevance): 83.1%. Multi-turn, basic: 62.5%. Multi-turn, long context: 58.0%. Multi-turn, missing parameter: 37.5%. Multi-turn, missing function: 6.0%. Agentic memory: 0.0%. Overall 65.8%.",
  render() {
    const lw = 250;
    const x0 = 40 + lw;
    const w = 420;
    const rowH = 34;
    let b = "";
    const groups: Record<string, { title: string; tone: Tone }> = {
      single: { title: "Single turn", tone: "green" },
      multi: { title: "Multi-turn", tone: "orange" },
      agentic: { title: "Agentic", tone: "red" },
    };
    let y = 10;
    let last = "";
    for (const r of ROWS) {
      if (r.group !== last) {
        if (last) y += 10;
        b += text(40, y + 12, groups[r.group].title, { size: 13, weight: 700, tone: groups[r.group].tone });
        y += 24;
        last = r.group;
      }
      const tone = groups[r.group].tone;
      b += text(x0 - 12, y + rowH / 2 - 2, r.label, { anchor: "end", baseline: "middle", size: 13 });
      const bw = (r.value / 100) * w;
      b += rect(x0, y + 4, Math.max(bw, 2), rowH - 14, { tone, fill: "solid", stroke: false, r: 2 });
      b += text(x0 + Math.max(bw, 2) + 8, y + rowH / 2 - 2, `${r.value.toFixed(1)}%`, { baseline: "middle", size: 12.5, weight: 600, tone });
      y += rowH;
    }
    // axis
    b += line(x0, 30, x0, y, { tone: "axis" });
    for (const t of [0, 50, 100]) {
      const tx = x0 + (t / 100) * w;
      b += line(tx, y, tx, y + 5, { tone: "axis" });
      b += text(tx, y + 19, `${t}%`, { anchor: "middle", size: 11.5, tone: "muted" });
    }
    b += text(x0 + w / 2, y + 40, "accuracy on the category (overall 65.8%)", { anchor: "middle", size: 12, tone: "muted" });
    return svg(
      {
        width: x0 + w + 80,
        height: y + 50,
        title: "Choosing among tools scores high; noticing that no tool fits does not",
        credit: "Data: Patil et al., BFCL (ICML 2025), Table 1: GPT-4o 2024-11-20, native tool-calling mode. Late-2024 model.",
        desc: bfcl.alt,
      },
      b,
    );
  },
};

export default [roundTrip, bfcl];
