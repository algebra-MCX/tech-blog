---
title: "GPU Memory Behavior in Long-Context Inference"
description: "Questions and instrumentation for understanding memory access patterns and bandwidth utilization in long-context serving."
publishDate: 2026-07-15
tags: [Memory, KV Cache]
readingTime: 12
draft: false
---
## Questions

Which allocations scale with sequence length, which are retained across requests, and which accesses constrain the measured path? TODO: attach validated traces.
