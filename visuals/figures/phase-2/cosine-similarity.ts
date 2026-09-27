import { arrow, circle, line, path, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Four 2-D vectors from the worked table in nodes/phase-2/cosine-similarity.md.
// Plain arithmetic, no source data: cos(a,b)=1, cos(a,c)=0, cos(a,d)=-1.
type V = { name: string; x: number; y: number; tone: Tone; cos: string; lx: number; ly: number };
const VECS: V[] = [
  { name: "a (3, 4)", x: 3, y: 4, tone: "blue", cos: "", lx: -70, ly: 2 },
  { name: "b (6, 8)", x: 6, y: 8, tone: "green", cos: "cos(a, b) = 1", lx: 10, ly: 4 },
  { name: "c (4, −3)", x: 4, y: -3, tone: "orange", cos: "cos(a, c) = 0", lx: 10, ly: 14 },
  { name: "d (−3, −4)", x: -3, y: -4, tone: "red", cos: "cos(a, d) = −1", lx: -84, ly: 18 },
];

const figure: Figure = {
  slug: "angles",
  alt: "Four arrows from the same origin. a (3, 4) and b (6, 8) point the same way, so their cosine is 1 even though b is twice as long. c (4, −3) is at a right angle to a, cosine 0. d (−3, −4) points the opposite way, cosine −1.",
  render() {
    const U = 22; // pixels per unit
    const ox = 230, oy = 210; // origin
    const X = (x: number) => ox + x * U;
    const Y = (y: number) => oy - y * U;
    let b = "";
    // axes
    b += line(X(-6), oy, X(9), oy, { tone: "axis" });
    b += line(ox, Y(-5.5), ox, Y(9), { tone: "axis" });
    // right-angle mark between a and c
    const ua = [3 / 5, 4 / 5], uc = [4 / 5, -3 / 5], s = 14;
    b += path(
      `M${X(0) + ua[0]! * s},${Y(0) - ua[1]! * s} L${X(0) + (ua[0]! + uc[0]!) * s},${Y(0) - (ua[1]! + uc[1]!) * s} L${X(0) + uc[0]! * s},${Y(0) - uc[1]! * s}`,
      { tone: "muted", sw: 1.2 },
    );
    // b first (so a draws on top of it)
    for (const v of [VECS[1]!, VECS[0]!, VECS[2]!, VECS[3]!]) {
      b += arrow(ox, oy, X(v.x), Y(v.y), { tone: v.tone, sw: v.name.startsWith("a") ? 3.5 : 2.5 });
      b += text(X(v.x) + v.lx, Y(v.y) + v.ly, v.name, { size: 13, weight: 600, tone: v.tone });
    }
    b += circle(ox, oy, 3.5, { tone: "ink" });

    // readout on the right
    const rx = 470;
    b += text(rx, 30, "Compared with a:", { size: 14, weight: 600 });
    const rows = [
      { t: "b: same direction, twice as long", c: "cos = 1", tone: "green" as Tone },
      { t: "c: at a right angle", c: "cos = 0", tone: "orange" as Tone },
      { t: "d: opposite direction", c: "cos = −1", tone: "red" as Tone },
    ];
    rows.forEach((r, i) => {
      const y = 70 + i * 58;
      b += text(rx, y, r.c, { size: 15, weight: 700, tone: r.tone });
      b += text(rx, y + 20, r.t, { size: 13, tone: "muted" });
    });
    b += text(rx, 270, "Only the angle counts.", { size: 13 });
    b += text(rx, 289, "Length doesn't change the score.", { size: 13 });
    return svg(
      {
        width: 740,
        height: 345,
        title: "Cosine similarity measures the angle, not the length",
        credit: "Made-up two-number vectors; real embeddings have hundreds or thousands of numbers.",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
