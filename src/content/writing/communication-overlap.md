---
title: "Communication Overlap Is Not Free"
titleZh: "通信重叠并非免费"
description: "A closer look at GPU contention, NCCL, and the limits of overlap in expert-parallel inference."
descriptionZh: "重新审视专家并行推理中的 GPU 争用、NCCL，以及通信重叠的边界。"
publishDate: 2026-09-18
tags: [Distributed Systems, EP]
readingTime: 8
draft: false
featured: true
---
## Working premise

Overlap changes when a cost is paid and which resource observes it. This note is an outline pending verified measurements.

## Evidence needed

- An exact software and hardware configuration
- Paired traces with the same inputs
- Device, network, and CPU utilization
- A clear definition of the end-to-end objective

## Status

TODO: add validated results and link the corresponding implementation.
