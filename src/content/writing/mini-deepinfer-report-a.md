---
title: "Performance Report A: Sparse Attention on Tensor Cores"
titleZh: "性能分析报告 A：稀疏注意力改用 tensor core"
description: "Real V4.1 4-GPU prefill goes from 1,085 to 2,572 tok/s/GPU (2.37×) after the sparse-attention kernel moves from CUDA cores to tensor cores."
descriptionZh: "稀疏注意力 kernel 从 CUDA core 改用 tensor core 后，真实 V4.1 四卡 prefill 吞吐从 1,085 提高到 2,572 tok/s/GPU（2.37 倍）。"
publishDate: 2026-10-22
tags: [DeepInfer, DeepSeek-V4.1, B200, Triton, Attention, Benchmarking]
readingTime: 7
draft: false
eyebrow: "Performance report"
eyebrowZh: "性能报告"
---
2026-10-22 · PR #38 · code `804f4b0` (before the change: `eac0347`)

## Conclusion

Real V4.1 4-GPU prefill throughput rises from 1,085 to **2,572 tok/s/GPU (2.37×)**, and the step time falls from 3,776 ms to 1,593 ms. The gap to the official engine shrinks from 33.3× to **14.1×**; mini reaches 7.1% of the official engine. The sparse-attention kernel drops from 2,255 ms/step to 98.8 ms/step (22.8×) and is no longer the bottleneck. The two largest items now are MoE (726 ms) and the indexer (461 ms).

## Setup

| Item | Configuration |
| --- | --- |
| Model | Real DeepSeek-V4.1-Flash, revision `dba1be0` |
| Hardware / topology | 1 node, 4 × B200, EP4 / DP4 / CP1 |
| Workload | `workload.json.gz` (SHA-256 `adf09ec9…`), 131,072 context, 126,976 cached, 4,096 new tokens per step per rank |
| Timing | 10 complete steady-state steps on rank 0; plus a 2-step torch profile |
| Jobs | Before the change and official: 9297; after the change: 9329 |

## End-to-end results

| Metric | Before | After | Official | Change |
| --- | ---: | ---: | ---: | --- |
| Input throughput (tok/s/GPU) | 1,084.8 | **2,571.7** | 36,170.9 | ×2.37 |
| Mean step (ms) | 3,775.9 | **1,592.7** | 113.2 | −57.8% |
| Step variation (ms) | 3,774.9–3,777.0 | 1,591.5–1,596.8 | 111.5–116.3 | Stable on both sides |
| Share of official | 3.0% | **7.1%** | 100% | |
| Gap to official | 33.3× | **14.1×** | — | |
| Peak memory (GiB) | 147.6 | 147.6 | — | Unchanged (scratch is 42 MB per query block) |

## Per-stage time (profile, ms/step)

| Stage | Before | After | Official | Current gap |
| --- | ---: | ---: | ---: | ---: |
| Sparse attention core | 2,254.9 | **98.8** | 14.9 | 6.6× |
| Indexer | 460.7 | 460.8 | 7.9 | 58× |
| Other attention (projections, compression, gather, fake quant) | 253 | 254 | ~19 | 13× |
| MoE (gate + experts + communication) | 746 | 726 | 52.8 | 14× |
| HC, normalization and other | 123 | 122 | ~10 | 12× |
| **Total (step under profile)** | **3,838** | **1,662** | **110.6** | **15×** |

Only sparse attention changed; every other stage is within measurement error, which shows the change has no side effects. The step under the profiler is about 4% longer than the timing window; that is the profiler's own overhead.

## Kernel analysis

| Shape (T, H, K, D) | Old (ms) | New (ms) | Speedup | New TFLOP/s |
| --- | ---: | ---: | ---: | ---: |
| 256, 64, 640, 512 (real compressed layer) | 3.672 | 0.166 | 22.1× | 129 |
| 256, 64, 128, 512 (real uncompressed layer) | 0.686 | 0.069 | 9.9× | 62 |
| 256, 4, 640, 512 (tiny model) | 0.284 | 0.105 | 2.7× | 13 |

- **Why it is faster:** the 64 heads of one query share the same 640 keys. The old kernel ran one program per (query, head) and summed with `tl.sum` on CUDA cores, reading the same key set 64 × 2 times. The new kernel stacks 32 heads into the M dimension of `tl.dot`, runs on tensor cores, and reads each key set once for QK and once for PV per head block.
- **How far from peak:** each step's attention is about 13.2 TFLOP, so 98.8 ms is 134 TFLOP/s, roughly 6% of B200's dense bf16 peak. The official 14.9 ms is about 0.89 PFLOP/s.
- **Why a gap remains:**
  1. M is only 32, so the tensor-core tile is small. With HEADS=64 the fp32 accumulator [64, 512] does not fit in registers and spills; the parameter sweep confirms it.
  2. The two-pass algorithm writes and reads the scores scratch once more.
  3. About 180 ms of gather/copy outside the kernel assembles the keys into [T, 640, 512].
- **The tiny model gains little:** it has only 4 heads, which cannot fill an M=16 tile, so sharing keys helps less.

## Accuracy

- The maximum error against the fp32 CPU reference is the same order as the old kernel (≤ 4.9e-4). Tensor-core accumulation order differs, so results are not bit-identical to the old kernel.
- The bf16 probability-rounding regression fixture still passes; it fails if the bf16 rounding is removed or the sink is folded into the max.
- All end-to-end reference tests pass (golden tokens, per-position logits along the reference trajectory, chunked prefill, preemption). Full suite: 163 passed.

## Tiny-model goodput (1 GPU, `bench.py` defaults, median of 3)

| | Throughput (tok/s) | TTFT p50 (ms) | TPOT p50/p99 (ms) | goodput (req/s) |
| --- | ---: | ---: | --- | ---: |
| Before | 6,791 | 294 | 4.8 / 16.1 | 49.36 |
| After | 7,202 (+6%) | 274 | 4.6 / 15.0 | 52.36 (+6%) |

## Next

Ordered by remaining time: MoE 726 ms, indexer 461 ms, other attention 254 ms.

1. **B1:** fuse indexer scoring. The micro-benchmark already drops from 61.8 ms to 4.9 ms per layer (904 TFLOP/s); this item should go from about 461 to 90 ms, for about 3,200 tok/s/GPU.
2. **B2:** score only the candidate blocks in layers 24–36.
3. **C:** run MoE grouped GEMM directly on FP4 weights.

Raw data: [`profile-2026-10-22/stage-a/`](https://github.com/algebra-MCX/mini-DeepInfer/tree/main/docs/benchmarks/profile-2026-10-22/stage-a/); before the change: [`profile-2026-10-22/`](https://github.com/algebra-MCX/mini-DeepInfer/tree/main/docs/benchmarks/profile-2026-10-22/).
