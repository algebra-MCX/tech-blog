---
title: "Understanding Irregular MoE Execution on Modern GPUs"
description: "Analyzing routing, token distribution, and execution behavior without reducing irregular workloads to an average case."
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
