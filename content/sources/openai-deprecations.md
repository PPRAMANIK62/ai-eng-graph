---
id: openai-deprecations
title: Deprecations (section "Update to OpenAI's self-serve fine-tuning")
author: OpenAI
url: https://developers.openai.com/api/docs/deprecations
published: 2026-05-07        # date of the fine-tuning entry; the page is updated over time
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI's list of retired and retiring API features. The entry dated 2026-05-07 winds down self-serve fine-tuning in three steps: new organizations first, then inactive ones, then everyone. Models already fine-tuned keep serving until their base model is retired. The page gives no reason for the wind-down.

## Key claims

- From 2026-05-07, organizations that never fine-tuned can't start. "Creating fine-tuning jobs or training is not available to organizations that have not previously run fine-tuning." (Update to OpenAI's self-serve fine-tuning, May 7, 2026)
- From 2026-07-02, organizations without recent use are cut off too. "Creating fine-tuning jobs is no longer available to organizations that have not run inference on a fine-tuned model in the past 60 days." (same, July 2, 2026)
- From 2027-01-06, nobody can start a new job. "Active existing customers will no longer be able to create new fine-tuning jobs on this date." (same, January 6, 2027)
- Existing fine-tuned models keep working for now. "Inference on fine-tuned models will continue to be available until the base models are deprecated." (same)

## Visuals worth redrawing

- The three dates as a timeline.

## My notes

- No reason is given. Third-party articles guess at one; don't repeat them.
