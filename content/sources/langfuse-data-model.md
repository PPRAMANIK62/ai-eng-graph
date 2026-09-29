---
id: langfuse-data-model
title: Tracing data model
author: Langfuse
url: https://langfuse.com/docs/observability/data-model
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

How one open-source LLM tracing tool structures its data. Each step of your app (model call, tool call, retrieval) is an observation; observations nest inside a trace, which is one request from start to finish; traces can be grouped into sessions for multi-turn conversations. It is built on OpenTelemetry and sends data in the background.

## Key claims

- Observations are the steps: "the individual steps of your application: LLM calls, tool calls, retrieval steps, and so on." They nest, and have types such as generation and event. "Langfuse calls spans observations; `span` is also a specific observation type." (Traces, observations, sessions)
- A trace is one request: "a single request or operation, for example one chatbot interaction from the user's question to the final response." It is "the logical grouping of all observations that share the same `trace_id`." (same)
- Sessions group traces: "sessions are used to group traces that are part of the same user interaction", "recommended for applications with multi-turn conversations or workflows." (same)
- Built on OpenTelemetry, "an open standard for collecting telemetry data from applications." (Built on OpenTelemetry)
- Sending is asynchronous. "Langfuse batches traces locally and sends them in the background." Short-lived programs must call `flush()` before exiting or lose data. (Background processing)

## Visuals worth redrawing

- The session > trace > observation nesting, as a tree.

## My notes

- Vendor docs, but the three-level shape (session, trace, span) matches OpenTelemetry's traces and spans.
