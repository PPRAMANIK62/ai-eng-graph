---
id: anthropic-vision
title: Vision
author: Anthropic
url: https://platform.claude.com/docs/en/build-with-claude/vision
published: 2026              # undated page; examples use claude-opus-5-5, so current as of 2026-09
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

Claude API docs on sending images. Images are counted in 28×28-pixel patches, one visual token each, so cost is the patch grid size. Claude 4.7 and later have a high-resolution tier (long edge 2,576 px, up to 4,784 visual tokens); other models cap at 1,568 px and 1,568 tokens. Larger images are downscaled. Also lists request limits and known weak spots (small or rotated images, spatial reasoning, counting). Examples use claude-opus-5-5.

## Key claims

- Patches, not pixels. "Each patch is a 28×28-pixel block of the image, referred to as a visual token. An image, therefore, costs `⌈width / 28⌉ × ⌈height / 28⌉` visual tokens." (Resolution and token cost)
- Tiers: High-resolution, "Claude 4.7 and later models", max long edge 2576 px, max 4784 visual tokens; Standard, "All other models", 1568 px, 1568 tokens. (Resolution and token cost, table)
- Images over either limit are downscaled, keeping aspect ratio: "Claude scales it to the largest size that fits the tier's limits while preserving its aspect ratio. This caps the token cost." (same)
- Example counts: 200×200 → 64 tokens (both tiers); 1000×1000 → 1296 (both); 1920×1080 → standard 1456×819, 1560 tokens / high-res not resized, 2691 tokens; 3840×2160 → standard 1560 / high-res 2576×1449, 4784 tokens. (table)
- Price examples: "at Claude Haiku 4.5's $1 USD per million input tokens (standard tier), the 1000×1000 image costs about $1.30 USD per thousand images. At Claude Opus 5's $5 USD per million (high-resolution tier), the same image costs about $6.48 USD per thousand and the 4K image about $23.92 USD per thousand." (same)
- "High-resolution images can use up to roughly three times more visual tokens than the same image on a standard-tier model." Downsample if you don't need the detail. (same)
- Limits: up to 600 images per API request (100 for models with a 200k-token context window), max 8000×8000 px, 10 MB per image on the API. (Request limits)
- Put images first: "Claude works best when images come before text." (Send images to Claude, tip)
- Limitations: "Claude might hallucinate or make mistakes when interpreting low-quality, rotated, or very small images under 200 pixels." Coordinates are "approximate"; counts are approximate "especially with large numbers of small objects". (Limitations)
- Resizing can hurt text: an image "might be resized if it is too large ... this might, for example, make text less legible." (Image quality guidance)

## Visuals worth redrawing

- The size-to-tokens table, as bars per tier.

## My notes

- The docs give the cost unit (28-px patch) but say nothing about the encoder architecture behind it.
