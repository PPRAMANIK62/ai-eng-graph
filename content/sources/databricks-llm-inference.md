---
id: databricks-llm-inference
title: "LLM Inference Performance Engineering: Best Practices"
author: Megha Agarwal, Asfandyar Qureshi, Nikhil Sardana, Linden Li, Julian Quevedo, Daya Khudia (Databricks)
url: https://www.databricks.com/blog/llm-inference-performance-engineering-best-practices
published: 2023-10-12
accessed: 2026-09-23
kind: blog
primary: true
---

## Summary

Databricks' guide to what makes LLM serving fast or slow, written by a team that runs inference at scale. It splits a request into prefill (read the prompt in parallel) and decode (write one token at a time), defines the latency metrics everyone now uses (time to first token, time per output token), and shows that decode is limited by memory bandwidth, which is why output length dominates response time.

## Key claims

- The two steps. "'prefill', where the tokens in the input prompt are processed in parallel, and 'decoding', where text is generated one 'token' at a time in an autoregressive manner" (Understanding LLM Text Generation)
- Why decode is memory-bound: at small batch sizes one matrix dimension is small, so speed depends on loading the weights from GPU memory. "the speed is dependent on how quickly we can load model parameters from GPU memory." (Challenges in LLM Inference)
- TTFT defined. "Time To First Token (TTFT): How quickly users start seeing the model's output after entering their query" (Important Metrics for LLM Serving)
- TPOT defined. "Time Per Output Token (TPOT): Time to generate an output token for _each_ user" (Important Metrics for LLM Serving)
- Example: a TPOT of 100 ms per token is 10 tokens per second per user. "100 milliseconds/tok would be 10 tokens per second per user" (Important Metrics for LLM Serving)
- The latency formula. "latency = _(TTFT)_ + _(TPOT)_ * (the number of tokens to be generated)" (Important Metrics for LLM Serving)
- Throughput is output tokens per second across all users. "The number of output tokens per second an inference server can generate across all users" (Important Metrics for LLM Serving)
- Output length drives latency. "Output length dominates overall response latency" (Important Metrics for LLM Serving)
- Input is cheap in time compared with output. "The addition of 512 _input_ tokens increases latency less than the production of 8 additional _output_ tokens" (Important Metrics for LLM Serving)
- Decode is memory-bandwidth-bound at small batch sizes: generating a token is "memory-bandwidth-bound on most hardware". (Memory Bandwidth is Key)
- Worked example: a 7B model in 16-bit has 14GB of weights to move for every token. "7B parameter running with 16-bit precision has TPOT equal to 14ms, then it's moving 14GB of parameters" (Model Bandwidth Utilization (MBU))
- MBU measures how much of peak bandwidth you use; achieved bandwidth counts both weights and KV cache per token. "((total model parameter size + KV cache size) / TPOT)" (Model Bandwidth Utilization (MBU))
- KV cache: the saved keys and values of the attention layers, so they aren't recomputed. "saving of intermediate keys/values for the attention layers" (Optimization Case Study: Quantization)
- KV cache size formula. "batch_size * seqlen * (d_model/n_heads) * n_layers * 2 (K and V) * 2 (bytes per Float16) * n_kv_heads" (Optimization Case Study: Quantization)
- GQA shrinks the cache by sharing keys and values; Llama 2 uses it. "keep the KV cache size down by sharing Keys/Values" (Optimization Case Study: Quantization)
- Batching trades per-request speed for total throughput. "Grouping queries during GPU evaluation increases throughput compared to processing queries sequentially, but each query will take longer to complete" (Throughput)
- Example: batch size 64 gives 14x the throughput at 4x the latency. "If we maximize throughput with a batch size of 64, latency increases by 4x while throughput increases by 14x" (Latency Trade-Off)
- H100 has 2.15x the memory bandwidth of A100. "2.15x GPU memory bandwidth" (Latency Trade-Off)

## Visuals worth redrawing

- The latency breakdown: TTFT as one block, then a row of equal TPOT ticks, one per output token. The main visual for the prefill-decode node.

## My notes

- 2023, on MPT-7B and Llama 2 era models and A100/H100 GPUs. The mechanism still holds; the specific milliseconds don't.
- Nothing here about prices. Linking decode's memory cost to why providers charge more for output is an inference, not a claim of this post.
- The 512-input-vs-8-output heuristic was measured on their setup; treat it as an order-of-magnitude illustration.
