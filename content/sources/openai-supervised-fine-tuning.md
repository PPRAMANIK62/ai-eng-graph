---
id: openai-supervised-fine-tuning
title: Supervised fine-tuning (OpenAI API docs)
author: OpenAI
url: https://developers.openai.com/api/docs/guides/supervised-fine-tuning
published: 2026              # living docs page, undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI's guide to supervised fine-tuning on its platform, now under a wind-down notice. Its section "Distilling from a larger model" is where the old distillation guide now lands: prompt a big model until it's good, save its outputs, filter them, and fine-tune a small model on them.

## Key claims

- The notice at the top. "OpenAI is winding down the fine-tuning platform. The platform is no longer accessible to new users, but existing users of the fine-tuning platform will be able to create training jobs for the coming months." (top of page)
- The old distillation guide redirects here: both developers.openai.com/api/docs/guides/distillation and platform.openai.com/docs/guides/distillation land on `supervised-fine-tuning#distilling-from-a-larger-model`. (followed the redirects)
- The distillation recipe: tune prompts on a larger model (the example is `gpt-4.1`) until evals look good, capture its outputs, filter them to the ones that meet your criteria, and fine-tune a smaller model (`gpt-4.1-mini`) on them. (Distilling from a larger model)
- What it buys you. "This technique can enable you to train a small model to perform similarly on a specific task to a larger, more costly model." (Distilling from a larger model)
- Data size: "The minimum number of examples you can provide for fine-tuning is 10." Clear improvements usually show with 50 to 100 examples; start with 50 good ones and evaluate. (Preparing your dataset)

## Visuals worth redrawing

## My notes

- Useful for the recipe, not as a place to run it: see `openai-deprecations` for the dates.
