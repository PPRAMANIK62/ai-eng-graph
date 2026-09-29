---
id: openai-data-controls
title: Data controls in the OpenAI platform
author: OpenAI
url: https://developers.openai.com/api/docs/guides/your-data
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

What OpenAI keeps from API calls and for how long. API data isn't used for training unless you opt in. Abuse-monitoring logs are kept up to 30 days by default. Zero Data Retention, which needs OpenAI's approval, removes your content from those logs and forces `store` off. The Responses API stores responses for at least 30 days when `store` is on.

## Key claims

- Training: "As of March 1, 2023, data sent to the OpenAI API is not used to train or improve OpenAI models (unless you explicitly opt in to share data with us)." (Data usage)
- Abuse logs: "By default, abuse monitoring logs are generated for all API feature usage and retained for up to 30 days, unless longer retention is required by law, or is reasonably necessary to protect our services or any third party from harm." (Abuse monitoring)
- ZDR: "Zero Data Retention excludes customer content from abuse monitoring logs in the same way as Modified Abuse Monitoring." It needs prior approval, and forces the `store` parameter to false. (Zero Data Retention)
- Responses API: stored for at least 30 days by default when `store` is enabled. (Responses API storage)

## Visuals worth redrawing

- None.

## My notes

- One provider only. Other providers' policies differ; check each one you send data to.
