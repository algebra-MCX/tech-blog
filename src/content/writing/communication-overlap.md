---
title: "Communication Overlap Is Not Free"
description: "A closer look at GPU contention, NCCL, and the limits of overlap in expert-parallel inference."
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
