---
id: nvidia-nim-benchmarking-metrics
title: "Metrics — NVIDIA NIM LLMs Benchmarking"
author: NVIDIA
url: https://docs.nvidia.com/nim/benchmarking/llm/latest/metrics.html
published: 2026-07-20        # "Last updated on Jul 20, 2026"
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

NVIDIA's definitions of the latency and throughput numbers used when benchmarking an LLM server: time to first token, end-to-end latency, inter-token latency, tokens per second and requests per second. Useful because it says exactly what each number includes, such as queueing and network time inside TTFT.

## Key claims

- TTFT is the wait before any output shows up. "Time to first token (TTFT) measures how long you wait before seeing the model's output." (Time to First Token)
- TTFT includes queueing, prefill and the network. "Time to first token generally includes request queuing time, prefill time, and network latency." (Time to First Token)
- Longer prompts raise TTFT. "Longer prompts increase TTFT because the attention mechanism uses the full input sequence to create the KV cache before generation begins." (Time to First Token)
- On a busy server, requests overlap. "In a production application, several requests can be in progress at the same time, so one request's prefill phase can overlap with another request's generation phase." (Time to First Token)
- TTFT as measured also includes tokenization and de-tokenization. Figure 2 caption: "TTFT - Time to First Token including both the tokenization and de-tokenization steps for the first output token." (Time to First Token, Figure 2)
- The benchmark tool ignores empty first responses. "NVIDIA AIPerf disregards initial responses with no content or an empty string" (Time to First Token)
- End-to-end latency is from sending to the full response. "End-to-end request latency, or e2e request latency, measures how long it takes from submitting a query to receiving the full response." Formula: "e2e_latency = TTFT + Generation_time" (End-to-End Request Latency)
- ITL is the average gap between tokens, also called TPOT, and leaves out the first token. "Inter-token latency (ITL) is defined as the average time between consecutive tokens and is also known as time per output token (TPOT)." "The equation for this metric does not include the first token." Formula: "(e2e_latency - TTFT) / (Total_output_tokens - 1)" (Inter-token Latency)
- TPS is system-wide output throughput. "Total tokens per second (TPS) per system represents total output token throughput across all simultaneous requests." (Tokens Per Second)
- RPS. "Requests per second (RPS) is the average number of requests that can be successfully completed by the system in a 1-second period." (Requests Per Second)

## Visuals worth redrawing

- Figure 2, the TTFT timeline (queue, prefill, first token). Redrawn as part of the llm-latency request timeline.

## My notes

- Written for people running their own server (NIM). Over a hosted API you can't see the queue or prefill separately, only the total TTFT from your side.
- No percentiles on this page.
