# Research portfolio classification

Verified against repository documentation and implementation on 2026-10-22.

`src/data/research.ts` is the shared source of category IDs and canonical technical tags. Projects and Quickstarts expose exactly **All / Systems / Algorithms / Hardware / Agents / Data**. All is the default. Each item has one primary category; tags do not create additional navigation levels. Co-design describes a method and is only a tag.

Classify the contribution presented in this portfolio, rather than every capability of the upstream repository. Algorithms changes the computation or learning method; Systems changes execution, scheduling, communication, kernels or integration; Hardware studies architecture or measured hardware behavior; Agents changes agent architecture/execution; Data changes the data pipeline or its quality. Hardware-aware runtime work can still be Systems.

## Project migration

| Project | Primary | Basis for the classification | Verified sources |
| --- | --- | --- | --- |
| MoEFlow | Systems | Fixed-capacity expert-parallel execution, graph-compatible routing and kernel fusion. Co-design applies to the joint execution/kernel/hardware constraints, not a separate category. | [README](https://github.com/algebra-MCX/MoEFlow/blob/main/README.md), [architecture](https://github.com/algebra-MCX/MoEFlow/blob/main/docs/architecture.md), [measurement report](https://github.com/algebra-MCX/MoEFlow/blob/main/docs/stage1_total_fusion_tables.md) |
| vLLM | Systems | The showcased contribution concerns captured microbatch layouts, DP decode coordination and output ordering. It does not introduce a new model or training algorithm. | [PR #62430](https://github.com/vllm-project/vllm/pull/62430), including patch and validation limitations |
| mini-DeepInfer | Systems | A readable reimplementation of DeepInfer's scheduling, cache-state management and DeepSeek-V4.1 execution, with prefill kernels measured against the official engine; not a novel model architecture. | [README](https://github.com/algebra-MCX/mini-DeepInfer/blob/main/README.md), [runtime design](https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/DEEPINFER_DESIGN.md), [prefill benchmark](https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/benchmarks/README.md) |
| DeepInfer | Systems | The author's NVLink Engram-fetch proposal provides an execution path without NCCL GIN. Co-design describes the hardware-constrained memory/communication path. | [PR #99](https://github.com/deepseek-ai/DeepInfer/pull/99) |
| TraceLab | Systems | The showcased work is a session-aware vLLM replay runner and backend adapter. Classify this execution contribution, rather than assigning the entire agent-trace repository to Agents/Data. | [merged runner PR #1](https://github.com/uw-syfi/TraceLab/pull/1), [adapter PR #11](https://github.com/uw-syfi/TraceLab/pull/11) |
| JittorInfer | Systems | Qwen2.5 model integration: graph builders, tokenizer, tensor loading and Ascend execution paths. Integration is not an original model architecture or accelerator design. | [PR #7 and changed files](https://github.com/Jittor/JittorInfer/pull/7/files), [upstream README on master](https://github.com/Jittor/JittorInfer/blob/master/README.md) |

All six currently qualify as Systems. Empty categories are intentional; do not redistribute work just to populate the navigation. Own projects/contributions remain independently filterable by relationship, and contributor cards distinguish merged work from proposals. Existing `domains` fields are retained for legacy search/guide compatibility; they do not drive portfolio categories.

## Quickstarts

Quickstarts use the same registry and filter component, classified by their main learning objective:

| Entry | Primary | Tags | Boundary |
| --- | --- | --- | --- |
| `expert-load-imbalance` | Algorithms | MoE, Performance Analysis, Python | A load-distribution model, not a GPU performance measurement. It connects to Systems projects without acquiring a second primary category. |
| `data-leakage` | Data | Data Quality, Evaluation, Python | Exact overlap under a declared normalization rule; not a general leakage detector. |

Guide frontmatter requires `primaryCategory` and nonempty canonical `technicalTags` for quickstarts. Other guide types retain their existing schema and routes. Add content to empty categories when there is an actual runnable example; do not create placeholder tutorials.

## Featured evidence

MoEFlow is the featured experimental project because its repository records a specific implementation, paired measurements, correctness gates and explicit limits. It is not represented as a mature production serving backend.

- Report: `docs/stage1_total_fusion_tables.md`, code revision `e88e01ef723b20d87ae0b00059284ab4c2779542`.
- Displayed point: T=1 per rank, EP4, uniform routing, BF16 experts, 4 NVIDIA B200 GPUs.
- Own Torch `bf16_ring` baseline: **249.7 µs**. Fused path: **144.2 µs**. Both values are routed-layer latency, not end-to-end serving throughput or latency.
- Timing covers router logits through the weighted routed-expert output, excluding gate GEMM/shared expert/norm/residual. The report uses paired alternating repetitions and CUDA Graph replays.
- A separate native-vLLM comparison still favored native AG/RS by **1.4–4.7%**. No stable end-to-end serving improvement is established.
- The card links to the verified repository report. The report's referenced raw `paired.json` was not retrievable at the cited revision during this review; do not label the raw artifact independently verified or claim a reproduced benchmark.

Upstream project stars are not author accomplishments. Upstream benchmark tables are not attributed to these contributions. No papers, benchmarks, merges or performance gains were invented.

## Follow-up requiring author evidence

- JittorInfer #7 has no PR description or reproducible validation report. Keep it marked as a proposal; confirm supported configurations/results before adding claims.
- Keep the open vLLM/DeepInfer/JittorInfer proposals distinct from accepted work. New upstream state can be refreshed in the existing contribution records.
- Publish MoEFlow's referenced raw paired-run artifact if independent reproduction should be advertised.
- Additional Algorithms, Hardware, Agents or Data projects need their own contribution evidence before classification; tutorial coverage alone does not establish a research project.

## Maintenance

Project metadata lives in `src/data/projects.ts`. Canonical tags live in `src/data/research.ts`; reuse an existing tag instead of adding a synonym. Adding a primary category is deliberately outside this design. The featured evidence object includes an explicit report, revision, comparison baseline and boundary; update these together when evidence changes.

Category state is shareable via `?category=systems`, secondary direction via `?area=gpu-kernels`, and relationship via `?kind=contributor`. Changing the primary category resets the secondary direction; invalid or mismatched directions fall back to All topics. Invalid values fall back to All. Filtering uses category buttons and a blue glass relationship menu with checked options, keyboard navigation, outside-click dismissal and viewport-aware placement. Live result counts, scoped animations and reduced-motion support remain available. No-JavaScript rendering exposes all content and real links.

## Secondary directions (user-requested navigation update)

The five primary categories are unchanged. Projects and Quickstarts now share the 31 requested secondary directions from `src/data/research.ts`. Only the selected primary category exposes its secondary strip; All shows the full collection. Secondary directions are actual filters, while technical tags remain descriptive. No new topic pages are created. English and Chinese labels refer to the same IDs.

| Item | Secondary directions |
| --- | --- |
| MoEFlow | LLM Serving & Inference; GPU Kernels; Communication & Memory Systems; Performance Engineering |
| vLLM | LLM Serving & Inference; Distributed Training & Inference; Runtime & Scheduling |
| mini-DeepInfer | LLM Serving & Inference; Distributed Training & Inference; Runtime & Scheduling; Communication & Memory Systems; GPU Kernels; Performance Engineering |
| DeepInfer | LLM Serving & Inference; Distributed Training & Inference; Communication & Memory Systems |
| TraceLab | LLM Serving & Inference; Performance Engineering |
| JittorInfer | LLM Serving & Inference |
| Expert-load quickstart | Attention & MoE (Algorithms) |
| Exact-overlap quickstart | Data Quality (Data) |

The mappings follow the implementation and contribution evidence above. Compilers and other empty directions remain available with honest empty states. A project can cover several directions inside its unique primary category. Project metadata and quickstart content validation reject directions outside that parent category.
