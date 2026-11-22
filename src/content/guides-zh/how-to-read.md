---
source: how-to-read
---
这个站点面向熟悉 AI 系统的研究员和工程师。你可以在这里了解我如何分析问题、检查我做过的实现，再判断是否有值得深入交流或合作的方向。

[首页](/)按问题与证据精选代表作，不按发布时间堆文章。建议从与你工作最接近的问题开始。

## 先读一项完整研究

**关注性能分析：**读 [DeepInfer-Lab 的三步 prefill 优化](/writing/mini-deepinfer-prefill/)。从 profile 出发，经过 kernel 改动、正确性检查，再识别新的瓶颈。3.98 倍是相对自身初始实现的提升；在所列配置下，官方参考仍快 8.4 倍。

**关注执行设计的取舍：**读 [MoEFlow 的固定容量实验](/writing/moeflow-fixed-capacity/)。融合改善了自身 Torch Ring 基线，但另一组层级对比中原生 vLLM 仍更快，也未证明稳定的服务级收益。

**关注上游工程能力：**读[已合并的 vLLM DBO 正确性修复](/writing/vllm-dbo-correctness/)。沿着 token 行归属，从失败回归测试看到补丁、模型对照和协作者重构。

## 到结论旁边找证据

每项研究都应说明基线、计时边界、模型、硬件、负载、正确性规则与局限。Prefill 文章的数值组件切换的是已有测量阶段，不是 GPU 仿真，也不是新跑出的基准。

| 工作 | 实现 | 实验或审阅证据 |
| --- | --- | --- |
| DeepInfer-Lab，原 mini-DeepInfer | [源码快照](https://github.com/algebra-MCX/DeepInfer-Lab/tree/23ccc4dca8bb58fb47803ee061ee0825bacdfe9f) | [日志、profile 与作业计划](https://github.com/algebra-MCX/DeepInfer-Lab/tree/23ccc4dca8bb58fb47803ee061ee0825bacdfe9f/docs/benchmarks/profile-2026-10-22) |
| MoEFlow | [源码与独立参考](https://github.com/algebra-MCX/MoEFlow/tree/2f4968ffef7cac4f8dcf39a4a65cec55c60472f8) | [记录的表格与局限](https://github.com/algebra-MCX/MoEFlow/blob/2f4968ffef7cac4f8dcf39a4a65cec55c60472f8/README.md#performance)，当前快照未附原始配对 JSON |
| vLLM | [路由补丁与回归测试](https://github.com/vllm-project/vllm/pull/63372/files) | [审阅、验证与共同作者记录](https://github.com/vllm-project/vllm/pull/63372) |

我检查了这些材料是否可访问，不代表在整理网站时重新运行了其中的 GPU 基准。历史版本标识与不完整的追溯材料仍在报告中说明。

## 分清结果与提案

**已有实验**表示在明确配置下已有测量记录；**已合并工程贡献**表示上游接纳了所链接的改动；**机制分析**解释实现；**工程提案**仍是提出的方案；**研究提纲**只有问题或测量计划，不代表已有实验结论。

[Decode staging 提案](/writing/vllm-decode-staging/)就是一个例子：历史计时与指定 head 的正确性测试来自不同版本，边界也不同，不能合成一个普遍加速结论。[文章归档](/writing/)会标明每篇材料的状态。

## 机制复杂时，沿着一条请求阅读

从[运行时拆解](/writing/mini-deepinfer-runtime/)跟踪请求到达、block 与 state slot 分配、prefill/decode 调度、采样和释放，再用[技术笔记](/writing/mini-deepinfer-technical-notes/)核对模块细节。流程图、具体行布局与测量应当解释同一条执行约定。

## 带着具体问题交流

反例、复现尝试、trace 或不同设计都很适合作为交流起点。请附输入、源码版本、比较规则，以及我们的解释在哪个边界出现分歧。可以通过[个人主页](https://algebra-mcx.github.io/)联系我，或在 [DeepInfer-Lab issue](https://github.com/algebra-MCX/DeepInfer-Lab/issues) 中讨论。

— 马晨熙
