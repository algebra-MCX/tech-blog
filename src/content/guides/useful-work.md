---
title: "Useful work, padded work, and the critical path"
titleZh: "有效工作、填充开销与关键路径"
description: "Three distinctions to make before interpreting an optimization result."
descriptionZh: "解读一次优化结果前，先分清三件事。"
publishDate: 2026-10-22
category: concepts
domains: [algorithms, infra]
tags: [MoE, Measurement]
---
## Start with the boundary

Before comparing two implementations, name the output that counts as finished. A kernel boundary, a routed MoE layer and a complete request measure different things.

## Useful work and executed work

Suppose four experts receive `[64, 0, 0, 0]` tokens. There are 64 useful token–expert assignments. A hypothetical implementation that reserves 64 slots for each expert provides 256 slots. That capacity is not a measured operation count: an implementation might skip empty slots or run a different kernel.

Use the distinction to ask a concrete question: does the implementation save launch overhead while executing or moving more data? Inspect the code and traces before answering.

## Find the critical path

A shorter kernel does not automatically imply a shorter request. Dependencies, communication, synchronization and preparation can determine when the result becomes available. Record both the local boundary and the end-to-end boundary when making a performance claim.

## Next step

[Run a small expert-load experiment](/guides/expert-load-imbalance/), then [plan a paired comparison](/guides/paired-benchmarks/). The [MoEFlow project](/projects/moeflow/) connects these ideas to repository reports.
