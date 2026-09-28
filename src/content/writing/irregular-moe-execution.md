---
title: "Understanding Irregular MoE Execution on Modern GPUs"
titleZh: "理解现代 GPU 上的不规则 MoE 执行"
description: "Analyzing routing, token distribution, and execution behavior without reducing irregular workloads to an average case."
descriptionZh: "分析路由、Token 分布与执行行为，而不把不规则负载简化成平均情形。"
publishDate: 2026-08-27
tags: [GPU, Scheduling, MoE]
readingTime: 16
draft: false
featured: true
---
## Why irregularity matters

Mixture-of-experts execution inherits variability from routing. A useful analysis preserves the distribution rather than reporting only its mean.

## Measurement plan

TODO: record the verified workload, hardware, runtime revision, and profiler captures.
