// Results transcribed from the linked author reports; no GPU rerun is implied.
export const evidenceReviewDate = '2026-11-22';
export const deepinferSnapshot = '23ccc4dca8bb58fb47803ee061ee0825bacdfe9f';
export const moeflowSnapshot = '2f4968ffef7cac4f8dcf39a4a65cec55c60472f8';
export const deepinferSource = `https://github.com/algebra-MCX/DeepInfer-Lab/tree/${deepinferSnapshot}`;
export const moeflowSource = `https://github.com/algebra-MCX/MoEFlow/tree/${moeflowSnapshot}`;
export type EvidenceKind = 'measurement' | 'engineering' | 'proposal' | 'analysis' | 'outline';
export const evidenceLabels: Record<EvidenceKind, { en: string; zh: string }> = {
  measurement: {en:'Measured experiment',zh:'已有实验'},
  engineering: {en:'Merged engineering',zh:'已合并工程贡献'},
  proposal: {en:'Engineering proposal',zh:'工程提案'},
  analysis: {en:'Mechanism analysis',zh:'机制分析'},
  outline: {en:'Research outline',zh:'研究提纲'}
};
export function writingEvidence(id: string): EvidenceKind {
  if (id === 'vllm-dbo-correctness') return 'engineering';
  if (id === 'vllm-decode-staging') return 'proposal';
  if (id.startsWith('mini-deepinfer-report-') || ['mini-deepinfer-prefill','moeflow-fixed-capacity'].includes(id)) return 'measurement';
  if (['mini-deepinfer-runtime','mini-deepinfer-design','mini-deepinfer-technical-notes'].includes(id)) return 'analysis';
  return 'outline';
}
export const prefillStages = [
  {id:'baseline',en:'Baseline',zh:'初始基线',throughput:1084.8,attention:2254.9,indexer:460.7,moe:746,other:376},
  {id:'a',en:'A · Attention',zh:'A · 注意力',throughput:2571.7,attention:98.8,indexer:460.8,moe:726,other:376},
  {id:'b1',en:'B1 · Indexer',zh:'B1 · Indexer',throughput:3373.1,attention:98.9,indexer:76.5,moe:701,other:376},
  {id:'c1',en:'C1 · Combine',zh:'C1 · 合并',throughput:4315.9,attention:99,indexer:79.3,moe:410,other:376}
] as const;
