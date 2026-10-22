export const domains = [
  { id: 'algorithms', en: 'Algorithms', zh: '算法' },
  { id: 'data', en: 'Data', zh: '数据' },
  { id: 'infra', en: 'Infra', zh: '基础设施' }
] as const;
export const projectSections = [
  { id: 'overview', en: 'Overview', zh: '概览' }, { id: 'start', en: 'Start Here', zh: '从这里开始' },
  { id: 'experiments', en: 'Experiments', zh: '实验' }, { id: 'debugging', en: 'Debugging', zh: '排障' },
  { id: 'design', en: 'Design', zh: '设计与机制' }, { id: 'resources', en: 'Resources', zh: '代码与材料' }
] as const;
export const guideSections = [
  { id: 'concepts', en: 'Concepts', zh: '核心概念', description: 'Build a useful mental model.', descriptionZh: '建立够用、清楚的理解。' },
  { id: 'quickstarts', en: 'Quickstarts', zh: '最简入门', description: 'Run a small example. Change one variable.', descriptionZh: '运行一个小例子，改变一个变量。' },
  { id: 'playbooks', en: 'Playbooks', zh: '实用手册', description: 'A repeatable method for a concrete task.', descriptionZh: '完成具体任务的可重复方法。' },
  { id: 'learning-paths', en: 'Learning Paths', zh: '学习路线', description: 'A sequence from first principles to projects.', descriptionZh: '从基本概念走向真实项目的阅读顺序。' }
] as const;
export const noteSections = [
  { id: 'perspectives', en: 'Perspectives', zh: '技术观点', description: 'A position, its assumptions and its limits.', descriptionZh: '观点、成立条件与适用边界。' },
  { id: 'decisions', en: 'Decisions', zh: '技术取舍', description: 'Choices made under explicit constraints.', descriptionZh: '在明确约束下作出的选择。' },
  { id: 'questions', en: 'Questions', zh: '开放问题', description: 'Questions that still need better evidence.', descriptionZh: '仍需更多证据回答的问题。' }
] as const;
export const noteTopics = [
  { id: 'research', en: 'Research', zh: '科研', description: 'Questions, evidence and the practice of research.', descriptionZh: '研究问题、证据，以及科研过程中的认识。' },
  { id: 'learning', en: 'Learning', zh: '学习', description: 'How understanding is built, tested and revised.', descriptionZh: '理解如何建立、验证与修订。' },
  { id: 'investing', en: 'Investing', zh: '投资', description: 'Personal reflections on value, uncertainty and investment decisions.', descriptionZh: '关于价值、不确定性与投资决策的个人认识。' },
  { id: 'life', en: 'Life', zh: '生活', description: 'Observations about time, choices and everyday life.', descriptionZh: '关于时间、选择与日常生活的观察。' },
  { id: 'personal-finance', en: 'Personal Finance', zh: '理财', description: 'Personal thinking about budgets, saving and financial planning.', descriptionZh: '关于预算、储蓄和财务规划的个人思考。' }
] as const;
export type Assignment = { project?: string; section?: 'experiments' | 'debugging' | 'design'; state: 'outline' | 'perspective'; noteCategory?: 'perspectives' | 'decisions' | 'questions'; noteTopic?: typeof noteTopics[number]['id'] };
export const writingMap: Record<string, Assignment> = {
  'cuda-graph-fallback': { project: 'vllm', section: 'debugging', state: 'outline' },
  'benchmarking-moe': { project: 'moeflow', section: 'experiments', state: 'outline' },
  'gpu-memory-long-context': { project: 'vllm', section: 'experiments', state: 'outline' },
  'communication-overlap': { project: 'vllm', section: 'design', state: 'outline' },
  'grouped-gemm': { project: 'cuda-study', section: 'experiments', state: 'outline' },
  'serving-lessons': { project: 'vllm', section: 'design', state: 'outline' },
  'irregular-moe-execution': { project: 'vllm', section: 'design', state: 'outline' }
};
export const noteMap: Record<string, Assignment> = {
  'nsight-metrics': { project: 'cuda-study', section: 'debugging', state: 'perspective', noteCategory: 'perspectives', noteTopic: 'research' },
  'stream-priorities': { project: 'cuda-study', section: 'design', state: 'perspective', noteCategory: 'perspectives', noteTopic: 'research' },
  'triton-configurations': { project: 'cuda-study', section: 'experiments', state: 'perspective', noteCategory: 'perspectives', noteTopic: 'research' },
  'visualize-expert-load': { project: 'moeflow', section: 'design', state: 'perspective', noteCategory: 'perspectives', noteTopic: 'research' },
  'why-2x64': { project: 'cuda-study', section: 'experiments', state: 'outline' },
  'rank-nccl': { project: 'moeflow', section: 'debugging', state: 'outline' }
};
