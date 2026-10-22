---
title: "Plan a paired benchmark you can inspect later"
titleZh: "设计一次日后能够复查的配对测试"
description: "Define the boundary, validate outputs and retain the individual observations."
descriptionZh: "定义边界、验证输出，并保留每次观测。"
publishDate: 2026-10-22
category: playbooks
domains: [infra, algorithms, data]
tags: [Benchmarking, Evaluation]
---
## Define the comparison

Write down the workload, output contract, metric and boundary before running A and B. Record code revisions, hardware, dependency versions, inputs and invocation. A layer measurement cannot alone establish a serving improvement.

## Check correctness first

Use the same inputs and a declared comparison rule. Exact equality and tolerance-based comparisons answer different questions. Preserve mismatches and explain any permitted tolerance.

## Pair and alternate

Warm up both paths. Collect repeated pairs, alternating A/B and B/A order. Retain each observation and the run order, rather than only the final average. This helps expose drift; it does not eliminate every source of interference.

For asynchronous devices, define and apply the synchronization or device-timing boundary consistently. Keep setup and compilation separate when they are outside the intended metric.

## Inspect and report

Plot or inspect the distribution and paired differences. Report the sample count, aggregation, uncertainty and controls. If the direction reverses between rounds, retain that observation and investigate the order or environment before claiming a stable improvement.

## Save the artifact

Keep a manifest with the configuration, exact command, raw samples, correctness results and analysis script. The [MoEFlow order-control report](https://github.com/algebra-MCX/MoEFlow/blob/development/docs/e2e_w1_order_control.md) is a concrete repository reference. Follow the [project page](/projects/moeflow/) for its scope and related evidence.
