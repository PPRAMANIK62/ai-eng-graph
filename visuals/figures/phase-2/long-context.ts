import { arrow, box, text, svg, type Figure } from "../../lib/svg.ts";

// Self-Route steps and every number come from sources/li-rag-vs-long-context.md
// (Li et al., 2024): 57.36% / 81.74% answerable, 38.6% of tokens, 65% and 39% lower cost.

const selfRoute: Figure = {
  slug: "self-route",
  alt: "A flow chart. A question and the top retrieved chunks go to the model, which is asked whether it can answer from them. If yes, it answers, and the call was cheap. If not, the full text is sent and the model answers from all of it. With this router, Gemini-1.5-Pro used 38.6% of the tokens of sending the full text every time, and cost fell 65% for Gemini-1.5-Pro and 39% for GPT-4o.",
  render() {
    let b = "";
    const H = 64;
    // step 1
    b += box(24, 40, 170, H, ["question +", "top 5 chunks"], { tone: "blue", size: 14, weight: 600 });
    b += arrow(194, 40 + H / 2, 238, 40 + H / 2, { tone: "blue" });
    b += box(242, 40, 210, H, ["model: can you answer", "from these chunks?"], { tone: "purple", size: 14, weight: 600 });
    b += text(242 + 105, 28, "step 1: cheap", { anchor: "middle", size: 13, tone: "blue", weight: 700 });

    // yes branch
    b += arrow(452, 40 + H / 2, 540, 40 + H / 2, { tone: "green" });
    b += text(496, 40 + H / 2 - 10, "yes", { anchor: "middle", size: 13, tone: "green", weight: 700 });
    b += box(544, 40, 200, H, ["answer from", "the chunks"], { tone: "green", size: 14, weight: 600 });
    b += text(644, 40 + H + 20, "GPT-4o: 57% of questions", { anchor: "middle", size: 12.5, tone: "muted" });
    b += text(644, 40 + H + 38, "Gemini-1.5-Pro: 82%", { anchor: "middle", size: 12.5, tone: "muted" });

    // no branch
    const Y2 = 210;
    b += arrow(347, 40 + H, 347, Y2 - 4, { tone: "orange" });
    b += text(357, (40 + H + Y2) / 2, "no: \"unanswerable\"", { size: 13, tone: "orange", weight: 700 });
    b += box(242, Y2, 210, H, ["send the full text", "+ question"], { tone: "orange", size: 14, weight: 600 });
    b += text(242 + 105, Y2 + H + 20, "step 2: expensive", { anchor: "middle", size: 13, tone: "orange", weight: 700 });
    b += arrow(452, Y2 + H / 2, 540, Y2 + H / 2, { tone: "orange" });
    b += box(544, Y2, 200, H, ["answer from", "the whole text"], { tone: "orange", size: 14, weight: 600 });

    // result
    const RY = Y2 + H + 52;
    b += text(24, RY, "Result, about the same quality as always sending the full text:", { size: 14, weight: 700 });
    b += text(24, RY + 24, "Gemini-1.5-Pro used 38.6% of the tokens. Cost fell 65% for Gemini-1.5-Pro and 39% for GPT-4o.", { size: 13.5 });

    return svg(
      {
        width: 768,
        height: RY + 36,
        title: "Self-Route: try the retrieved chunks first, send everything only if needed",
        credit: "Numbers from Li et al., \"Retrieval Augmented Generation or Long-Context LLMs?\" (2024), on 2024 models. Redrawn, not copied.",
        desc: selfRoute.alt,
      },
      b,
    );
  },
};

export default [selfRoute];
