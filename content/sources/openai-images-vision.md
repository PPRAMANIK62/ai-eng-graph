---
id: openai-images-vision
title: Images and vision
author: OpenAI
url: https://developers.openai.com/api/docs/guides/images-vision
published: 2026              # undated page; lists gpt-6-astra and gpt-5.6, so current as of 2026-09
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI API docs on image inputs. Two counting schemes live side by side. Newer models (gpt-6-astra, gpt-5.6 family, gpt-5.5, gpt-5.4, gpt-5.2, gpt-4.1-mini) cover the image with 32×32-px patches and multiply the patch count by a per-model factor. Older ones (gpt-4o, gpt-4.1, gpt-4o-mini, gpt-5.1) scale the image and count 512-px tiles, each with a fixed token price plus a base cost. A `detail` setting (low, high, original, auto) controls the resizing.

## Key claims

- "Some models tokenize images by covering them with 32px x 32px patches." `patch_count = ceil(width/32) × ceil(height/32)`; billable tokens are `ceil(patch_count × multiplier)`. (Calculating costs, patch-based)
- Multipliers: gpt-6-astra, gpt-5.6-sol/terra/luna, gpt-5.5, gpt-5.4 family and gpt-5.2 use 1.2; gpt-4.1-mini uses 1.62. (same)
- Worked example, gpt-6-astra with detail high: a 2048×2048 image needs 4,096 patches; the 2,500-patch budget shrinks it to 1,600×1,600 (2,500 patches); tokens = ceil(2500 × 1.2) = 3000. (same)
- Budgets: for gpt-5.5, low "fits within 512 × 512 pixels"; high "allows up to 2,500 patches and a 2048-pixel maximum dimension"; original "allows up to 10,000 patches and a 6000-pixel maximum dimension". (detail levels)
- "If this count exceeds 30,000 patches, the API rejects the request." (same)
- Tile-based models (gpt-4o, gpt-4.1, gpt-4o-mini, gpt-5.1): "Scale down to fit in a 2048px x 2048px square, maintaining aspect ratio."; "If the shortest side exceeds 768px, scale it down to 768px"; then count 512-px tiles. gpt-4o and gpt-4.1: 85 base tokens + 170 per tile; gpt-4o-mini: 2,833 base + 5,667 per tile. "With `detail: low`, an image costs only the model's base tokens." (Calculating costs, tile-based)
- `detail` "defaults to `auto`"; original is for "Large, dense, spatially sensitive, or computer-use images". (detail)
- Limitations: "Small text", "Rotation: The model may misinterpret rotated or upside-down text and images", "Spatial reasoning: The model struggles with tasks requiring precise spatial localization", "Counting: The model may give approximate counts". (Limitations)

## Visuals worth redrawing

- None; the formulas are the content.

## My notes

- Worked by hand from the tile rules: a 1024×1024 image on gpt-4o fits in 2048, shortest side 1024 > 768 so it becomes 768×768, which is 2×2 = 4 tiles, so 85 + 4 × 170 = 765 tokens.
- No word on how the encoder is built, only on how it's billed.
- Worked by hand for the vision-models figure, at detail high on gpt-5.5 (multiplier 1.2, under the 2,500-patch budget so no shrink): 1000×1000 is 32×32 = 1,024 patches, so 1,229 tokens; 1920×1080 is 60×34 = 2,040 patches, so 2,448 tokens. On gpt-4o (tiles): 1920×1080 fits in 2048, shortest side 1080 > 768 so it becomes 1365×768, which is 3×2 = 6 tiles, so 85 + 6 × 170 = 1,105 tokens.
