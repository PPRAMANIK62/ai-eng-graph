import { arrow, box, esc, fmt, line, path, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// The loop and the worked example come from sources/instructor-reask-validation.md:
// input "Extract jason is 25 years old", a validator that requires the name in uppercase
// ("Name must be in uppercase."), max_retries=2, and the reask message
// "Please correct the function call; errors encountered: ...". The corrected reply
// shown (JASON) is what the validator requires, drawn as the passing case.

const CODE_FONT = "'Noto Sans Mono', 'JetBrains Mono', Menlo, Consolas, monospace";
const code = (x: number, y: number, s: string, tone: Tone, size = 12.5) =>
  `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${size}" dominant-baseline="central" class="t-${tone}" style="font-family:${CODE_FONT}" xml:space="preserve">${esc(s)}</text>`;

const loop: Figure = {
  slug: "retry-loop",
  alt: "A loop. Call the model with the schema. Parse and validate the reply. If it passes, use it. If it fails, append the bad reply and the error message to the messages and call again, until the retry budget runs out. The example from Instructor's docs: the input says jason is 25 years old, a validator requires the name in uppercase, the first reply has name jason and fails with the error Name must be in uppercase, and the retry comes back with JASON.",
  render() {
    let b = "";
    // Top row: the loop
    const y = 20;
    b += box(20, y, 170, 50, ["call the model", "with the schema"], { tone: "blue", size: 13, weight: 600 });
    b += arrow(192, y + 25, 238, y + 25, { tone: "muted" });
    b += box(240, y, 170, 50, ["parse and run", "the validators"], { tone: "purple", size: 13, weight: 600 });
    b += arrow(412, y + 25, 478, y + 25, { tone: "green" });
    b += text(445, y + 14, "pass", { anchor: "middle", size: 12.5, tone: "green", weight: 600 });
    b += box(480, y, 130, 50, "use it", { tone: "green", size: 13, weight: 600 });
    // fail branch
    b += arrow(325, y + 52, 325, y + 98, { tone: "red" });
    b += text(335, y + 78, "fail", { size: 12.5, tone: "red", weight: 600 });
    b += box(190, y + 100, 270, 50, ["append the bad reply + the error", "as a new message"], { tone: "red", size: 13 });
    b += path(`M190,${y + 125} L105,${y + 125} L105,${y + 54}`, { tone: "red", arrow: true });
    b += text(98, y + 104, "retry", { anchor: "end", size: 12.5, tone: "red", weight: 600 });
    b += text(480, y + 118, "stop when the retry", { size: 12.5, tone: "muted" });
    b += text(480, y + 136, "budget runs out", { size: 12.5, tone: "muted" });

    // Example
    const ey = y + 185;
    b += line(20, ey - 14, 860, ey - 14, { tone: "grid", sw: 1 });
    b += text(20, ey + 6, "Example: a validator requires the name in uppercase", { size: 13.5, weight: 600 });
    const rows: { label: string; body: string; tone: Tone; note?: string }[] = [
      { label: "input", body: "\"Extract jason is 25 years old\"", tone: "ink" },
      { label: "reply 1", body: "{\"name\": \"jason\", \"age\": 25}", tone: "red", note: "fails: Name must be in uppercase." },
      { label: "sent back", body: "Please correct the function call; errors encountered: ...", tone: "muted" },
      { label: "reply 2", body: "{\"name\": \"JASON\", \"age\": 25}", tone: "green", note: "passes" },
    ];
    rows.forEach((r, i) => {
      const ry = ey + 30 + i * 34;
      b += text(20, ry + 13, r.label, { size: 12.5, tone: "muted", weight: 600, baseline: "middle" });
      b += rect(110, ry, r.note ? 330 : 490, 26, { tone: r.tone === "ink" || r.tone === "muted" ? "grey" : r.tone, fill: "soft", r: 4 });
      b += code(120, ry + 13, r.body, r.tone === "muted" ? "muted" : "ink");
      if (r.note) b += text(455, ry + 13, r.note, { size: 12.5, baseline: "middle", tone: r.tone, weight: 600 });
    });
    return svg(
      {
        width: 880,
        height: ey + 30 + 4 * 34,
        title: "Validate, then ask again with the error",
        credit: "Loop and example adapted from Instructor, “Validation and Reasking” (docs).",
        desc: loop.alt,
      },
      b,
    );
  },
};

export default [loop];
