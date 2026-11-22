---
title: "What are prefill, decode and KV cache? Follow one LLM request"
titleZh: "Prefill、Decode 和 KV Cache 是什么？沿一条大模型请求看懂"
description: "Trace a 2,048-token prompt through prefill and four output tokens. Count what the model reuses and run a short Python example."
descriptionZh: "沿一条 2,048 token 的请求看 prefill 与四次生成，数清 KV Cache 复用了什么，并运行最小 Python 示例。"
publishDate: 2026-11-22
category: concepts
domains: [infra]
tags: [LLM inference, KV cache, Python]
---
## Follow the first four output tokens

During prefill, the model processes the 2,048 prompt positions, stores attention keys and values for those positions, and predicts output token 1. To predict token 2, it feeds token 1 through the model, reads previous KV and adds KV for token 1. Each remaining step repeats that pattern.

| To predict | Positions processed on this step | Cached positions after the step |
| --- | ---: | ---: |
| Output 1 | 2,048 | 2,048 |
| Output 2 | 1 | 2,049 |
| Output 3 | 1 | 2,050 |
| Output 4 | 1 | 2,051 |

The last sampled token gets a KV entry when it is fed back into the model. Standard causal attention for the new position still uses earlier context, so longer contexts can increase KV reads even when only one new position is processed.

## Predict, then run

Before running, predict how many positions get processed if the same prompt generates eight tokens. This counts positions processed by the model, with and without KV reuse. It omits attention FLOPs, memory bandwidth, batching and runtime overhead, so it cannot predict latency.

```python
prompt = 2048
outputs = 4
with_cache = prompt + outputs - 1
without_cache = sum(prompt + step for step in range(outputs))
print(with_cache, without_cache)  # 2051 8198
```

Change just `outputs` to 8, sketch the steps on a whiteboard, and explain why the first prediction uses prefill. Next, ask which memory cost would change with sliding-window attention even if these position counts stay fixed.

## See how a real runtime schedules it

The [DeepInfer-Lab architecture guide](https://github.com/algebra-MCX/DeepInfer-Lab/blob/23ccc4dca8bb58fb47803ee061ee0825bacdfe9f/README.md#architecture) follows the same request through a queue, paged cache allocation, chunked prefill and sampling. Read it to see how continuous batching changes when each step runs.
