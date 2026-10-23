---
title: "A DeepInfer-Style Runtime Design"
titleZh: "DeepInfer 风格的运行时设计"
description: "The engineering boundaries, state invariants and verification rules mini-DeepInfer commits to, written before the implementation."
descriptionZh: "mini-DeepInfer 要坚持的工程边界、状态不变量和验证方法，先于代码实现写成。"
publishDate: 2026-10-20
tags: [DeepInfer, Runtime, Scheduling, Design]
readingTime: 12
draft: false
eyebrow: "Runtime design"
eyebrowZh: "运行时设计"
---
This document was written before the code. It records the engineering boundaries, state invariants and verification methods mini-DeepInfer holds to. The goal is not to copy DeepInfer's production code, but to keep its most instructive technical taste: separate scheduling, memory, device execution and correctness evidence, so every performance optimization maps back to a state transition that can be inspected.

DeepInfer's public description lists optimized kernels, parallelism, DSpark, asynchronous scheduling, batch invariance, deterministic sampling and structured output as core capabilities, and its scheduler source treats `SchedulerOutputs`, prefill/decode, the block manager and the asynchronous step as separate boundaries:

- [DeepInfer README](https://github.com/deepseek-ai/DeepInfer)
- [Official `scheduler.hpp`](https://github.com/deepseek-ai/DeepInfer/blob/main/csrc/engine/scheduler.hpp)
- [Official `block_manager.hpp`](https://github.com/deepseek-ai/DeepInfer/blob/main/csrc/engine/block_manager.hpp)
- [Official asynchronous scheduling notes](https://github.com/deepseek-ai/DeepInfer/blob/main/doc/inference_deployment_qa.md#asynchronous-scheduling-zero-overhead-batch-scheduler)

## 1. Define the runtime's promises first

mini-DeepInfer is a readable, PyTorch-first implementation that supports a single GPU and intra-node EP × DP. It must satisfy four observable promises:

1. **Every step has an explicit input and output.** The scheduler output describes the token counts, sequence order, block tables and rows to sample for this iteration; device execution never changes CPU queues behind its back.
2. **Resource lifetimes can be proven.** KV blocks and V4.1 state slots each have exactly one owner; preemption, completion and cancellation release both.
3. **Recomputation is equivalent.** Sampling randomness depends only on the sequence seed and the token position, never on the batch row or the history of a global RNG.
4. **Performance paths come with regression evidence.** Use the smallest test that exposes the state difference first, then change the implementation; a performance number must record hardware, checkpoint, batch, context, dtype and warm-up.

These four matter more than porting every production feature. EP, CP, custom kernels and multi-node communication can be swapped in later, but they must not break these boundaries.

## 2. Mapping the official design onto this project

| Official DeepInfer concept | mini-DeepInfer implementation | Current boundary |
| --- | --- | --- |
| C++ `Scheduler` / `SchedulerOutputs` | `Scheduler` / `SchedulerOutput` in `engine/scheduler.py` | Single process, no DP-group voting |
| `BlockManager` free list and reference counts | `engine/block_manager.py` | Single GPU, no cross-rank sharing |
| Iteration-level prefill/decode | `Scheduler._schedule_prefill()` / `_schedule_decode()` | The two q lengths are never mixed |
| Zero-overhead scheduling | `StepHandle` and `remap` in `worker/model_runner.py` | The forward pass has no host synchronization; results are collected in `StepHandle.wait()` |
| Grouped expert GEMM | `GroupedExperts` in `models/deepseek_v41/model.py` | FP4 is dequantized to bf16 on demand, then three `torch._grouped_mm` calls; not a native FP4 GEMM |
| Decode CUDA Graph | `DecodeGraphRunner` in `worker/cuda_graph.py` | Bucketed by batch/context; padding uses reserved slot/block 0; prefill, logits and sampling stay eager |
| Deterministic sampling | `mix_seed()` + Gumbel-max in `layers/sampler.py` | Covers token sampling only |
| V4.1 attention state | Block + state slot in `models/deepseek_v41/model.py` | Each rank manages its own paged cache |
| Structured output / DSpark | Reserved in `SamplingParams` and the execution boundary | Grammar compilation and draft verification are not implemented |

The mapping table is a maintenance constraint. A new feature must first say which boundary it belongs to: scheduling policy does not belong in the model forward, and the model must not touch the waiting/running queues directly.

## 3. The data contract of a step

One engine iteration runs in this order:

```text
schedule(N)
  -> SchedulerOutput(prompt/decode, seqs, seqlens_q, sample_seqs, reservations)
execute(N)
  -> ModelRunner builds the batch on the GPU stream, runs the model, samples
process(N-1)
  -> wait for the previous StepHandle, commit tokens, handle stop/length/abort, release state
```

With ZOS enabled, `process(N-1)` can overlap `execute(N)`. "Overlap" here describes a dependency relationship; it does not mean every Python operator is already synchronization-free. Anything that must read a GPU result has to be concentrated in `StepHandle.wait()`.

### 3.1 The scheduler output must be a complete snapshot

`SchedulerOutput` must at least answer:

- Is this round prefill or decode?
- How many query tokens does each sequence in the batch take?
- Which sequences are sampled, and which epoch does a sampled result belong to?
- Which sequences are ignored, finished, preempted or cancelled?

`ModelRunner` only consumes this snapshot and never re-derives scheduling policy. That lets scheduling be tested on CPU alone, and lets a fake executor replay the entire lifecycle.

### 3.2 CPU view and GPU view

Under ZOS a sequence has two lengths:

```text
CPU-known tokens:        len(token_ids)
GPU-reserved tokens:     get_len() = len(token_ids) + num_inflight_tokens
Written/reserved KV:     num_cached_tokens
```

Decode is legal only when `num_cached_tokens == get_len() - 1`. The scheduler adds a reservation when it schedules and appends the real token only when the result returns; a stale result whose `epoch` is no longer valid must be discarded and can never be written back to the sequence.

## 4. V4.1 state layout

V4.1's cache is not one traditional KV table; it is two kinds of state with different lifetimes:

1. **Paged compressed state:** compressed KV and indexer keys are written per compressed entry into 128-token blocks. A block table addresses them in batches.
2. **Per-sequence state:** the sliding-window ring and the compressor tail each take one state slot per sequence. It must move, be preempted and be released together with the sequence.

So a sequence's resources must be released in pairs:

```python
block_manager.free(seq.block_table)
state_manager.free([seq.state_slot])
```

Releasing only the blocks makes the scheduler see free KV while the next request leaks a state slot.

## 5. Scheduling policy

### Prefill

- The waiting queue stays FCFS.
- If the prompt at the head cannot fit, stop trying instead of skipping it, which would cause unpredictable starvation.
- `max_num_batched_tokens` limits only the q tokens of this round; chunked prefill lets one prompt span several steps.
- Only the last chunk of a prompt produces a sampling reservation.
- Before it first enters running, the blocks for the whole prompt and one state slot are allocated together.

### Decode

- Each running sequence advances one token at a time.
- Candidate order is decided by output length first.
- When blocks run out, the sequence with the longest output is released and put back at the head of the waiting queue.
- Preemption increments the epoch, so stale GPU results cannot contaminate the recomputation.
- After EOS, `max_tokens` or `max_model_len`, resources are released at the point where the result is committed.

### Cancellation

Cancellation is an explicit terminal state. It cannot masquerade as EOS and it is not just deleting an object from a queue. The safe order is:

1. Let any `StepHandle` still on the GPU finish.
2. Let the scheduler invalidate the request's epoch.
3. Remove it from waiting/running.
4. Release both the blocks and the state slot.
5. Return the `abort` finish reason.

This way a cancellation cannot reuse a block while the GPU is still reading the old one.

## 6. Sampling and replayability

The official documentation treats deterministic sampling and batch invariance as separate capabilities. mini-DeepInfer implements a teaching-grade equivalent with these constraints:

```text
sample_seed = mix_seed(sequence_seed, output_position)
token = GumbelMax(logits / temperature, sample_seed)
```

Sampling must not use the batch row as the random seed, and top-k/top-p selection must not depend on other rows. Verification must cover:

- A single-row batch equals a multi-row batch.
- Forward order equals reversed order.
- Token sequences are identical after preemption and recomputation.
- Cancelling one request does not change other requests' results.

## 7. Implementation order, driven by evidence

Later code advances in this order, each step as an independently reviewable commit:

1. **A complete request lifecycle:** request id, cancellation, finish reason, resource snapshots and CPU regression tests.
2. **Observable scheduling cost:** record prefill/decode tokens, preemption count and block/slot watermarks, keeping metrics separate from scheduler output.
3. **Sampling boundary extension:** a stop-token set and an optional logits mask, staying batch-invariant.
4. **Device execution optimization (implemented):** remove host-visible branches from forward and use grouped GEMM and decode CUDA Graph; next, evaluate weight dequantization, logits and sampling overhead.
5. **Advanced paths:** DSpark draft/verify, SWA bounded replay, structured output and end-to-end verification on the real checkpoint.

Steps 4 and 5 may not be declared "done" without a benchmark and a reference comparison. If an optimization changes the cache layout or the scheduler contract, update this document's mapping table and invariants first.

The tiny-checkpoint verification of step 4 is in PRs [#13](https://github.com/algebra-MCX/mini-DeepInfer/pull/13), [#14](https://github.com/algebra-MCX/mini-DeepInfer/pull/14), [#15](https://github.com/algebra-MCX/mini-DeepInfer/pull/15) and [#16](https://github.com/algebra-MCX/mini-DeepInfer/pull/16): regression tests for empty experts, EP sharding, compression-group boundaries and graph padding, and a comparison against the official reference logits (`LOGIT_ATOL=0.05`). Tiny offline output throughput on 1 × B200 rose from 478 to 2,643 tok/s (median of 3 runs); that does not mean the real-checkpoint multi-GPU prefill numbers were updated. The workload, TTFT, TPOT, goodput and capture overhead are as recorded in each PR's experiment notes.

## 8. Verification gate

Every change must at least pass:

```bash
pytest tests/test_block_manager.py tests/test_scheduler.py
pytest
git diff --check
```

When CUDA and the official reference are available, also run `tests/test_sampler.py`, `tests/test_v41.py` and the end-to-end preemption matrix. Without the matching hardware, report skipped/unverified; never write it up as passed.

## 9. What is explicitly not promised

- A single-GPU PyTorch implementation is not official multi-GPU throughput.
- A random-weight checkpoint verifies execution semantics, not model capability.
- Without a grammar compiler, "structured output" cannot be written as supported.
- Without a draft model and acceptance traces, DSpark cannot be written as supported.
- Every benchmark must state hardware, model, batch, length, dtype and warm-up.

This document describes the skeleton of the implementation. The code can get faster step by step, but these boundaries must stay readable, testable and replayable.
