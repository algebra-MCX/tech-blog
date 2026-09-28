---
title: "GPU Memory Behavior in Long-Context Inference"
titleZh: "长上下文推理中的 GPU 内存行为"
description: "Questions and instrumentation for understanding memory access patterns and bandwidth utilization in long-context serving."
descriptionZh: "用于理解长上下文服务中内存访问模式与带宽利用率的问题和测量方法。"
publishDate: 2026-07-15
tags: [Memory, KV Cache]
readingTime: 12
draft: false
---
## Questions

Which allocations scale with sequence length, which are retained across requests, and which accesses constrain the measured path? TODO: attach validated traces.
