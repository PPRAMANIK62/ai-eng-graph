import { barsH } from "../../lib/chart.ts";
import { svg, text, type Figure } from "../../lib/svg.ts";

// sources/deepseek-r1.md, Table 6 (v1): AIME 2024 pass@1 for 32B models.
const vsRl: Figure = {
  slug: "vs-rl",
  alt: "Bar chart of AIME 2024 pass@1 accuracy for 32B-parameter models, from the DeepSeek-R1 paper (January 2025). Qwen-32B trained with large-scale reinforcement learning scored 47.0%. QwQ-32B-Preview scored 50.0%. Qwen-32B distilled from DeepSeek-R1 with supervised fine-tuning only scored 72.6%.",
  render() {
    const p = { x: 20, y: 30, w: 700, h: 150 };
    let b = text(p.x, 8, "AIME 2024 accuracy (pass@1), same model size", { size: 12.5, tone: "muted" });
    b += barsH(
      p,
      [
        { label: "Qwen-32B + large-scale RL", value: 47.0, valueLabel: "47.0%", tone: "grey" },
        { label: "QwQ-32B-Preview", value: 50.0, valueLabel: "50.0%", tone: "grey" },
        { label: "Qwen-32B distilled from R1", value: 72.6, valueLabel: "72.6%", tone: "blue" },
      ],
      { max: 80, labelWidth: 210, size: 13 },
    ).svg;
    return svg(
      {
        width: 740,
        height: p.y + p.h + 10,
        title: "Distilling from a big model beat RL on the small one",
        credit: "Data: DeepSeek-AI, DeepSeek-R1 paper, Table 6 (2025). The distilled model used supervised fine-tuning only.",
        desc: vsRl.alt,
      },
      b,
    );
  },
};

export default [vsRl];
