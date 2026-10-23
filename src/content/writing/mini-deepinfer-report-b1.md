---
title: "Performance Report B1: A Fused Indexer Score"
titleZh: "性能分析报告 B1：融合 indexer 打分"
description: "A single fused kernel replaces the chunked einsum for indexer scoring: 12.2× faster per layer, +31% real 4-GPU prefill throughput, 3.1 GiB less peak memory."
descriptionZh: "用一个融合 kernel 取代分块 einsum 做 indexer 打分：单层快 12.2 倍，真实四卡 prefill 吞吐 +31%，峰值显存降低 3.1 GiB。"
publishDate: 2026-10-22
tags: [DeepInfer, DeepSeek-V4.1, B200, Triton, Indexer, Benchmarking]
readingTime: 8
draft: false
eyebrow: "Performance report"
eyebrowZh: "性能报告"
---
2026-10-22 · code `1868b01` (before the change: `f759f32`, i.e. stage A)

## Conclusion

Real V4.1 4-GPU prefill throughput rises from 2,572 to **3,373 tok/s/GPU (+31%)**, and the step time falls from 1,593 ms to 1,214 ms. The gap to the official engine shrinks from 14.1× to **10.7×**; mini reaches 9.3% of the official engine. The indexer drops from 461 ms/step to 76.5 ms/step (6.0×), and peak memory falls by 3.1 GiB. MoE (701 ms) is now 56% of each step and the only big item left.

## Setup

Same as report A: real DeepSeek-V4.1-Flash (`dba1be0`), 1 node 4 × B200, EP4 / DP4, the shared workload (131,072 context, 126,976 cached, 4,096 new tokens per step per rank), timing over 10 steady-state steps.

- Final version: measured with `tools/bench_rev.py run perf/fused-index-scores --suite real4` (job 9342).
- Profile: taken from the first version (per-sequence launches, job 9334). Its end-to-end throughput differs from the final version by 0.1% (3,375.9 vs 3,373.1).

## End-to-end results

| Metric | Before (A) | After (B1) | Official | Change |
| --- | ---: | ---: | ---: | --- |
| Input throughput (tok/s/GPU) | 2,571.7 | **3,373.1** | 36,170.9 | +31.2% |
| Mean step (ms) | 1,592.7 | **1,214.3** | 113.2 | −23.8% |
| Share of official | 7.1% | **9.3%** | 100% | |
| Gap to official | 14.1× | **10.7×** | — | |
| Peak memory (GiB) | 147.6 | 144.5 | — | −3.1 (the [512, 32, n] intermediate is no longer materialized) |

## Per-stage time (profile, ms/step)

| Stage | Start | After A | After B1 | Official | Current gap |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sparse attention core | 2,254.9 | 98.8 | 98.9 | 14.9 | 6.6× |
| Indexer | 460.7 | 460.8 | **76.5** | 7.9 | 9.7× |
| 　of which scoring | ~400 | ~400 | **28.0** | 5.1 (`mqa_logits` + `sparse_mqa_logits`) | 5.5× |
| 　of which top-k, mask, candidate blocks | ~60 | ~60 | 48.5 | 2.8 | 17× |
| Other attention | 253 | 254 | 254 | ~19 | 13× |
| MoE (gate + experts + communication) | 746 | 726 | 701 | 52.8 | 13× |
| HC, normalization and other | 123 | 122 | 122 | ~10 | 12× |
| **Total** | **3,838** | **1,662** | **1,252** | **110.6** | **11.3×** |

## Kernel analysis

| Shape | Old: chunked einsum (ms) | New: fused (ms) | Speedup | TFLOP/s | Max error vs. fp32 reference (new / old) | Top-512 overlap (new / old) |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| T=4,096, n=65,536 (ratio-2 layer) | 30.81 | 2.52 | 12.2× | 874 | 1.49e-2 / 1.73e-2 | 0.9965 / 0.9957 |
| T=4,096, n=131,072 (ratio-1 layer) | 61.76 | 5.08 | 12.2× | 866 | 1.55e-2 / 2.10e-2 | 0.9934 / 0.9935 |

- **Why the old one was slow:** scoring itself is one bf16 GEMM, but the old path wrote the [512, 32, n] result back to memory, then ran relu, the weight multiply and the per-head sum as separate passes. In one ratio-1 layer those three elementwise passes move about 4 × 34 GB, about 80% of the indexer's time.
- **What the new kernel does:** one [64 query × 128 entry] tile loads its keys once; the 32 heads run `tl.dot`, relu and the weight multiply in turn, accumulating in registers, and a single [T, n] bf16 score is written at the end. The kernel reaches about 870 TFLOP/s, 39% of B200's dense bf16 peak, already close to the compute limit.
- **Why a single launch:** the first version launched one kernel per sequence. A tiny-model prefill batch has dozens of short sequences, and Triton's CPU-side launch overhead cut throughput by 9.5%. The final version launches the whole batch once using the device-side `token_seq`, computing row blocks that span sequences sequence by sequence. A row block that belongs to one sequence takes a fast path; on real shapes it is only 4% slower than the per-sequence version (5.08 vs 4.87 ms/layer) and introduces no host synchronization.
- **The remaining 5.5× vs. official:** the official kernels use FP8 Q × FP4 K (`fp8_fp4_mqa_logits`) and, in layers 24–36, score only the candidate blocks (`sparse_mqa_logits`). The second point is B2.

## Accuracy

- The new kernel accumulates relu and the weighted sum in fp32 and rounds to bf16 once at the end; the old path had a bf16 intermediate at every step. So the new kernel's error against the fp32 reference is actually smaller (1.55e-2 vs 2.10e-2, with a maximum score around 4.8), and top-512 overlap is on par.
- All end-to-end reference tests pass (golden tokens, per-position logits along the reference trajectory, chunked prefill, preemption). Full suite: 174 passed.

## Tiny-model goodput (1 GPU, `tools/bench_rev.py --suite tiny`, 3 interleaved runs in one job, median)

| Version | Throughput (tok/s) | TTFT p50 (ms) | TPOT p50/p99 (ms) | goodput (req/s) |
| --- | ---: | ---: | --- | ---: |
| A (`f759f32`) | 7,604 | 240 | 4.3 / 13.7 | 55.3 |
| B1 (`1868b01`) | 7,469 (−1.8%) | 237 | 4.3 / 13.1 | 54.3 |

The tiny model's context is at most 1,280 tokens, so scoring was never its bottleneck. The −1.8% is within the run-to-run spread of 3 runs: version A itself measured 7,420 and 7,604 in two jobs. The per-sequence-launch first version measured 6,718 on tiny (−9.5%); that regression is fixed by the single launch.

## Tests

`tests/test_indexer.py`:

- Runs the fused path and the chunked fallback path.
- New "short-40": 40 sequences of 2 tokens, so a 64-row block spans up to 33 sequences.
- New real head shape (32 × 128): row counts that are not multiples of 64, entry counts of 1, 129 and 1,000.

## Next

Ordered by remaining time: MoE 701 ms, other attention 254 ms, sparse attention 99 ms, indexer 76.5 ms.

1. **C:** run MoE grouped GEMM directly on FP4 weights. Today dequantization takes 128 ms, bf16 conversion and copies about 300 ms, grouped GEMM 67 ms and communication 70 ms. The target is around 120 ms, for about 6,000 tok/s/GPU (17%).
2. **B2:** scoring inside candidate blocks, a faster top-k and mask, saving about 50 ms more.

Raw data: [`profile-2026-10-22/stage-b1/`](https://github.com/algebra-MCX/mini-DeepInfer/tree/main/docs/benchmarks/profile-2026-10-22/stage-b1/).
