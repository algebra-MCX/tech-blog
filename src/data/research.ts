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
