import contributions from './github-contributions.json';
export interface Project {
  id: string; title: string; titleZh: string; kind: 'own' | 'contributor';
  subtitle: string; subtitleZh: string; summary: string; summaryZh: string;
  domains: string[]; status: string; repository: string; starRepository?: string;
  scope: string; scopeZh: string; boundary: string; boundaryZh: string;
  role: string; roleZh: string; start: string[];
  resources: { title: string; titleZh: string; url: string; section: string }[];
}
export const projects: readonly Project[] = [
  {
    id: 'moeflow', title: 'MoEFlow', titleZh: 'MoEFlow', kind: 'own',
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
    summary: 'A reading and research notebook on irregular execution, CUDA Graph policies, memory and communication in LLM serving.', summaryZh: '围绕大模型服务中的不规则执行、CUDA Graph 策略、内存与通信展开的阅读及研究档案。',
    domains: ['algorithms', 'infra'], status: 'active', repository: 'https://github.com/vllm-project/vllm',
    scope: 'How workload distributions interact with execution policies and end-to-end serving objectives.', scopeZh: '负载分布如何与执行策略及端到端服务目标相互作用。',
    boundary: 'These articles include working hypotheses and measurement plans. Reproducible measurements are still being attached.', boundaryZh: '这些文章包含工作假设与测量计划，可复现的测量材料仍在补充中。',
    role: 'Pull request author; current proposals are under review', roleZh: 'PR 作者，当前提案正在审阅中', start: ['useful-work', 'paired-benchmarks'],
    resources: [{ title: 'Upstream code & documentation', titleZh: '上游代码与文档', url: 'https://github.com/vllm-project/vllm#readme', section: 'resources' }, { title: 'Personal development fork', titleZh: '个人开发 Fork', url: 'https://github.com/algebra-MCX/vllm', section: 'resources' }]
  },
  {
    id: 'cuda-study', title: 'CUDA Study', titleZh: 'CUDA Study', kind: 'own', subtitle: 'GPU execution & kernel experiments', subtitleZh: 'GPU 执行与内核实验',
    summary: 'Kernel-level questions about grouped computation, scheduling and useful work under uneven loads.', summaryZh: '从内核层面研究分组计算、调度，以及不均衡负载下的有效工作。',
    domains: ['infra'], status: 'active', repository: 'https://github.com/algebra-MCX/CUDA-study',
    scope: 'Small GPU programming studies and the assumptions behind kernel comparisons.', scopeZh: '小型 GPU 编程研究，以及内核对比背后的假设。',
    boundary: 'The current article is a measurement plan. No kernel speedup is claimed without a recorded run.', boundaryZh: '当前文章是一份测量计划；缺少完整运行记录时，不作内核加速结论。',
    role: 'Study repository and related working notes', roleZh: '学习仓库与相关工作记录', start: ['useful-work', 'paired-benchmarks'],
    resources: [{ title: 'CUDA study repository', titleZh: 'CUDA 学习仓库', url: 'https://github.com/algebra-MCX/CUDA-study', section: 'resources' }]
  },
  {
    id: 'mini-deepinfer', title: 'mini-DeepInfer', titleZh: 'mini-DeepInfer', kind: 'own',
    subtitle: 'A readable inference engine', subtitleZh: '可阅读的推理引擎',
    summary: 'A minimal re-implementation for studying the core design of an inference engine.', summaryZh: '通过最小重实现，学习推理引擎的核心设计。',
    domains: ['algorithms', 'infra'], status: 'active', repository: 'https://github.com/algebra-MCX/mini-DeepInfer',
    scope: 'Request scheduling, model execution and cache management in a compact inference engine.', scopeZh: '在精简的推理引擎中理解请求调度、模型执行与缓存管理。',
    boundary: 'This is a learning implementation. The repository is the source for supported features and recorded results.', boundaryZh: '这是学习型实现，支持范围与实验结果以仓库记录为准。',
    role: 'Personal learning implementation', roleZh: '个人学习实现', start: ['useful-work', 'paired-benchmarks'],
    resources: [{ title: 'Implementation & README', titleZh: '实现与说明', url: 'https://github.com/algebra-MCX/mini-DeepInfer#readme', section: 'resources' }]
  },
  {
    id: 'deepinfer', title: 'DeepInfer', titleZh: 'DeepInfer', kind: 'contributor',
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
    subtitle: 'Model support on Ascend', subtitleZh: '昇腾平台模型支持',
    summary: 'An upstream model-support proposal for the JittorInfer inference framework.', summaryZh: '面向 JittorInfer 推理框架的上游模型支持提案。',
    domains: ['algorithms', 'infra'], status: 'active', repository: 'https://github.com/Jittor/JittorInfer',
    scope: 'The Qwen2.5 feature proposal and its upstream review record.', scopeZh: 'Qwen2.5 功能提案及其上游审阅记录。',
    boundary: 'The PR is open. Supported configurations and validation are defined by the upstream discussion.', boundaryZh: 'PR 仍为开放状态，支持的配置与验证范围以上游讨论为准。',
    role: 'Pull request author', roleZh: 'PR 作者', start: ['useful-work', 'paired-benchmarks'],
    resources: [{ title: 'Upstream repository', titleZh: '上游仓库', url: 'https://github.com/Jittor/JittorInfer#readme', section: 'resources' }]
  }
];
export const projectById = (id?: string) => projects.find(project => project.id === id);
export const repositoryName = (project: Project) => project.starRepository ?? new URL(project.repository).pathname.slice(1);
export const projectContributions = (project: Project) => contributions.filter(pr => pr.repository === repositoryName(project));
