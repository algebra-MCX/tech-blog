---
title: "From an expert-load model to a real project"
titleZh: "从专家负载模型走向真实项目"
description: "A reading order through the concepts, minimal experiment, measurement method and source materials."
descriptionZh: "按顺序连接基本概念、最小实验、测量方法与原始材料。"
publishDate: 2026-10-22
category: learning-paths
domains: [algorithms, infra]
tags: [MoE, Learning]
---
## Before you start

You need basic Python and familiarity with matrix multiplication. The first experiment runs on a CPU; repository GPU experiments have their own hardware and environment requirements.

## Build the model

Read [useful work and the critical path](/guides/useful-work/). Explain why a fixed total assignment count does not determine maximum expert load.

## Test one variable

Run the [expert-load example](/guides/expert-load-imbalance/). Change the distribution while keeping the total fixed. State what the toy model establishes and what it leaves out.

## Design a measurement

Use the [paired benchmark playbook](/guides/paired-benchmarks/). Specify a correctness rule, timing boundary and raw artifact format for the next experiment.

## Enter the project

Open [MoEFlow](/projects/moeflow/). Start with its overview, then follow the repository validation and order-control reports. Keep local layer results distinct from end-to-end serving results.

## A question to take away

What additional evidence would let you move from a local improvement to a reliable serving-performance claim? Write down the missing workload coverage and controls before extending the experiment.
