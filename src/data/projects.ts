export const projects = [
  {
    id: 'moeflow', title: 'MoEFlow', titleZh: 'MoEFlow',
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
    id: 'vllm', title: 'vLLM', titleZh: 'vLLM', subtitle: 'Inference runtime investigations', subtitleZh: '推理运行时研究',
    summary: 'A reading and research notebook on irregular execution, CUDA Graph policies, memory and communication in LLM serving.', summaryZh: '围绕大模型服务中的不规则执行、CUDA Graph 策略、内存与通信展开的阅读及研究档案。',
    domains: ['algorithms', 'infra'], status: 'active', repository: 'https://github.com/algebra-MCX/vllm',
    scope: 'How workload distributions interact with execution policies and end-to-end serving objectives.', scopeZh: '负载分布如何与执行策略及端到端服务目标相互作用。',
    boundary: 'These articles include working hypotheses and measurement plans. Reproducible measurements are still being attached.', boundaryZh: '这些文章包含工作假设与测量计划，可复现的测量材料仍在补充中。',
    role: 'Research notebook around a personal fork', roleZh: '基于个人 Fork 的研究档案', start: ['useful-work', 'paired-benchmarks'],
    resources: [{ title: 'Code & upstream documentation', titleZh: '代码与上游文档', url: 'https://github.com/algebra-MCX/vllm#readme', section: 'resources' }]
  },
  {
    id: 'cuda-study', title: 'CUDA Study', titleZh: 'CUDA Study', subtitle: 'GPU execution & kernel experiments', subtitleZh: 'GPU 执行与内核实验',
    summary: 'Kernel-level questions about grouped computation, scheduling and useful work under uneven loads.', summaryZh: '从内核层面研究分组计算、调度，以及不均衡负载下的有效工作。',
    domains: ['infra'], status: 'active', repository: 'https://github.com/algebra-MCX/CUDA-study',
    scope: 'Small GPU programming studies and the assumptions behind kernel comparisons.', scopeZh: '小型 GPU 编程研究，以及内核对比背后的假设。',
    boundary: 'The current article is a measurement plan. No kernel speedup is claimed without a recorded run.', boundaryZh: '当前文章是一份测量计划；缺少完整运行记录时，不作内核加速结论。',
    role: 'Study repository and related working notes', roleZh: '学习仓库与相关工作记录', start: ['useful-work', 'paired-benchmarks'],
    resources: [{ title: 'CUDA study repository', titleZh: 'CUDA 学习仓库', url: 'https://github.com/algebra-MCX/CUDA-study', section: 'resources' }]
  }
] as const;
export const projectById = (id?: string) => projects.find(project => project.id === id);
export type Project = typeof projects[number];
