type GuideInfo = { need: string; needZh: string; task: string; taskZh: string; image?: string };

export const guideInfo: Record<string, GuideInfo> = {
  'prefill-decode-kv-cache': {
    need: 'Know that models read and write tokens. Python is optional.',
    needZh: '知道模型读写 token 即可。Python 可选。',
    task: 'Trace one request and count the reused and newly stored positions.',
    taskZh: '沿一条请求数清哪些位置被复用，哪些位置新增到缓存。'
  },
  'expert-load-imbalance': {
    need: 'Addition and averages. Use the browser, or Python 3.8+.',
    needZh: '会求和与平均值即可。浏览器可直接操作，也可用 Python 3.8+。',
    task: 'Predict the busiest expert, move the slider and verify your prediction.',
    taskZh: '先预测最忙专家的负载，再拖动滑块验证。',
    image: '/og-moe.png'
  },
  'useful-work': {
    need: 'Basic arithmetic.',
    needZh: '基础算术。',
    task: 'Compare useful rows with padded rows in a worked example.',
    taskZh: '用具体例子比较有效行与填充行。'
  },
  'paired-benchmarks': {
    need: 'A workload and two implementations to compare.',
    needZh: '准备一组负载与两个可对比的实现。',
    task: 'Write an A/B plan that fixes inputs and defines a correctness gate.',
    taskZh: '写一份固定输入且带正确性检查的 A/B 实验计划。'
  },
  'data-leakage': {
    need: 'Python 3.8+, with no extra dependencies.',
    needZh: 'Python 3.8+，无需第三方依赖。',
    task: 'Change one normalization rule and see which duplicates it finds.',
    taskZh: '改变一条规范化规则，观察能找到哪些重复样本。'
  }
};
