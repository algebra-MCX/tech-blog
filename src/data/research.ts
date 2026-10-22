// Navigation describes the primary contribution; tags describe the techniques used.
// Keep these IDs shared by project data, content validation and browser filters.
export const researchCategoryIds = ['systems', 'algorithms', 'hardware', 'agents', 'data'] as const;
export type ResearchCategory = typeof researchCategoryIds[number];
export const researchCategories = [
  { id: 'systems', label: 'Systems' },
  { id: 'algorithms', label: 'Algorithms' },
  { id: 'hardware', label: 'Hardware' },
  { id: 'agents', label: 'Agents' },
  { id: 'data', label: 'Data' }
] as const satisfies readonly { id: ResearchCategory; label: string }[];

export const technicalTagIds = [
  'co-design', 'inference', 'training', 'moe', 'attention', 'gpu-kernels',
  'cuda', 'cuda-graphs', 'triton', 'blackwell', 'distributed-systems', 'runtime',
  'benchmarking', 'performance-analysis', 'reinforcement-learning', 'memory-systems',
  'gpu-interconnects', 'workload-replay', 'model-integration', 'ascend',
  'data-quality', 'data-processing', 'evaluation', 'python'
] as const;
export type TechnicalTag = typeof technicalTagIds[number];
export const technicalTags: Record<TechnicalTag, string> = {
  'co-design': 'Co-design', inference: 'Inference', training: 'Training', moe: 'MoE',
  attention: 'Attention', 'gpu-kernels': 'GPU Kernels', cuda: 'CUDA',
  'cuda-graphs': 'CUDA Graphs', triton: 'Triton', blackwell: 'Blackwell',
  'distributed-systems': 'Distributed Systems', runtime: 'Runtime',
  benchmarking: 'Benchmarking', 'performance-analysis': 'Performance Analysis',
  'reinforcement-learning': 'Reinforcement Learning', 'memory-systems': 'Memory Systems',
  'gpu-interconnects': 'GPU Interconnects', 'workload-replay': 'Workload Replay',
  'model-integration': 'Model Integration', ascend: 'Ascend',
  'data-quality': 'Data Quality', 'data-processing': 'Data Processing',
  evaluation: 'Evaluation', python: 'Python'
};
export const categoryLabel = (id: ResearchCategory) => researchCategories.find(category => category.id === id)!.label;

// Secondary navigation is shared by Projects and Quickstarts; tags stay descriptive.
export const researchAreas = [
  {
    "id": "llm-serving-inference",
    "category": "systems",
    "label": "LLM Serving & Inference",
    "labelZh": "LLM 服务与推理"
  },
  {
    "id": "distributed-training-inference",
    "category": "systems",
    "label": "Distributed Training & Inference",
    "labelZh": "分布式训练与推理"
  },
  {
    "id": "runtime-scheduling",
    "category": "systems",
    "label": "Runtime & Scheduling",
    "labelZh": "运行时与调度"
  },
  {
    "id": "gpu-kernels",
    "category": "systems",
    "label": "GPU Kernels",
    "labelZh": "GPU 内核"
  },
  {
    "id": "compilers",
    "category": "systems",
    "label": "Compilers",
    "labelZh": "编译器"
  },
  {
    "id": "communication-memory-systems",
    "category": "systems",
    "label": "Communication & Memory Systems",
    "labelZh": "通信与内存系统"
  },
  {
    "id": "performance-engineering",
    "category": "systems",
    "label": "Performance Engineering",
    "labelZh": "性能工程"
  },
  {
    "id": "model-architectures",
    "category": "algorithms",
    "label": "Model Architectures",
    "labelZh": "模型架构"
  },
  {
    "id": "attention-moe",
    "category": "algorithms",
    "label": "Attention & MoE",
    "labelZh": "注意力与 MoE"
  },
  {
    "id": "optimization",
    "category": "algorithms",
    "label": "Optimization",
    "labelZh": "优化方法"
  },
  {
    "id": "reinforcement-learning",
    "category": "algorithms",
    "label": "Reinforcement Learning",
    "labelZh": "强化学习"
  },
  {
    "id": "efficient-algorithms",
    "category": "algorithms",
    "label": "Efficient Algorithms",
    "labelZh": "高效算法"
  },
  {
    "id": "hardware-aware-algorithms",
    "category": "algorithms",
    "label": "Hardware-aware Algorithms",
    "labelZh": "硬件感知算法"
  },
  {
    "id": "gpu-architecture",
    "category": "hardware",
    "label": "GPU Architecture",
    "labelZh": "GPU 架构"
  },
  {
    "id": "memory-hierarchy",
    "category": "hardware",
    "label": "Memory Hierarchy",
    "labelZh": "内存层次"
  },
  {
    "id": "gpu-interconnects",
    "category": "hardware",
    "label": "GPU Interconnects",
    "labelZh": "GPU 互连"
  },
  {
    "id": "ai-accelerators",
    "category": "hardware",
    "label": "AI Accelerators",
    "labelZh": "AI 加速器"
  },
  {
    "id": "computer-architecture",
    "category": "hardware",
    "label": "Computer Architecture",
    "labelZh": "计算机体系结构"
  },
  {
    "id": "hardware-characterization",
    "category": "hardware",
    "label": "Hardware Characterization",
    "labelZh": "硬件特性测量"
  },
  {
    "id": "agent-architectures",
    "category": "agents",
    "label": "Agent Architectures",
    "labelZh": "Agent 架构"
  },
  {
    "id": "planning-reasoning",
    "category": "agents",
    "label": "Planning & Reasoning",
    "labelZh": "规划与推理"
  },
  {
    "id": "tool-use",
    "category": "agents",
    "label": "Tool Use",
    "labelZh": "工具调用"
  },
  {
    "id": "agent-runtime",
    "category": "agents",
    "label": "Agent Runtime",
    "labelZh": "Agent 运行时"
  },
  {
    "id": "memory-context-management",
    "category": "agents",
    "label": "Memory & Context Management",
    "labelZh": "记忆与上下文管理"
  },
  {
    "id": "multi-agent-systems",
    "category": "agents",
    "label": "Multi-Agent Systems",
    "labelZh": "多 Agent 系统"
  },
  {
    "id": "data-engineering",
    "category": "data",
    "label": "Data Engineering",
    "labelZh": "数据工程"
  },
  {
    "id": "data-pipelines",
    "category": "data",
    "label": "Data Pipelines",
    "labelZh": "数据流水线"
  },
  {
    "id": "synthetic-data",
    "category": "data",
    "label": "Synthetic Data",
    "labelZh": "合成数据"
  },
  {
    "id": "data-processing",
    "category": "data",
    "label": "Data Processing",
    "labelZh": "数据处理"
  },
  {
    "id": "storage-retrieval",
    "category": "data",
    "label": "Storage & Retrieval",
    "labelZh": "存储与检索"
  },
  {
    "id": "data-quality",
    "category": "data",
    "label": "Data Quality",
    "labelZh": "数据质量"
  }
] as const satisfies readonly { id: string; category: ResearchCategory; label: string; labelZh: string }[];
export type ResearchArea = typeof researchAreas[number]['id'];
export const researchAreaIds: [ResearchArea, ...ResearchArea[]] = [researchAreas[0].id, ...researchAreas.slice(1).map(area => area.id)];
