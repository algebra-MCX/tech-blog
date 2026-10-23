import contributions from './github-contributions.json';
import { researchAreas, type ResearchCategory, type ResearchArea, type TechnicalTag } from './research';
export interface Project {
  id: string; title: string; titleZh: string; kind: 'own' | 'contributor';
  primaryCategory: ResearchCategory; researchAreas: ResearchArea[]; technicalTags: TechnicalTag[];
  researchContribution: string; researchContributionZh: string;
  subtitle: string; subtitleZh: string; summary: string; summaryZh: string;
  domains: string[]; status: string; repository: string; starRepository?: string;
  scope: string; scopeZh: string; boundary: string; boundaryZh: string;
  role: string; roleZh: string; start: string[];
  resources: { title: string; titleZh: string; url: string; section: string }[];
}
export const projects: readonly Project[] = [
  {
    id: 'moeflow', title: 'MoEFlow', titleZh: 'MoEFlow', kind: 'own',
    primaryCategory: 'systems', researchAreas: ["llm-serving-inference", "gpu-kernels", "communication-memory-systems", "performance-engineering"], technicalTags: ['co-design', 'moe', 'gpu-kernels', 'cuda-graphs', 'blackwell'],
    researchContribution: 'A fixed-capacity MoE execution path that combines expert-parallel communication and fused kernels under CUDA Graph constraints.',
    researchContributionZh: '在 CUDA Graph 约束下，联合设计专家并行通信与融合内核的固定容量 MoE 执行路径。',
    subtitle: 'Expert parallelism, routing & kernels', subtitleZh: '专家并行、路由与内核',
    summary: 'An experimental MoE backend: follow the design, paired measurements, correctness gates and debugging records.',
    summaryZh: '实验性 MoE 执行后端：沿着设计、配对测量、正确性检查与排障记录深入项目。',
    domains: ['algorithms', 'infra'], status: 'active', repository: 'https://github.com/algebra-MCX/MoEFlow',
    scope: 'Routed MoE execution, CUDA Graph compatibility and the boundary between layer gains and serving performance.', scopeZh: '路由 MoE 执行、CUDA Graph 兼容性，以及层级收益与端到端服务性能之间的边界。',
    boundary: 'Layer-level and full-model evidence are tracked separately. Stable serving speedup remains an open question in the repository reports.', boundaryZh: '层级实验与完整模型证据分别记录。仓库报告中，服务层面的稳定加速仍是开放问题。',
    role: 'Experimental implementation and research notebook', roleZh: '实验实现与研究档案', start: ['expert-load-imbalance', 'paired-benchmarks'],
    resources: [
      { title: 'Project overview & current limits', titleZh: '项目概览与当前边界', url: 'https://github.com/algebra-MCX/MoEFlow#readme', section: 'overview' },
      { title: 'Paired baselines & validation', titleZh: '配对基线与验证方法', url: 'https://github.com/algebra-MCX/MoEFlow/blob/development/docs/validation.md', section: 'experiments' },
      { title: 'End-to-end order controls', titleZh: '端到端测量顺序控制', url: 'https://github.com/algebra-MCX/MoEFlow/blob/development/docs/e2e_w1_order_control.md', section: 'experiments' },
      { title: 'Pitfalls & investigations', titleZh: '踩坑与排障记录', url: 'https://github.com/algebra-MCX/MoEFlow/blob/development/docs/pitfalls.md', section: 'debugging' },
      { title: 'Architecture & execution contract', titleZh: '架构与执行约定', url: 'https://github.com/algebra-MCX/MoEFlow/blob/main/docs/architecture.md', section: 'design' }
    ]
  },
  {
    id: 'vllm', title: 'vLLM', titleZh: 'vLLM', kind: 'contributor', subtitle: 'Inference runtime contributions', subtitleZh: '推理运行时贡献',
    primaryCategory: 'systems', researchAreas: ["llm-serving-inference", "distributed-training-inference", "runtime-scheduling"], technicalTags: ['runtime', 'cuda-graphs', 'distributed-systems', 'moe'],
    researchContribution: 'Proposed runtime changes to keep imbalanced data-parallel decode compatible with captured microbatches and logical output ordering.',
    researchContributionZh: '提出运行时修改，使不均衡的数据并行解码兼容已捕获的微批布局，并保持逻辑输出顺序。',
    summary: 'A reading and research notebook on irregular execution, CUDA Graph policies, memory and communication in LLM serving.', summaryZh: '围绕大模型服务中的不规则执行、CUDA Graph 策略、内存与通信展开的阅读及研究档案。',
    domains: ['algorithms', 'infra'], status: 'active', repository: 'https://github.com/vllm-project/vllm',
    scope: 'How workload distributions interact with execution policies and end-to-end serving objectives.', scopeZh: '负载分布如何与执行策略及端到端服务目标相互作用。',
    boundary: 'These articles include working hypotheses and measurement plans. Reproducible measurements are still being attached.', boundaryZh: '这些文章包含工作假设与测量计划，可复现的测量材料仍在补充中。',
    role: 'Pull request author; current proposals are under review', roleZh: 'PR 作者，当前提案正在审阅中', start: ['useful-work', 'paired-benchmarks'],
    resources: [{ title: 'Upstream code & documentation', titleZh: '上游代码与文档', url: 'https://github.com/vllm-project/vllm#readme', section: 'resources' }, { title: 'Personal development fork', titleZh: '个人开发 Fork', url: 'https://github.com/algebra-MCX/vllm', section: 'resources' }]
  },
  {
    id: 'mini-deepinfer', title: 'mini-DeepInfer', titleZh: 'mini-DeepInfer', kind: 'own',
    primaryCategory: 'systems', researchAreas: ["llm-serving-inference", "runtime-scheduling", "communication-memory-systems", "distributed-training-inference", "gpu-kernels", "performance-engineering"], technicalTags: ['inference', 'runtime', 'attention', 'moe', 'triton', 'blackwell'],
    researchContribution: 'A readable PyTorch runtime serves the real DeepSeek-V4.1-Flash on 4 × B200 and matches the official reference within 0.05 logits across every scheduling mode.',
    researchContributionZh: '用可读的 PyTorch 运行时在 4 × B200 上服务真实 DeepSeek-V4.1-Flash，在所有调度模式下与官方参考实现的 logits 差距小于 0.05。',
    subtitle: 'A readable DeepSeek-V4.1 runtime', subtitleZh: '可阅读的 DeepSeek-V4.1 运行时',
    summary: 'DeepInfer\'s engine design in about 2,000 lines of PyTorch: follow a request from the queue to its next sampled token.', summaryZh: '用约 2,000 行 PyTorch 读懂 DeepInfer 的引擎设计：从请求入队一路跟到下一个采样 token。',
    domains: ['algorithms', 'infra'], status: 'active', repository: 'https://github.com/algebra-MCX/mini-DeepInfer',
    scope: 'Paged KV blocks and state slots, prefill/decode scheduling with preemption, zero-overhead scheduling, deterministic sampling, EP × DP, and paired prefill measurements against official DeepInfer.', scopeZh: '分页 KV block 与 state slot、带抢占的 prefill/decode 调度、零开销调度、确定性采样、EP × DP，以及与官方 DeepInfer 的配对 prefill 测量。',
    boundary: 'A learning implementation, not a faster DeepInfer. Real-model prefill reaches 11.9% of the official engine in one paired run on 4 × B200; decode CUDA graphs were off for both and KV budgets were not forced equal.', boundaryZh: '这是学习型实现，不是更快的 DeepInfer。4 × B200 单轮配对测量中，真实模型 prefill 达到官方的 11.9%；两边均未开启 decode CUDA Graph，KV 预算也未强制相等。',
    role: 'Personal learning implementation', roleZh: '个人学习实现', start: ['useful-work', 'paired-benchmarks'],
    resources: [
      { title: 'Project overview & quick start', titleZh: '项目概览与快速开始', url: 'https://github.com/algebra-MCX/mini-DeepInfer#readme', section: 'overview' },
      { title: 'Runtime design: boundaries & invariants', titleZh: '运行时设计：边界与不变量', url: 'https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/DEEPINFER_DESIGN.md', section: 'design' },
      { title: 'Technical notes on the current code', titleZh: '对应当前代码的技术说明', url: 'https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/TECHNICAL.md', section: 'design' },
      { title: 'Prefill benchmark: 4 × B200 vs. official', titleZh: 'Prefill 基准：4 × B200 对比官方', url: 'https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/benchmarks/README.md', section: 'experiments' },
      { title: 'Report A: sparse attention on tensor cores', titleZh: '报告 A：稀疏注意力改用 tensor core', url: 'https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/perf-reports/A-tensor-core-sparse-attention.md', section: 'experiments' },
      { title: 'Report B1: fused indexer scoring', titleZh: '报告 B1：融合 indexer 打分', url: 'https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/perf-reports/B1-fused-index-scores.md', section: 'experiments' },
      { title: 'Report C1: MoE combine over local rows', titleZh: '报告 C1：MoE 只合并本地行', url: 'https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/perf-reports/C1-moe-combine.md', section: 'experiments' }
    ]
  },
  {
    id: 'deepinfer', title: 'DeepInfer', titleZh: 'DeepInfer', kind: 'contributor',
    primaryCategory: 'systems', researchAreas: ["llm-serving-inference", "communication-memory-systems", "distributed-training-inference"], technicalTags: ['co-design', 'inference', 'memory-systems', 'gpu-interconnects'],
    researchContribution: 'An opt-in NVLink Engram-fetch proposal enables a single-node execution path when NCCL GIN is unavailable.',
    researchContributionZh: '提出可选的 NVLink Engram 读取方案，为无法使用 NCCL GIN 的节点提供单节点执行路径。',
    subtitle: 'Single-node Engram execution', subtitleZh: '单节点 Engram 执行',
    summary: 'An upstream proposal for an NVLink Engram fetch path on nodes without NCCL GIN.', summaryZh: '为不具备 NCCL GIN 的节点提交 NVLink Engram 读取路径提案。',
    domains: ['infra'], status: 'active', repository: 'https://github.com/deepseek-ai/DeepInfer',
    scope: 'An opt-in single-node execution path, with its tests, tradeoffs and open correctness questions recorded in the PR.', scopeZh: '可选的单节点执行路径，测试、取舍与待验证问题均记录在 PR 中。',
    boundary: 'The upstream PR is open. A performance improvement or merge is not implied.', boundaryZh: '上游 PR 仍在审阅中，不代表已合并，也不作性能提升结论。',
    role: 'Pull request author', roleZh: 'PR 作者', start: ['useful-work', 'paired-benchmarks'],
    resources: [{ title: 'Upstream repository', titleZh: '上游仓库', url: 'https://github.com/deepseek-ai/DeepInfer#readme', section: 'resources' }]
  },
  {
    id: 'tracelab', title: 'TraceLab', titleZh: 'TraceLab', kind: 'contributor',
    primaryCategory: 'systems', researchAreas: ["llm-serving-inference", "performance-engineering"], technicalTags: ['workload-replay', 'inference', 'benchmarking', 'runtime'],
    researchContribution: 'A merged session-aware vLLM runner replays workload traces while preserving request order, arrival times and tool waits.',
    researchContributionZh: '已合并的会话级 vLLM 执行器，在重放负载轨迹时保留请求顺序、到达时间与工具等待。',
    subtitle: 'Workload runners & backend adapters', subtitleZh: '负载执行与后端适配',
    summary: 'Contributions to a session-aware vLLM workload runner and an SGLang backend adapter.', summaryZh: '参与支持会话的 vLLM 负载执行器与 SGLang 后端适配。',
    domains: ['data', 'infra'], status: 'active', repository: 'https://github.com/uw-syfi/TraceLab',
    scope: 'Connecting workload traces to inference backends, with upstream PRs as the implementation record.', scopeZh: '将负载轨迹连接到推理后端，具体实现以关联的上游 PR 为准。',
    boundary: 'The session-aware vLLM runner was merged. The SGLang adapter is a separate proposal under review.', boundaryZh: '支持会话的 vLLM 执行器已合并；SGLang 适配器是独立的审阅中提案。',
    role: 'Open-source contributor', roleZh: '开源贡献者', start: ['useful-work', 'paired-benchmarks'],
    resources: [{ title: 'Upstream repository', titleZh: '上游仓库', url: 'https://github.com/uw-syfi/TraceLab#readme', section: 'resources' }]
  },
  {
    id: 'jittorinfer', title: 'JittorInfer', titleZh: 'JittorInfer', kind: 'contributor',
    primaryCategory: 'systems', researchAreas: ["llm-serving-inference"], technicalTags: ['inference', 'model-integration', 'ascend', 'runtime'],
    researchContribution: 'A Qwen2.5 integration proposal adds model-graph, tokenizer and execution-path support to the Ascend inference framework.',
    researchContributionZh: '通过 Qwen2.5 集成提案，为昇腾推理框架补充模型计算图、分词器与执行路径支持。',
    subtitle: 'Model support on Ascend', subtitleZh: '昇腾平台模型支持',
    summary: 'An upstream model-support proposal for the JittorInfer inference framework.', summaryZh: '面向 JittorInfer 推理框架的上游模型支持提案。',
    domains: ['algorithms', 'infra'], status: 'active', repository: 'https://github.com/Jittor/JittorInfer',
    scope: 'The Qwen2.5 feature proposal and its upstream review record.', scopeZh: 'Qwen2.5 功能提案及其上游审阅记录。',
    boundary: 'The PR is open. Supported configurations and validation are defined by the upstream discussion.', boundaryZh: 'PR 仍为开放状态，支持的配置与验证范围以上游讨论为准。',
    role: 'Pull request author', roleZh: 'PR 作者', start: ['useful-work', 'paired-benchmarks'],
    resources: [{ title: 'Upstream repository', titleZh: '上游仓库', url: 'https://github.com/Jittor/JittorInfer#readme', section: 'resources' }]
  }
];
for (const project of projects) {
  if (!project.researchAreas.length || project.researchAreas.some(id => researchAreas.find(area => area.id === id)?.category !== project.primaryCategory)) {
    throw new Error(`Invalid secondary research areas for ${project.id}`);
  }
}
export const projectById = (id?: string) => projects.find(project => project.id === id);
export const repositoryName = (project: Project) => project.starRepository ?? new URL(project.repository).pathname.slice(1);
export const projectContributions = (project: Project) => contributions.filter(pr => pr.repository === repositoryName(project));

// Repository-recorded layer comparison, not an end-to-end or upstream speedup.
export const featuredResearch = {
  projectId: 'moeflow', baselineUs: 249.7, fusedUs: 144.2,
  context: '4 × B200 · EP4 · BF16 · 1 token/rank',
  report: 'https://github.com/algebra-MCX/MoEFlow/blob/main/docs/stage1_total_fusion_tables.md',
  sourceCommit: 'e88e01ef723b20d87ae0b00059284ab4c2779542',
  boundary: 'Internal layer comparison against its own Torch ring baseline. In a separate comparison, native vLLM AG/RS remained 1.4–4.7% faster. Stable end-to-end serving gains are unproven.',
  boundaryZh: '内部层级对比，基线为项目自身的 Torch ring 实现。另一组对比中，原生 vLLM AG/RS 仍快 1.4–4.7%；尚未证明稳定的端到端服务收益。'
} as const;
