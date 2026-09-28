export const projects = [
  {
    index: '01',
    title: 'Generalizing Real-Token Staging for Imbalanced DBO Workloads',
    titleZh: '面向不均衡 DBO 负载的真实 Token 分阶段执行',
    summary: 'Investigating execution paths for imbalanced mixture-of-experts workloads and CUDA Graph coverage.',
    summaryZh: '研究不均衡混合专家负载的执行路径与 CUDA Graph 覆盖率。',
    tags: ['vLLM', 'DBO', 'CUDA Graph'],
    status: 'Research',
    statusZh: '研究中',
    article: '/writing/cuda-graph-fallback/',
    repository: null,
    details: [
      { label: 'Problem', labelZh: '问题', value: 'Imbalanced MoE execution under dual-batch overlap', valueZh: '双批次重叠下的不均衡 MoE 执行' },
      { label: 'Contribution', labelZh: '贡献', value: 'Analysis and implementation work in progress', valueZh: '分析与实现工作进行中' },
      { label: 'System', labelZh: '系统', value: 'vLLM / CUDA Graph', valueZh: 'vLLM / CUDA Graph' },
      { label: 'Hardware', labelZh: '硬件', value: 'TODO: add verified hardware', valueZh: 'TODO：补充经验证的硬件信息' },
      { label: 'Status', labelZh: '状态', value: 'Unverified research note', valueZh: '尚未验证的研究笔记' }
    ]
  },
  {
    index: '02',
    title: 'Understanding Irregular MoE Execution on Modern GPUs',
    titleZh: '理解现代 GPU 上的不规则 MoE 执行',
    summary: 'A systems-level study of routing, token distribution, and runtime behavior.',
    summaryZh: '从系统层面研究路由、Token 分布与运行时行为。',
    tags: ['MoE', 'GPU', 'Scheduling'],
    status: 'Exploration',
    statusZh: '探索中',
    article: '/writing/irregular-moe-execution/',
    repository: null,
    details: [
      { label: 'Problem', labelZh: '问题', value: 'Irregular work distribution in expert execution', valueZh: '专家执行中的不规则工作分布' },
      { label: 'Contribution', labelZh: '贡献', value: 'Working notes and execution-model analysis', valueZh: '工作笔记与执行模型分析' },
      { label: 'System', labelZh: '系统', value: 'CUDA / serving runtimes', valueZh: 'CUDA / 服务运行时' },
      { label: 'Hardware', labelZh: '硬件', value: 'TODO: add verified hardware', valueZh: 'TODO：补充经验证的硬件信息' },
      { label: 'Status', labelZh: '状态', value: 'Exploration', valueZh: '探索中' }
    ]
  },
  {
    index: '03',
    title: 'Communication Overlap Is Not Free',
    titleZh: '通信重叠并非免费',
    summary: 'Reasoning about when communication overlap shifts rather than removes execution cost.',
    summaryZh: '分析通信重叠何时只是转移、而非消除执行成本。',
    tags: ['Distributed Systems', 'EP'],
    status: 'Analysis',
    statusZh: '分析中',
    article: '/writing/communication-overlap/',
    repository: null,
    details: [
      { label: 'Problem', labelZh: '问题', value: 'Hidden contention in overlapped execution', valueZh: '重叠执行中的隐藏资源争用' },
      { label: 'Contribution', labelZh: '贡献', value: 'Conceptual analysis; measurements pending', valueZh: '概念分析；等待测量验证' },
      { label: 'System', labelZh: '系统', value: 'Expert parallel inference', valueZh: '专家并行推理' },
      { label: 'Hardware', labelZh: '硬件', value: 'TODO: add verified hardware', valueZh: 'TODO：补充经验证的硬件信息' },
      { label: 'Status', labelZh: '状态', value: 'Analysis', valueZh: '分析中' }
    ]
  }
] as const;
