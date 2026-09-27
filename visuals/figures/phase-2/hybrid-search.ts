import { scaleBand, scaleLinear, yAxis } from "../../lib/chart.ts";
import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// Pipeline: nodes/phase-2/hybrid-search.md. The two example queries and what
// each search returned first are from sources/qdrant-hybrid-search.md (a
// product search). Candidate depth 100 per list is Qdrant's starting value.
const pipeline: Figure = {
  slug: "pipeline",
  alt: "Diagram of hybrid search. One query goes to two searches at once: keyword search (BM25) and vector search. Each returns its own ranked list of about 100 candidates. A fusion step merges the two lists into one ranking, and the top 10 go on to the model or a reranker. Below, two real product queries: for \"french molding\", vector search found the right product and keyword search found a french bread mold; for \"bathroom vanity knobs\", keyword search found the right knob and vector search found a vanity set.",
  render() {
    let b = "";
    const H = 46;
    // query
    b += box(20, 95, 130, H, ["query"], { tone: "grey", size: 14, weight: 600 });
    // two searches
    b += box(210, 30, 190, H, ["keyword search (BM25)"], { tone: "orange", size: 13.5, weight: 600 });
    b += box(210, 160, 190, H, ["vector search"], { tone: "blue", size: 13.5, weight: 600 });
    b += arrow(150, 110, 208, 58, { tone: "muted" });
    b += arrow(150, 126, 208, 180, { tone: "muted" });
    // lists
    const list = (x: number, y: number, tone: Tone) => {
      let s = "";
      for (let i = 0; i < 4; i++) s += rect(x, y + i * 11, 70, 8, { tone, fill: "soft", stroke: false, r: 2 });
      s += text(x + 35, y + 56, "top 100", { anchor: "middle", size: 12, tone: "muted" });
      return s;
    };
    b += list(440, 34, "orange");
    b += list(440, 164, "blue");
    b += arrow(400, 53, 436, 53, { tone: "orange" });
    b += arrow(400, 183, 436, 183, { tone: "blue" });
    // fusion
    b += box(560, 95, 120, H, ["fusion"], { tone: "green", size: 14, weight: 600 });
    b += arrow(512, 60, 558, 108, { tone: "muted" });
    b += arrow(512, 176, 558, 128, { tone: "muted" });
    b += text(620, 160, "one ranking", { anchor: "middle", size: 12, tone: "muted" });
    // output
    b += box(730, 95, 150, H, ["top 10 to the model", "or reranker"], { tone: "grey", size: 12.5 });
    b += arrow(680, 118, 728, 118, { tone: "muted" });

    // examples
    const y0 = 250;
    b += line(20, y0 - 14, 880, y0 - 14, { tone: "grid", sw: 1 });
    b += text(20, y0 + 6, "Why run both: each search misses a different query", { size: 13.5, weight: 600 });
    const col = [20, 250, 570];
    b += text(col[0]!, y0 + 36, "Query", { size: 12.5, tone: "muted", weight: 600 });
    b += text(col[1]!, y0 + 36, "Keyword search's top result", { size: 12.5, tone: "orange", weight: 600 });
    b += text(col[2]!, y0 + 36, "Vector search's top result", { size: 12.5, tone: "blue", weight: 600 });
    const rows = [
      { q: "french molding", kw: "french bread mold toast tray (wrong)", vec: "french curves rosette applique (right)", kwOk: false },
      { q: "bathroom vanity knobs", kw: "damask mushroom knob (right)", vec: "30'' single bathroom vanity set (wrong)", kwOk: true },
    ];
    rows.forEach((r, i) => {
      const y = y0 + 64 + i * 28;
      b += text(col[0]!, y, `“${r.q}”`, { size: 13 });
      b += text(col[1]!, y, r.kw, { size: 13, tone: r.kwOk ? "green" : "red" });
      b += text(col[2]!, y, r.vec, { size: 13, tone: r.kwOk ? "red" : "green" });
    });
    return svg(
      {
        width: 900,
        height: y0 + 110,
        title: "Hybrid search: two searches, one merged ranking",
        credit: "Example queries from Qdrant, “Hybrid Search in Qdrant” (2026). Product names shortened.",
        desc: pipeline.alt,
      },
      b,
    );
  },
};

// nDCG@10 table from sources/qdrant-tune-hybrid-search.md ("Confirm Fusion
// Beats Either Prefetch"): dense (all-MiniLM-L6-v2), sparse (BM25), RRF.
const DATA = [
  { name: "SciFact", dense: 0.6239, sparse: 0.6886, rrf: 0.7175 },
  { name: "ArguAna", dense: 0.4905, sparse: 0.4224, rrf: 0.5216 },
  { name: "WANDS", dense: 0.6921, sparse: 0.7098, rrf: 0.7254 },
  { name: "CodeSearchNet", dense: 0.6299, sparse: 0.5126, rrf: 0.6555 },
  { name: "DBPedia-entity", dense: 0.4677, sparse: 0.3857, rrf: 0.4638 },
];
const SERIES: { key: "sparse" | "dense" | "rrf"; label: string; tone: Tone }[] = [
  { key: "sparse", label: "keyword only (BM25)", tone: "orange" },
  { key: "dense", label: "vector only", tone: "blue" },
  { key: "rrf", label: "hybrid (RRF)", tone: "green" },
];

const results: Figure = {
  slug: "results",
  alt: "Grouped bar chart of nDCG@10 on five public datasets for keyword search only, vector search only and hybrid search with reciprocal rank fusion. Hybrid scores highest on four: SciFact 0.718 (best single 0.689), ArguAna 0.522 (0.491), WANDS 0.725 (0.710) and CodeSearchNet 0.656 (0.630). On DBPedia-entity, vector only scores 0.468 and hybrid 0.464, slightly lower.",
  render() {
    const p = { x: 70, y: 40, w: 780, h: 250 };
    const x = scaleBand<string>().domain(DATA.map((d) => d.name)).range([p.x, p.x + p.w]).padding(0.22);
    const inner = scaleBand<string>().domain(SERIES.map((s) => s.key)).range([0, x.bandwidth()]).padding(0.12);
    const y = scaleLinear().domain([0.3, 0.8]).range([p.y + p.h, p.y]);
    let b = yAxis(p, y, [0.3, 0.4, 0.5, 0.6, 0.7, 0.8], (n) => n.toFixed(1), "nDCG@10");
    for (const d of DATA) {
      const bx = x(d.name)!;
      for (const s of SERIES) {
        const v = d[s.key];
        const sx = bx + inner(s.key)!;
        b += rect(sx, y(v), inner.bandwidth(), p.y + p.h - y(v), { tone: s.tone, fill: "solid", stroke: false, r: 2 });
        b += text(sx + inner.bandwidth() / 2, y(v) - 5, v.toFixed(3).replace(/^0/, ""), { anchor: "middle", size: 11, tone: s.tone, weight: 600 });
      }
      b += text(bx + x.bandwidth() / 2, p.y + p.h + 18, d.name, { anchor: "middle", size: 12.5 });
    }
    b += line(p.x, p.y + p.h, p.x + p.w, p.y + p.h, { tone: "axis" });
    // legend
    let lx = p.x;
    for (const s of SERIES) {
      b += rect(lx, 4, 14, 14, { tone: s.tone, fill: "solid", stroke: false, r: 2 });
      b += text(lx + 20, 11, s.label, { size: 12.5, baseline: "middle" });
      lx += 190;
    }
    b += text(p.x + p.w, 11, "y axis starts at 0.3", { anchor: "end", size: 12, tone: "muted", baseline: "middle" });
    return svg(
      {
        width: p.x + p.w + 30,
        height: p.y + p.h + 30,
        title: "Hybrid beat the better single search on four of five datasets",
        credit: "Data: Qdrant, “How to Tune Hybrid Search in Qdrant” (2026). all-MiniLM-L6-v2 vectors, BM25, default RRF, 200 candidates per list.",
        desc: results.alt,
      },
      b,
    );
  },
};

export default [pipeline, results];
