import { box, rect, svg, text, type Figure } from "../../lib/svg.ts";

// ---------------------------------------------------------------------------
// Filtering after an approximate index scan, and iterative scans.
// Source: sources/pgvector-readme.md (Filtering: "If a condition matches 10% of
// rows, with HNSW and the default hnsw.ef_search of 40, only 4 rows will match
// on average"; Iterative Index Scans, 0.8.0+, up to hnsw.max_scan_tuples).
// Which boxes pass is illustrative; the counts follow the 10% example.
// ---------------------------------------------------------------------------

// Candidates in distance order; roughly 1 in 10 passes the filter.
const PASS = new Set([3, 12, 25, 36, 44, 57, 63, 78, 86, 95]);

const figure: Figure = {
  slug: "filtering",
  alt: "Two rows of candidate boxes. Without iterative scans, the HNSW index returns 40 candidates, the filter keeps the 10% that match, and 4 rows come back though the query asked for 10. With iterative scans (pgvector 0.8.0 and later), the index keeps scanning until 10 rows pass or it reaches the hnsw.max_scan_tuples limit.",
  render() {
    const L = 24, CW = 10, CH = 16, G = 2, PER = 40, BW = 150;
    const cells = (x: number, y: number, n: number) => {
      let s = "";
      for (let i = 0; i < n; i++) {
        const cx = x + (i % PER) * (CW + G), cy = y + Math.floor(i / PER) * (CH + G);
        s += rect(cx, cy, CW, CH, PASS.has(i) ? { tone: "green", fill: "solid", stroke: false, r: 2 } : { tone: "grey", fill: "soft", stroke: true, sw: 1, r: 2 });
      }
      return s;
    };
    const rowW = PER * (CW + G);
    let b = "";

    // Row 1: default scan, 40 candidates.
    b += text(L, 8, "Without iterative scans", { size: 14, weight: 600 });
    b += text(L, 28, "The index returns ef_search = 40 candidates, then WHERE filters them.", { size: 12.5, tone: "muted" });
    b += cells(L, 44, 40);
    b += box(L + rowW + 24, 32, BW, 42, ["4 rows", "(asked for 10)"], { tone: "red", fill: "soft", size: 12.5, weight: 600, textTone: "red" });

    // Row 2: iterative scan keeps going until 10 pass.
    const y2 = 112;
    b += text(L, y2, "With iterative scans (pgvector 0.8.0+)", { size: 14, weight: 600 });
    b += text(L, y2 + 20, "It keeps scanning until 10 rows pass, or it hits hnsw.max_scan_tuples.", { size: 12.5, tone: "muted" });
    b += cells(L, y2 + 36, 96);
    b += box(L + rowW + 24, y2 + 45, BW, 34, "10 rows", { tone: "green", fill: "soft", size: 13, weight: 600, textTone: "green" });

    // Legend.
    const ly = y2 + 36 + 3 * (CH + G) + 26;
    b += rect(L, ly - 8, CW, CH, { tone: "green", fill: "solid", stroke: false, r: 2 });
    b += text(L + CW + 8, ly, "passes the filter (10% of rows)", { size: 12.5, baseline: "middle" });
    b += rect(L + 230, ly - 8, CW, CH, { tone: "grey", fill: "soft", stroke: true, sw: 1, r: 2 });
    b += text(L + 230 + CW + 8, ly, "nearest-first candidate, filtered out", { size: 12.5, baseline: "middle" });

    return svg(
      {
        width: L + rowW + 24 + BW + 24,
        height: ly + 16,
        title: "Filtering after the index scan can return too few rows",
        credit: "Counts from the pgvector README's 10% example; which candidates pass is illustrative.",
        desc: figure.alt,
      },
      b,
    );
  },
};

export default [figure];
