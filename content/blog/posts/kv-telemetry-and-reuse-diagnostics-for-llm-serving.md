### Overview

This project is an initial attempt to understand instaces KV cache reuse is actually helpful in LLM serving systems. I was inspired by reading the LMCache paper, which adds explicit KV reuse and offloading on top of vLLM. Running a live setup using vLLM + LMCache on a single H100, using Llama 3.1 8B Instruct so I can test more realistic system behavior without too much overhead (model is already LMcache compatible).

---

### Workload Plan

The idea is to generate controlled & synthetic requests that mimic real use cases:
- repeated prompts (for high reuse)
- partially overlapping prompts
- long-context inputs
- simple chat-style interactions

---

To do this, I plan to use:
- GuideLLM → to control traffic, request rate, and concurrency  
- vLLM datasets → to control how much prefix overlap exists  

This lets me test how cache behaves under different patterns instead of random inputs.

---

Using LMCache, I’m explicitly varying cache behavior (enabling reuse, comparing against recomputation, and testing offloading) to understand how different cache regimes impact system performance under controlled workloads.

---

Concretely, I plan to compare:
- vLLM baseline (recomputation-dominated)
- vLLM + LMCache (reuse enabled)
- vLLM + LMCache + offloading (memory-constrained setting)

---

### What I’ll Measure

For each workload, I’ll collect:
- cache hit rate  
- KV memory usage  
- throughput (prompt vs generation)  
- latency trends  

---

### Goal

The goal is to build a simple telemetry layer that takes these signals and **explains what’s actually happening**: whether reuse is actually helping, when recomputation is dominating, and when offloading might be worth it. I’ll probably have a simple interface like CLI + lightweight dashboard.