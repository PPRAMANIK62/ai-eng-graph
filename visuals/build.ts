// Render every figure to content/nodes/phase-N/img/<node>-<slug>.svg.
//
//   bun build.ts                 all figures
//   bun build.ts softmax bpe     only these nodes
//   bun build.ts --png           also write PNG previews to visuals/out/ (light and .dark)
import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { flatten, type Figure } from "./lib/svg.ts";

const ROOT = join(import.meta.dir, "..");
const args = process.argv.slice(2);
const png = args.includes("--png");
const only = new Set(args.filter((a) => !a.startsWith("--")));

const files = [...new Bun.Glob("figures/phase-*/*.ts").scanSync({ cwd: import.meta.dir })].sort();
let count = 0;
for (const file of files) {
  const node = basename(file, ".ts");
  if (only.size && !only.has(node)) continue;
  const phase = basename(dirname(file));
  const figures: Figure[] = (await import(join(import.meta.dir, file))).default;
  const outDir = join(ROOT, "content", "nodes", phase, "img");
  mkdirSync(outDir, { recursive: true });
  for (const fig of figures) {
    const svg = fig.render();
    const name = `${node}-${fig.slug}`;
    writeFileSync(join(outDir, `${name}.svg`), svg);
    if (png) {
      mkdirSync(join(import.meta.dir, "out"), { recursive: true });
      for (const theme of ["light", "dark"] as const) {
        const r = new Resvg(flatten(svg, theme), { fitTo: { mode: "zoom", value: 1.5 }, font: { loadSystemFonts: true, defaultFontFamily: "Noto Sans", monospaceFamily: "Adwaita Mono" } });
        writeFileSync(join(import.meta.dir, "out", `${name}${theme === "dark" ? ".dark" : ""}.png`), r.render().asPng());
      }
    }
    console.log(`${phase}/img/${name}.svg`);
    count++;
  }
}
console.log(`${count} figures`);
