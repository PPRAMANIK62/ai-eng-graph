---
id: langfuse-masking
title: Masking sensitive data
author: Langfuse
url: https://langfuse.com/docs/observability/features/masking
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

How to redact sensitive data from traces before it leaves your app. You give the tracing SDK a masking function; it runs on your side, at export time, over inputs, outputs and metadata. The examples use regexes for card numbers, emails and phone numbers. The function must be fast, and if it throws, the whole batch is dropped.

## Key claims

- Purpose: to "redact sensitive information from trace or observation inputs, outputs, and metadata". (Why mask)
- Runs client-side, before data is sent to Langfuse. (Where masking runs)
- Python hook: `mask_otel_spans(*, params: MaskOtelSpansParams)`; JS/TS: a `mask: ({ data }) => ...` option. (Mask function)
- Example regex for card numbers `\b(?:\d[ -]*?){13,19}\b` replaced with `[REDACTED CREDIT CARD]`; similar for emails and phones. (Examples)
- The Python mask is synchronous and should be "deterministic and fast" so it doesn't back up the export queue. (Caveats)
- If the mask raises, "Langfuse drops the whole export batch". (Caveats)
- It only changes spans sent by that Langfuse client; other exporters get the unmasked data. For pure OpenTelemetry setups, mask in an OpenTelemetry Collector instead. (Caveats)

## Visuals worth redrawing

- App, then mask, then exporter, then tracing backend; the model provider sees the unmasked prompt.

## My notes

- Masking the trace doesn't mask what you send the model provider; that's a separate decision.
