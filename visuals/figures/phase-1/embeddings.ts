import { arrow, circle, line, path, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// 1. Foods as positions, in one, two and three dimensions.
// Source: sources/google-mlcc-embeddings.md (Embedding space, Figures 3-5).
// From the source: the order along sandwichness (borscht, salad, pizza,
// hot dog, shawarma), apple strudel between hot dog and shawarma, and the two
// coordinates hot dog (0.2, -0.5) and apple strudel (0.5, 0.3). Every other
// position is placed by us to match that order and is drawn hollow, marked
// illustrative in the figure.
// ---------------------------------------------------------------------------

type Food = { name: string; x: number; y: number; z: number; known?: string; lx?: number; ly?: number; anchor?: "start" | "middle" | "end" };
// x = sandwichness, y = dessertness, z = liquidness, all in -1..1.
const FOODS: Food[] = [
  { name: "borscht", x: -0.8, y: -0.35, z: 0.9, ly: -12 },
  { name: "salad", x: -0.5, y: -0.7, z: -0.6, ly: 20 },
  { name: "pizza", x: -0.2, y: -0.3, z: -0.7, ly: -12 },
  { name: "hot dog", x: 0.2, y: -0.5, z: -0.8, known: "(0.2, –0.5)", ly: 20 },
  { name: "shawarma", x: 0.65, y: -0.6, z: -0.8, ly: -12 },
  { name: "apple strudel", x: 0.5, y: 0.3, z: -0.6, known: "(0.5, 0.3)", ly: -26 },
];

function dot(x: number, y: number, known: boolean, tone: Tone) {
  return known ? circle(x, y, 5.5, { tone }) : circle(x, y, 5, { tone, fill: "none", stroke: true });
}

const foods: Figure = {
  slug: "food-space",
  alt: "Three views of the same foods. First, one line for sandwichness, from borscht, salad and pizza up to hot dog and shawarma. Second, a flat map that adds dessertness: hot dog at (0.2, –0.5) sits near shawarma, and apple strudel at (0.5, 0.3) is up in the dessert corner. Third, a cube that adds liquidness, where borscht moves away from everything else.",
  render() {
    const FW = 300, GAP = 26, L = 24, TOP = 30, PH = 250;
    const fx = (i: number) => L + i * (FW + GAP);
    let b = "";
    const head = (i: number, t: string, sub: string) =>
      text(fx(i), 8, t, { size: 14, weight: 600 }) + text(fx(i), 26, sub, { size: 12.5, tone: "muted" });

    // Frame 1: one axis.
    b += head(0, "1. One number per food", "sandwichness only");
    {
      const y = TOP + 120, x1 = fx(0) + 10, x2 = fx(0) + FW - 14;
      b += arrow(x1, y, x2, y, { tone: "muted", sw: 1.5 });
      const order = ["borscht", "salad", "pizza", "hot dog", "shawarma"];
      order.forEach((n, i) => {
        const px = x1 + 26 + i * ((x2 - x1 - 52) / 4);
        const f = FOODS.find((f) => f.name === n)!;
        b += dot(px, y, false, n === "hot dog" || n === "shawarma" ? "blue" : "grey");
        b += text(px, i % 2 ? y + 24 : y - 14, n, { size: 13, anchor: "middle" });
        void f;
      });
      b += text(x1, y + 58, "less of a sandwich", { size: 12, tone: "muted" });
      b += text(x2, y + 58, "more of a sandwich", { size: 12, tone: "muted", anchor: "end" });
      b += text(fx(0) + FW / 2, y + 90, "Apple strudel would land between hot dog", { size: 12.5, tone: "muted", anchor: "middle" });
      b += text(fx(0) + FW / 2, y + 108, "and shawarma, which hides that it's a dessert.", { size: 12.5, tone: "muted", anchor: "middle" });
    }

    // Frame 2: two axes.
    b += head(1, "2. Two numbers per food", "+ dessertness");
    const S = 110; // half-size of the square plot
    {
      const cx = fx(1) + FW / 2 + 6, cy = TOP + 36 + S;
      b += rect(cx - S, cy - S, 2 * S, 2 * S, { tone: "grey", fill: "none", sw: 1, r: 2 });
      b += line(cx - S, cy, cx + S, cy, { tone: "axis", sw: 1 });
      b += line(cx, cy - S, cx, cy + S, { tone: "axis", sw: 1 });
      b += text(cx + S, cy + S + 18, "sandwichness", { size: 12, tone: "muted", anchor: "end" });
      b += text(cx - S - 10, cy - S, "dessertness", { size: 12, tone: "muted", anchor: "end", rotate: -90 });
      b += text(cx + S - 6, cy - S + 16, "dessert corner", { size: 12, tone: "muted", anchor: "end", italic: true });
      for (const f of FOODS) {
        const px = cx + f.x * S, py = cy - f.y * S;
        const tone: Tone = f.name === "apple strudel" ? "orange" : f.name === "hot dog" || f.name === "shawarma" ? "blue" : "grey";
        b += dot(px, py, !!f.known, tone);
        if (f.known) {
          b += `<rect class="bg" x="${px - 38}" y="${py + (f.ly ?? 20) - 13}" width="76" height="34" opacity="0.85"/>`;
          b += text(px, py + (f.ly ?? 20), f.name, { size: 13, anchor: "middle", weight: 600 });
          b += text(px, py + (f.ly ?? 20) + 16, f.known, { size: 12, anchor: "middle", tone: "muted" });
        } else b += text(px, py + (f.ly ?? 20), f.name, { size: 13, anchor: "middle" });
      }
    }

    // Frame 3: three axes, drawn as an oblique cube.
    b += head(2, "3. Three numbers per food", "+ liquidness");
    {
      const ox = fx(2) + 30, oy = TOP + PH - 20; // front-bottom-left corner
      const W = 180, H = 130, dx = 60, dy = -90; // depth vector
      const P = (x: number, y: number, z: number) => [ox + ((x + 1) / 2) * W + ((z + 1) / 2) * dx, oy - ((y + 1) / 2) * H + ((z + 1) / 2) * dy] as const;
      const corners = (a: number[][]) => a.map(([x, y, z]) => P(x!, y!, z!));
      const edge = (a: number[], c: number[], dash = false) => {
        const [p1, p2] = corners([a, c]);
        return line(p1![0], p1![1], p2![0], p2![1], { tone: dash ? "grid" : "axis", sw: 1, dash });
      };
      // back edges dashed, front edges solid
      for (const [a, c] of [[[-1, -1, 1], [1, -1, 1]], [[-1, -1, 1], [-1, 1, 1]], [[-1, -1, -1], [-1, -1, 1]]]) b += edge(a!, c!, true);
      for (const [a, c] of [
        [[-1, -1, -1], [1, -1, -1]], [[-1, -1, -1], [-1, 1, -1]], [[1, -1, -1], [1, 1, -1]], [[-1, 1, -1], [1, 1, -1]],
        [[1, -1, -1], [1, -1, 1]], [[1, 1, -1], [1, 1, 1]], [[-1, 1, -1], [-1, 1, 1]], [[1, -1, 1], [1, 1, 1]], [[-1, 1, 1], [1, 1, 1]],
      ]) b += edge(a!, c!);
      const [lx, ly] = P(1, -1, -1);
      b += text(lx, ly + 18, "sandwichness", { size: 12, tone: "muted", anchor: "end" });
      const [ux, uy] = P(-1, 1, -1);
      b += text(ux - 10, uy + 40, "dessertness", { size: 12, tone: "muted", anchor: "middle", rotate: -90 });
      const [zx, zy] = P(1, -1, 0);
      b += text(zx + 10, zy + 4, "liquidness", { size: 12, tone: "muted", rotate: -56 });
      for (const f of FOODS) {
        const [px, py] = P(f.x, f.y, f.z);
        const [fx0, fy0] = P(f.x, -1, f.z);
        b += line(px, py, fx0, fy0, { tone: "grid", sw: 1, dash: true });
        const tone: Tone = f.name === "borscht" ? "purple" : f.name === "apple strudel" ? "orange" : f.name === "hot dog" || f.name === "shawarma" ? "blue" : "grey";
        b += dot(px, py, false, tone);
        if (f.name === "borscht") b += text(px + 10, py - 8, "borscht", { size: 13, weight: 600, tone: "purple" });
        else if (f.name === "apple strudel") b += text(px, py - 12, "apple strudel", { size: 13, anchor: "middle" });
      }
      b += text(fx(2) + FW / 2, oy + 44, "Borscht is the liquid one, so it", { size: 12.5, tone: "muted", anchor: "middle" });
      b += text(fx(2) + FW / 2, oy + 62, "moves away from the rest.", { size: 12.5, tone: "muted", anchor: "middle" });
    }

    // Legend.
    const ly = TOP + PH + 76;
    b += line(L, ly - 22, fx(2) + FW, ly - 22, { tone: "grid", sw: 1 });
    b += circle(L + 6, ly, 5.5, { tone: "ink" });
    b += text(L + 18, ly, "coordinates given in the course", { size: 12.5, baseline: "middle", tone: "muted" });
    b += circle(L + 230, ly, 5, { tone: "ink", fill: "none", stroke: true });
    b += text(L + 242, ly, "placed by us in the course's order (illustrative, not data)", { size: 12.5, baseline: "middle", tone: "muted" });
    b += text(L, ly + 24, "Real embeddings have hundreds or thousands of axes, and the axes have no names.", { size: 12.5, weight: 600 });

    return svg(
      {
        width: fx(2) + FW + L,
        height: ly + 36,
        title: "A list of numbers is a position: more numbers, more room to tell things apart",
        credit: "Adapted from Google's Machine Learning Crash Course, Embeddings (Figures 3-5).",
        desc: foods.alt,
      },
      b,
    );
  },
};

// ---------------------------------------------------------------------------
// 2. Directions carry meaning. Our own sketch, no real coordinates. The word
// pairs come from sources/mikolov-word2vec.md (Paris - France + Italy = Rome;
// biggest - big + small = smallest).
// ---------------------------------------------------------------------------

const analogy: Figure = {
  slug: "analogy-sketch",
  alt: "Sketch, not real data. Arrows from France to Paris and from Italy to Rome point the same way, and so do the arrows from big to biggest and from small to smallest. In real models these arrows are only roughly parallel.",
  render() {
    const W = 760, H = 270;
    let b = "";
    const pair = (x: number, y: number, dx: number, dy: number, a: string, c: string, tone: Tone) => {
      let s = circle(x, y, 5, { tone });
      s += circle(x + dx, y + dy, 5, { tone });
      s += arrow(x + 6, y + (dy / dx) * 6, x + dx - 8, y + dy - (dy / dx) * 8, { tone, sw: 2 });
      s += text(x - 10, y + 4, a, { size: 14, anchor: "end", baseline: "middle", weight: 600 });
      s += text(x + dx + 10, y + dy - 4, c, { size: 14, baseline: "middle", weight: 600 });
      return s;
    };
    // Left panel: countries and capitals.
    const lx = 24, pw = 340;
    b += rect(lx, 0, pw, H - 40, { tone: "grey", fill: "none", sw: 1, r: 8 });
    b += text(lx + 16, 22, "Country to capital", { size: 14, weight: 600 });
    b += pair(lx + 90, 170, 150, -70, "France", "Paris", "blue");
    b += pair(lx + 110, 100, 150, -70, "Italy", "Rome", "blue");
    b += text(lx + pw / 2, H - 58, "Paris − France + Italy ≈ Rome", { size: 13, anchor: "middle", tone: "blue", mono: true });
    // Right panel: comparative forms.
    const rx = lx + pw + 32;
    b += rect(rx, 0, pw, H - 40, { tone: "grey", fill: "none", sw: 1, r: 8 });
    b += text(rx + 16, 22, "Word to its -est form", { size: 14, weight: 600 });
    b += pair(rx + 80, 75, 160, 40, "big", "biggest", "orange");
    b += pair(rx + 70, 140, 160, 40, "small", "smallest", "orange");
    b += text(rx + pw / 2, H - 58, "biggest − big + small ≈ smallest", { size: 13, anchor: "middle", tone: "orange", mono: true });
    b += text(24, H - 14, "Sketch, not real data: in real models the arrows are only roughly parallel.", { size: 13, tone: "muted", italic: true });
    return svg(
      {
        width: W,
        height: H,
        title: "Directions carry meaning: the same step leads to a similar place",
        credit: "Our own sketch. Word pairs from the word2vec paper (Mikolov et al., 2013).",
        desc: analogy.alt,
      },
      b,
    );
  },
};

// ---------------------------------------------------------------------------
// 3. "orange" before and after context. Our own sketch; the example (orange
// sits with colours in word2vec, not with juice) is from
// sources/google-mlcc-embeddings.md (Contextual embeddings). The neighbour
// words other than "juice" are our own picks for the sketch.
// ---------------------------------------------------------------------------

const orange: Figure = {
  slug: "orange-in-context",
  alt: "Sketch, not real data. The looked-up vector for orange sits among colours like red, blue and yellow. In 'She wore an orange scarf' the layers after the lookup keep it among the colours. In 'He squeezed an orange for juice' they move it over near juice, lemon and apple.",
  render() {
    const W = 760, H = 280;
    let b = "";
    // clusters
    const cl = (cx: number, cy: number, label: string, words: [string, number, number][], tone: Tone) => {
      let s = `<ellipse cx="${cx}" cy="${cy}" rx="120" ry="78" class="fs-${tone} s-${tone}" stroke-width="1" stroke-dasharray="5 4"/>`;
      s += text(cx, cy - 92, label, { size: 13, anchor: "middle", tone, weight: 600 });
      for (const [w, dx, dy] of words) {
        s += circle(cx + dx, cy + dy, 4, { tone: "grey" });
        s += text(cx + dx + 8, cy + dy, w, { size: 13, baseline: "middle" });
      }
      return s;
    };
    const C = { x: 170, y: 140 }, F = { x: 580, y: 140 };
    b += cl(C.x, C.y, "colours", [["red", -85, -40], ["blue", 10, -50], ["yellow", -100, 0]], "blue");
    b += cl(F.x, F.y, "fruit and drinks", [["juice", 10, -50], ["lemon", 40, 10], ["apple", -40, 45]], "green");
    // orange lookup point
    const o = { x: C.x - 10, y: C.y + 30 };
    b += circle(o.x, o.y, 7, { tone: "orange" });
    b += text(o.x - 14, o.y, "orange (lookup)", { size: 13, weight: 700, tone: "orange", anchor: "end", baseline: "middle" });
    // scarf: small move within colours
    const s1 = { x: C.x + 45, y: C.y - 5 };
    b += arrow(o.x + 8, o.y - 3, s1.x - 8, s1.y + 2, { tone: "orange", sw: 2 });
    b += circle(s1.x, s1.y, 5, { tone: "orange", fill: "none", stroke: true });
    b += text(s1.x, s1.y - 16, "“orange scarf”", { size: 12.5, tone: "orange", anchor: "middle" });
    // juice: moves over to fruit
    const s2 = { x: F.x - 40, y: F.y - 20 };
    b += path(`M${o.x + 8},${o.y + 6} Q${(o.x + s2.x) / 2},${o.y + 110} ${s2.x - 9},${s2.y + 6}`, { tone: "orange", sw: 2, arrow: true });
    b += circle(s2.x, s2.y, 5, { tone: "orange", fill: "none", stroke: true });
    b += text((o.x + s2.x) / 2, o.y + 78, "“squeezed an orange for juice”", { size: 12.5, tone: "orange", anchor: "middle" });
    b += text(24, H - 8, "Sketch, not real data. Filled dot: the lookup vector. Hollow dots: the same token after the layers that follow.", { size: 12.5, tone: "muted", italic: true });
    return svg(
      {
        width: W,
        height: H,
        title: "The lookup gives one vector; the layers after it move it depending on context",
        credit: "Our own sketch. Example from Google's Machine Learning Crash Course, Embeddings.",
        desc: orange.alt,
      },
      b,
    );
  },
};

export default [foods, analogy, orange];
