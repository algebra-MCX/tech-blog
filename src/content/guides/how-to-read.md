---
title: "How to read this blog"
titleZh: "如何阅读这个博客"
description: "Research questions, engineering decisions and reproducible experiments—with a project-driven path into the fundamentals."
descriptionZh: "研究问题、工程取舍与可复现实验，以及从最小项目走向独立探索的学习路径。"
publishDate: 2026-10-22
category: learning-paths
domains: [algorithms, data, infra]
tags: [Start Here, Research, Project-driven Learning]
---
**I build AI systems to understand them. This blog records the questions, engineering decisions and experiments that emerge along the way.**

My current work starts with LLM inference: runtime scheduling, distributed MoE execution and GPU performance. I am interested in how model architecture, hardware and workload behavior shape a system's design—and in which observations hold beyond a single implementation.

## Start with a question

A useful article begins with a concrete problem. Why did a kernel speedup barely move throughput? Which dependency sets the critical path? What changes when routing becomes imbalanced?

I try to make the reasoning visible: the observation, constraints, alternatives, implementation, measurements and remaining questions. A failed hypothesis can be as useful as a successful optimization when it explains how the system behaves.

## Read the work at three depths

- **For the result:** start with the [prefill performance report](/writing/mini-deepinfer-prefill/). It traces three kernel improvements from 1,085 to 4,316 input tok/s/GPU and explains the remaining gap to the reference engine.
- **For the mechanism:** follow [a request through mini-DeepInfer](/writing/mini-deepinfer-runtime/), then read the [design decisions](/writing/mini-deepinfer-design/).
- **For the evidence:** inspect the linked code, configurations, profiles, correctness checks and experiment reports. The [project pages](/projects/) connect these records.

The [research archive](/writing/) separates developed articles from working outlines. An outline records a question or measurement plan; it should be read as work in progress.

## What a measurement means

A result needs context: software revision, hardware, workload, baseline, metric and measurement conditions. Kernel latency, layer execution time and serving throughput answer different questions.

For example, the mini-DeepInfer prefill report measures a real model on 4 × B200, with one paired run per stage. Its final throughput is 11.9% of the official reference. Decode CUDA graphs were off, and KV budgets were not forced equal. Those conditions belong beside the result.

For empirical work, I aim to link the implementation, reproduction commands, raw measurements and known limitations. For architectural arguments and research notes, I distinguish existing evidence from an interpretation or a hypothesis that still needs testing. Upstream PR status is recorded separately from experimental results.

## Learn by building

The learning philosophy remains project-driven: build the essential mechanism, change one variable and explain what happens. The first goal is a working mental model and the ability to explore independently.

The [learning hub](/guides/) and [Quickstarts](/guides/sections/quickstarts/) collect small starting points across systems, algorithms, hardware, agents and data. These routes will grow through minimal implementations, key experiments and practical checks.

A minimal inference engine should help you reason about scheduling and KV lifetime. A small kernel experiment should help you predict how a change in shape or memory access affects execution. Return to the fundamentals when a concrete problem exposes a gap.

## Connect local mechanisms to the whole

Model architecture changes memory and communication requirements. Hardware changes which algorithms are practical. Workload dependencies change what a serving system should optimize.

My inference work is a starting point for exploring those connections. Broader ideas will appear as research notes, with their assumptions and open questions made explicit, and evolve as implementation and experiments provide better evidence.

## Reproduce, question, discuss

Corrections, reproductions and technical disagreements are welcome. A useful discussion can begin with a specific observation, a counterexample or a configuration under which a result changes.

You can find the code through [Projects](/projects/) or [GitHub](https://github.com/algebra-MCX), or [email me](mailto:shannon20051127@gmail.com). [Notes](/notes/) also holds personal reflections on learning and life.

I hope this becomes a place where careful engineering leads to better questions, and where those questions can be investigated together.

— Chenxi Ma
