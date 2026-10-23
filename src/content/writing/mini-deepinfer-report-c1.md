---
title: "Performance Report C1: MoE Combine Over Local Rows, In-Place Dequantization"
titleZh: "性能分析报告 C1：MoE 只合并本地行，原地反量化"
description: "Combining only the local expert rows and dequantizing in place cuts routed experts from 526 to 252 ms/step and lifts real 4-GPU prefill to 4,316 tok/s/GPU."
descriptionZh: "只合并本地专家的行并原地反量化，路由专家从 526 降到 252 ms/步，真实四卡 prefill 提高到 4,316 tok/s/GPU。"
publishDate: 2026-10-22
tags: [DeepInfer, DeepSeek-V4.1, B200, Triton, MoE, Benchmarking]
readingTime: 9
draft: false
eyebrow: "Performance report"
eyebrowZh: "性能报告"
---
2026-10-22 · code `5f5fb73` (before the change: `32e2b5b`, i.e. B1)

## Conclusion

Real V4.1 4-GPU prefill throughput rises from 3,377 to **4,316 tok/s/GPU (+27.8%)**, and the step time falls from 1,213 ms to 949 ms, matching the roughly 950 ms predicted from the micro-benchmark before the change. The gap to the official engine shrinks from 10.7× to **8.4×**; mini reaches 11.9% of the official engine. MoE drops from 701 ms/step to 410 ms/step, and the expert part from 526 ms to 252 ms. Attention (432 ms) is again the largest item, 182 ms of which is glue that concatenates the keys.

## Setup

Same as reports A and B1: real V4.1-Flash (`dba1be0`), 4 × B200, EP4 / DP4, the shared workload, 10 steady-state steps.

- Throughput: `tools/bench_rev.py run perf/fused-index-scores perf/moe-combine --suite real4`, the two versions interleaved in the same job 9349.
- Profile: job 9351. Within the profile job, the same version measured 4,320.4 tok/s/GPU, 0.1% from job 9349.

## End-to-end results

| Metric | Before (B1) | After (C1) | Official | Change |
| --- | ---: | ---: | ---: | --- |
| Input throughput (tok/s/GPU) | 3,376.7 | **4,315.9** | 36,170.9 | +27.8% |
| Mean step (ms) | 1,213.0 | **949.0** | 113.2 | −21.8% |
| Share of official | 9.3% | **11.9%** | 100% | |
| Gap to official | 10.7× | **8.4×** | — | |

## Per-stage time (profile, ms/step)

| Stage | Start | After B1 | After C1 | Official | Current gap |
| --- | ---: | ---: | ---: | ---: | ---: |
| Sparse attention core | 2,254.9 | 98.9 | 99.0 | 14.9 | 6.6× |
| Attention key concatenation (gather / cat / where) | — | ~180 | 182 | 0 (FlashMLA reads by index) | — |
| Indexer | 460.7 | 76.5 | 79.3 | 7.9 | 10× |
| Other attention (projections, compression, fake quant) | — | ~74 | 72 | ~19 | 3.8× |
| MoE total | 746 | 701 | **410** | 52.8 | 7.8× |
| 　routed experts | 535 | 526 | **252** | 50.1 (mega-MoE) | 5.0× |
| 　gate | 76 | 76 | 76 | 1.2 | 63× |
| 　communication (reduce-scatter + all-gather) | ~113 | ~70 | 53 | 1.5 | 35× |
| HC, normalization and other | 123 | 122 | 122 | ~10 | 12× |
| **Total (step under profile)** | **3,838** | **1,252** | **965** | **110.6** | **8.7×** |

The "other attention 254 ms" of the earlier reports is split this time into 182 ms of key concatenation and 72 ms of projections and the rest.

## Inside the routed experts (ms/step)

| Kernel | Before | After | Note |
| --- | ---: | ---: | --- |
| FP4 dequantization | 128.1 | 132.3 | Reads the E8M0 scale directly; the compute is unchanged |
| Whole-block copy of the dequantized result (Memcpy DtoD) | 85.7 | **0.1** | Dequantization writes straight into the bf16 weight stack |
| bf16 conversion (`.float()` etc.) | 66.0 | **0** | The GEMM output stays bf16 |
| `index_copy_` to restore order | 59.0 | **0** | Replaced by the combine kernel |
| `where` to zero non-local rows | 55.8 | **0** | combine never reads non-local rows |
| Sum over slots | 16.5 | **0** | Folded into combine |
| combine kernel | — | **4.0** | |
| Grouped GEMM | 67.1 | 66.0 | |
| SwiGLU, gather, sort | ~45 | ~47 | |
| **Total** | **526** | **252** | −52% |

- **Why the old version was slow:** `GroupedExperts` lays its output out in sorted [T·k, 5120] rows with T·k = 98,304, and only about 1/4 of them come from this rank's experts. The old code converted the whole block to fp32 (2 GB per layer), zeroed non-local rows with `where`, restored order with `index_copy_` and summed over slots; most of what it moved was zeros.
- **What the combine kernel does:** for each token, in slot order, it reads only the rows of local experts, accumulates in fp32 and writes [T, 5120] once. The summation order is unchanged, so the result is deterministic. The GEMM never writes non-local rows in the first place, so they are never read.
- **Dequantization:** it writes straight into the matching slice of the stack, saving a 6.8 GB bf16 copy per layer. The E8M0 scale is decoded in the kernel, with the two boundary values 0 and 255 handled separately (an fp32 subnormal 2^-127 and NaN, respectively).

Single-layer micro-benchmark (1 × B200, 16,384 tokens, top-6, 96 experts on this rank): 12.93 → 6.24 ms, identical output checksum (5.480333e+04), peak memory 8.7 → 7.7 GiB.

## Accuracy

- The combine's summation order matches the old implementation, and the unit test requires an error ≤ 1e-6 against it.
- Dequantization is bit-exact against the CPU reference: `test_fp4_all_codes_and_scales` walks all 256 byte values and all 256 E8M0 exponents, including signed zero, overflow, underflow and NaN.
- All end-to-end reference tests pass. Full suite: 178 passed.

## Tiny-model goodput (1 GPU, 3 interleaved runs in one job, median)

| Version | Throughput (tok/s) | TTFT p50 (ms) | TPOT p50/p99 (ms) | goodput (req/s) |
| --- | ---: | ---: | --- | ---: |
| B1 (`32e2b5b`) | 7,871 | 221 | 4.2 / 12.8 | 57.2 |
| C1 (`5f5fb73`) | 8,036 (+2.1%) | 238 | 4.1 / 12.5 | 58.4 (+2.1%) |

## Tests

- `test_combine_reads_only_local_rows_in_slot_order`:
  - fills non-local rows with NaN and requires the output to be fully finite and equal to the old implementation;
  - covers T = 1 / 5 / 300, k = 1 / 6 / 4, and a dimension of 1,030 that is not a multiple of 1,024.
- `test_chunked_dequant_writes_the_stack_in_place`: the in-place weight stack is bit-equal to per-expert dequantization.

## Next

Ordered by remaining time (965 ms in total):

| Item | Time (ms) |
| --- | ---: |
| Attention key concatenation | 182 |
| FP4 dequantization | 132 |
| HC, normalization and other | 122 |
| Sparse attention | 99 |
| Indexer | 79 |
| gate | 76 |
| Attention projections etc. | 72 |
| Grouped GEMM | 66 |
| Communication | 53 |

1. **A2:** let the sparse-attention kernel read the KV cache directly by index, removing the key concatenation; about −170 ms expected.
2. **C2:** dequantize two values per byte and write them vectorized; about −80 ms expected.
3. **C3:** run the gate in tf32x3, close to fp32 accuracy; about −40 ms expected.

Raw data: [`profile-2026-10-22/stage-c1/`](https://github.com/algebra-MCX/mini-DeepInfer/tree/main/docs/benchmarks/profile-2026-10-22/stage-c1/).
