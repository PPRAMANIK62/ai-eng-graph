import { arrow, box, line, svg, text, type Figure } from "../../lib/svg.ts";

// Flow: sources/redis-semantic-cache.md (embed, KNN with tenant/locale/model-version
// filters, threshold, serve in tens of milliseconds or call the LLM and write back with a TTL).
// Example pair and the "close but different answers" point: sources/schroeder-vcache.md.
const flow: Figure = {
  slug: "flow",
  alt: "The semantic cache flow. A new question is embedded and compared with past questions in the cache, filtered by tenant, locale and model version. If the nearest one is closer than the threshold, the stored answer is returned in tens of milliseconds and the model isn't called. If not, the model answers, and the question, embedding and answer are stored with an expiry time. Two example pairs: \"Which city is Canada's capital?\" and \"What is the capital of Canada?\" should share an answer; two questions can sit just as close in embedding space and still need different answers.",
  render() {
    let b = "";
    const y = 40;
    b += box(20, y, 130, 46, ["new", "question"], { tone: "grey", size: 13 });
    b += arrow(150, y + 23, 178, y + 23, { tone: "muted" });
    b += box(180, y, 110, 46, "embed", { tone: "blue", size: 13, weight: 600 });
    b += arrow(290, y + 23, 318, y + 23, { tone: "muted" });
    b += box(320, y - 6, 190, 58, ["nearest past question", "same tenant, locale,", "model version"], { tone: "blue", size: 12.5 });
    b += arrow(510, y + 23, 538, y + 23, { tone: "muted" });
    b += box(540, y, 130, 46, ["closer than", "threshold?"], { tone: "purple", size: 13, weight: 600 });

    // hit
    b += arrow(670, y + 23, 718, y + 23, { tone: "green" });
    b += text(694, y + 13, "yes", { anchor: "middle", size: 12, tone: "green", weight: 600 });
    b += box(720, y, 200, 46, ["return stored answer", "tens of ms, no model call"], { tone: "green", size: 12.5 });

    // miss
    b += arrow(605, y + 46, 605, y + 96, { tone: "orange" });
    b += text(615, y + 74, "no", { size: 12, tone: "orange", weight: 600 });
    b += box(520, y + 98, 170, 46, ["call the model", "seconds, full token cost"], { tone: "orange", size: 12.5 });
    b += arrow(690, y + 121, 718, y + 121, { tone: "muted" });
    b += box(720, y + 98, 200, 46, ["store question, embedding,", "answer, with an expiry"], { tone: "grey", size: 12.5 });

    // examples
    const ey = y + 180;
    b += line(20, ey - 14, 920, ey - 14, { tone: "grid", sw: 1 });
    b += text(20, ey + 6, "What the threshold has to tell apart", { size: 13.5, weight: 600 });
    b += text(20, ey + 32, "Should hit:", { size: 12.5, weight: 600, tone: "green" });
    b += text(120, ey + 32, "“Which city is Canada’s capital?”  and  “What is the capital of Canada?”  (same answer)", { size: 12.5 });
    b += text(20, ey + 56, "Can go wrong:", { size: 12.5, weight: 600, tone: "red" });
    b += text(120, ey + 56, "two questions just as close in embedding space that need different answers", { size: 12.5 });
    return svg(
      {
        width: 940,
        height: ey + 70,
        title: "A semantic cache answers from memory when a question is close enough",
        credit: "Flow after Redis's semantic cache docs; example pair from Schroeder et al., vCache (2026).",
        desc: flow.alt,
      },
      b,
    );
  },
};

export default [flow];
