export const projects = [
  {
    index: '01',
    title: 'Generalizing Real-Token Staging for Imbalanced DBO Workloads',
    summary: 'Investigating execution paths for imbalanced mixture-of-experts workloads and CUDA Graph coverage.',
    tags: ['vLLM', 'DBO', 'CUDA Graph'],
    status: 'Research',
    article: '/writing/cuda-graph-fallback/',
    repository: null,
    details: {
      Problem: 'Imbalanced MoE execution under dual-batch overlap',
      Contribution: 'Analysis and implementation work in progress',
      System: 'vLLM / CUDA Graph',
      Hardware: 'TODO: add verified hardware',
      Status: 'Unverified research note'
    }
  },
  {
    index: '02',
    title: 'Understanding Irregular MoE Execution on Modern GPUs',
    summary: 'A systems-level study of routing, token distribution, and runtime behavior.',
    tags: ['MoE', 'GPU', 'Scheduling'],
    status: 'Exploration',
    article: '/writing/irregular-moe-execution/',
    repository: null,
    details: {
      Problem: 'Irregular work distribution in expert execution',
      Contribution: 'Working notes and execution-model analysis',
      System: 'CUDA / serving runtimes',
      Hardware: 'TODO: add verified hardware',
      Status: 'Exploration'
    }
  },
  {
    index: '03',
    title: 'Communication Overlap Is Not Free',
    summary: 'Reasoning about when communication overlap shifts rather than removes execution cost.',
    tags: ['Distributed Systems', 'EP'],
    status: 'Analysis',
    article: '/writing/communication-overlap/',
    repository: null,
    details: {
      Problem: 'Hidden contention in overlapped execution',
      Contribution: 'Conceptual analysis; measurements pending',
      System: 'Expert parallel inference',
      Hardware: 'TODO: add verified hardware',
      Status: 'Analysis'
    }
  }
] as const;
