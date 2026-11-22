---
title: "A Reading Path Through My Research"
titleZh: "如何阅读我的研究与工程成果"
description: "Start with a measured investigation, inspect the implementation and evidence, then find the open questions."
descriptionZh: "先看有测量的代表作，再核对实现与证据，最后查看尚待验证的问题。"
publishDate: 2026-11-22
category: learning-paths
domains: [algorithms, data, infra]
tags: [Start Here, Research, Evidence]
---
This site is for researchers and engineers who want to understand how I reason about AI systems, inspect what I built and decide whether there is a useful technical conversation to have.

The [homepage](/) is an editorial selection, not a list sorted by recency. Start with the question that is closest to your work.

## Start with one investigation

**Performance reasoning:** read [the three-step DeepInfer-Lab prefill study](/writing/mini-deepinfer-prefill/). It moves from a profile to a kernel change, correctness checks and a new bottleneck. The 3.98× improvement is relative to my initial implementation. The official reference remains 8.4× faster in the stated configuration.

**Execution-design tradeoffs:** read [MoEFlow's fixed-capacity study](/writing/moeflow-fixed-capacity/). Fusion improves its own Torch Ring baseline, but native vLLM still wins the separate layer comparison. Stable serving speedup is not established.

**Upstream engineering:** read [the merged vLLM DBO correctness fixes](/writing/vllm-dbo-correctness/). Follow token-row ownership from a failing regression to the patch, model comparison and collaborator's refactor.

## Find the evidence beside the claim

For each study, look for the baseline, exact measurement boundary, model, hardware, workload, correctness rule and known limits. The numerical widget on the prefill study switches among recorded rounds; it is not a GPU simulation or a fresh benchmark.

| Work | Implementation | Experimental or review evidence |
| --- | --- | --- |
| DeepInfer-Lab, formerly mini-DeepInfer | [Source snapshot](https://github.com/algebra-MCX/DeepInfer-Lab/tree/23ccc4dca8bb58fb47803ee061ee0825bacdfe9f) | [Logs, profiles and job plans](https://github.com/algebra-MCX/DeepInfer-Lab/tree/23ccc4dca8bb58fb47803ee061ee0825bacdfe9f/docs/benchmarks/profile-2026-10-22) |
| MoEFlow | [Source and independent reference](https://github.com/algebra-MCX/MoEFlow/tree/2f4968ffef7cac4f8dcf39a4a65cec55c60472f8) | [Recorded tables and limitations](https://github.com/algebra-MCX/MoEFlow/blob/2f4968ffef7cac4f8dcf39a4a65cec55c60472f8/README.md#performance); raw paired JSON is not in this snapshot |
| vLLM | [Routing patch and regression](https://github.com/vllm-project/vllm/pull/63372/files) | [Review, validation and co-author credit](https://github.com/vllm-project/vllm/pull/63372) |

I have checked that these materials are available. That is not a claim that I reran their GPU benchmarks while preparing this site. Historical source labels and incomplete provenance stay visible in the reports.

## Distinguish results from proposals

**Measured experiment** means a stated configuration has recorded results. **Merged engineering** means the linked upstream accepted the change. **Mechanism analysis** explains an implementation. **Engineering proposal** remains a proposed change. **Research outline** contains questions or a measurement plan, not established experimental conclusions.

The [decode-staging proposal](/writing/vllm-decode-staging/) is a useful example: historical timings and head-specific correctness tests have different versions and limits. They cannot be promoted into one general speedup claim. The [writing archive](/writing/) labels the state of every entry.

## Follow a request when the mechanism gets complicated

Read [the runtime walkthrough](/writing/mini-deepinfer-runtime/): request arrival, block and state-slot allocation, prefill/decode scheduling, sampling and release. Then use the [technical notes](/writing/mini-deepinfer-technical-notes/) for module-level details. The diagram, worked row examples and measurements should explain the same contract.

## Bring a concrete question

A counterexample, reproduction attempt, trace or alternative design is a good reason to talk. Include the input, source revision, comparison rule and the boundary where our explanations differ. Reach me through [my personal homepage](https://algebra-mcx.github.io/) or open a [DeepInfer-Lab issue](https://github.com/algebra-MCX/DeepInfer-Lab/issues).

— Chenxi Ma
