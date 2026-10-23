---
title: "From 3% to 11.9% of DeepInfer: Three Prefill Kernels on 4 × B200"
titleZh: "从官方的 3% 到 11.9%：4 × B200 上的三项 prefill 优化"
description: "Paired, profiled measurements of the real DeepSeek-V4.1-Flash: tensor-core sparse attention, a fused indexer and a local-row MoE combine took mini-DeepInfer from 1,085 to 4,316 input tok/s/GPU — and showed where the remaining 8.4× lives."
descriptionZh: "真实 DeepSeek-V4.1-Flash 上的配对、带 profile 的测量：tensor core 稀疏注意力、融合 indexer 和只合并本地行的 MoE，把 mini-DeepInfer 从 1,085 提到 4,316 输入 tok/s/GPU，并定位了剩余 8.4 倍差距所在。"
publishDate: 2026-10-23
tags: [DeepInfer, DeepSeek-V4.1, B200, Triton, MoE, Benchmarking]
readingTime: 14
draft: false
eyebrow: "Performance report"
eyebrowZh: "性能报告"
---
## The measurement

[mini-DeepInfer](/writing/mini-deepinfer-runtime/) runs the real DeepSeek-V4.1-Flash on a single node with 4 × B200. The prefill benchmark copies the way DeepInfer measures itself: request counts, warm-up and measurement windows and metric definitions match the official `run_sweep.sh prefill`, and the same workload file drives both engines.

| Item | Configuration |
| --- | --- |
| Model | Real DeepSeek-V4.1-Flash, revision `dba1be0` |
| Hardware / topology | 1 node, 4 × B200, EP4 / DP4 / CP1 |
| Context | 131,072 tokens, of which 126,976 cached |
| Work per step | 4,096 uncached input tokens per rank |
| Window | 10 complete steady-state steps on rank 0, plus a 2-step torch profile |
| Both engines | Full replay, real routing, no redundant experts, no speculation, no decode CUDA graphs |
| Reference | Official DeepInfer + a single-node NVLink adapter |

Only prefill is measured, and KV memory budgets are not forced to match. Every number below is a single paired run unless marked otherwise.

## Where it started

The first validated real-model run reached **1,084.8 input tok/s/GPU** against the official **36,170.9** — 3.0% of the reference, a 33.3× gap. A profile of one step (ms/step, rank 0) showed the gap was not spread evenly:

| Stage | mini | Official | Gap |
| --- | ---: | ---: | ---: |
| Sparse attention core | 2,254.9 | 14.9 | 151× |
| Indexer | 460.7 | 7.9 | 58× |
| MoE (gate + experts + communication) | 746 | 52.8 | 14× |
| Other attention (projections, compression, gather, fake quant) | 253 | ~19 | 13× |
| HC, normalization and other | 123 | ~10 | 12× |
| **Total (profiled step)** | **3,838** | **110.6** | **35×** |

One kernel was 59% of the step. The plan was to remove the largest item, re-profile, and repeat — and to check after each change that nothing else moved.

## A: sparse attention on tensor cores

A query's 64 heads share the same 640 keys. The old Triton kernel ran one program per (query, head) and reduced with `tl.sum` on CUDA cores, so each key set was read 64 × 2 times. The new kernel stacks 32 heads into the M dimension of a `tl.dot`, which runs on tensor cores and reads each key set once for QK and once for PV per head block.

| Shape (T, H, K, D) | Old (ms) | New (ms) | Speedup | New TFLOP/s |
| --- | ---: | ---: | ---: | ---: |
| 256, 64, 640, 512 (real compressed layer) | 3.672 | 0.166 | 22.1× | 129 |
| 256, 64, 128, 512 (real uncompressed layer) | 0.686 | 0.069 | 9.9× | 62 |
| 256, 4, 640, 512 (tiny model) | 0.284 | 0.105 | 2.7× | 13 |

Per step, sparse attention fell from 2,254.9 ms to **98.8 ms**, and every other stage stayed within measurement noise. End to end: **2,571.7 tok/s/GPU (2.37×)**, gap 14.1×.

It is still about 6% of B200's dense bf16 peak. M = 32 makes small tensor-core tiles — with 64 heads the fp32 accumulator `[64, 512]` spills registers — the two-pass algorithm writes and re-reads a scores scratch, and about 180 ms of gather and copy outside the kernel assemble the keys into `[T, 640, 512]`.

## B1: a fused indexer score

The indexer score is one bf16 GEMM, but the old path wrote the `[512, 32, n]` result to memory and then made three elementwise passes for relu, weighting and the per-head sum — roughly 4 × 34 GB of traffic in a ratio-1 layer and about 80% of the indexer's time.

The fused kernel loads a `[64 query × 128 entry]` tile of keys once, runs `tl.dot`, relu and weighting for the 32 heads in turn, accumulates in registers, and writes only the final `[T, n]` bf16 scores.

| Shape | Old: chunked einsum (ms) | New: fused (ms) | Speedup | TFLOP/s | Top-512 overlap (new / old) |
| --- | ---: | ---: | ---: | ---: | --- |
| T = 4,096, n = 65,536 (ratio-2 layer) | 30.81 | 2.52 | 12.2× | 874 | 0.9965 / 0.9957 |
| T = 4,096, n = 131,072 (ratio-1 layer) | 61.76 | 5.08 | 12.2× | 866 | 0.9934 / 0.9935 |

At about 870 TFLOP/s this kernel reaches 39% of dense bf16 peak. The first version launched once per sequence; a tiny-model prefill batch holds dozens of short sequences, and Triton's CPU launch overhead cost 9.5% of tiny throughput. The final version launches once per batch with a device-side `token_seq`, takes a fast path when a row block belongs to one sequence, and introduces no host synchronization.

The indexer fell from 460.8 to **76.5 ms/step** and peak memory dropped 3.1 GiB. End to end: **3,373.1 tok/s/GPU (+31%)**, gap 10.7×. The remaining 5.5× on scoring is FP8 Q × FP4 K in the official kernels and candidate-only scoring in layers 24–36.

## C1: MoE combine over local rows

After B1, MoE was 56% of the step. `GroupedExperts` produces rows sorted as `[T·k, 5120]` with T·k = 98,304, and only about a quarter come from this rank's experts. The old code converted the whole block to fp32 (2 GB per layer), zeroed non-local rows with `where`, restored order with `index_copy_` and summed per slot — mostly moving zeros.

| Routed-expert kernel (ms/step) | Before | After |
| --- | ---: | ---: |
| Copy of dequantized weights (Memcpy DtoD) | 85.7 | **0.1** |
| bf16 conversion (`.float()` etc.) | 66.0 | **0** |
| `index_copy_` to restore order | 59.0 | **0** |
| `where` to zero non-local rows | 55.8 | **0** |
| Per-slot sum | 16.5 | **0** |
| New combine kernel | — | **4.0** |
| FP4 dequantization | 128.1 | 132.3 |
| Grouped GEMM | 67.1 | 66.0 |
| SwiGLU, gather, sort | ~45 | ~47 |
| **Total** | **526** | **252** |

The combine kernel reads, for each token in slot order, only the rows of local experts, accumulates in fp32 and writes `[T, 5120]` once. The summation order matches the old code, so the result is deterministic. Dequantization now writes straight into its slice of the bf16 weight stack, removing a 6.8 GB copy per layer, and decodes E8M0 scales in the kernel with the two edge codes handled explicitly (0 → fp32 subnormal 2⁻¹²⁷, 255 → NaN).

MoE fell from 701 to **410 ms/step**. End to end: **4,315.9 tok/s/GPU (+27.8%)** — the micro-benchmark had predicted a step of about 950 ms; the measured step was 949.0 ms.

## Correctness gates

No change was accepted on speed alone:

| Change | Gate |
| --- | --- |
| A | Max error vs. an fp32 CPU reference ≤ 4.9e-4, the same order as the old kernel; the bf16 probability-rounding fixture still passes (it fails if rounding is removed or the sink enters the max) |
| B1 | Error vs. fp32 *lower* than the old path (1.55e-2 vs. 2.10e-2) because relu and weighting accumulate in fp32; tests for fused and fallback paths, 40 two-token sequences, and row counts that are not multiples of 64 |
| C1 | Non-local rows filled with NaN must not reach the output; ≤ 1e-6 vs. the old combine; dequantization bit-exact over all 256 bytes × 256 E8M0 exponents |
| All | End-to-end reference tests (golden tokens, per-position logits, chunked prefill, preemption); 163 → 174 → 178 tests passing |

## Where the 8.4× lives now

| Stage (profiled, ms/step) | Start | After A | After B1 | After C1 | Official |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sparse attention core | 2,254.9 | 98.8 | 98.9 | 99.0 | 14.9 |
| Other attention (incl. key concatenation) | 253 | 254 | 254 | 254 | ~19 |
| Indexer | 460.7 | 460.8 | 76.5 | 79.3 | 7.9 |
| MoE total | 746 | 726 | 701 | 410 | 52.8 |
| HC, normalization and other | 123 | 122 | 122 | 122 | ~10 |
| **Total** | **3,838** | **1,662** | **1,252** | **965** | **110.6** |

| | Start | A | B1 | C1 |
| --- | ---: | ---: | ---: | ---: |
| Input tok/s/GPU | 1,084.8 | 2,571.7 | 3,373.1 | **4,315.9** |
| Share of official | 3.0% | 7.1% | 9.3% | **11.9%** |
| Gap | 33.3× | 14.1× | 10.7× | **8.4×** |

Of the 254 ms of other attention after C1, 182 ms is key concatenation (gather / cat / where) and 72 ms is projections, compression and fake quant. The next three items are already scoped: let the sparse attention kernel read the KV cache by index instead of concatenating keys (A2, about −170 ms expected), decode two FP4 values per byte with vectorized stores (C2, about −80 ms), and run the gate in tf32x3 (C3, about −40 ms). The official engine pays zero for key concatenation because FlashMLA reads by index; at 182 ms, that single structural difference is now the largest item left in mini's step.

## What these numbers do not say

- This is one paired run per stage, not a three-run median, and not the ceiling with every optimization enabled.
- Only prefill is measured. Decode CUDA graphs were off for both engines, and KV budgets were not forced equal.
- mini's optional non-expert weight cache was disabled.
- Tiny-model single-GPU output throughput is a different workload and metric. On that suite the three changes moved goodput by +6%, −1.8% (within run-to-run noise) and +2.1%.

Raw logs, profiles and job plans are in the repository: [benchmark documentation](https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/benchmarks/README.md), and reports [A](https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/perf-reports/A-tensor-core-sparse-attention.md), [B1](https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/perf-reports/B1-fused-index-scores.md) and [C1](https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/perf-reports/C1-moe-combine.md).
