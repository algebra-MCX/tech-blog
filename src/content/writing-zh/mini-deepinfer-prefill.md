---
source: mini-deepinfer-prefill
---
## 测量方式

[mini-DeepInfer](/writing/mini-deepinfer-runtime/) 在单机 4 × B200 上运行真实的 DeepSeek-V4.1-Flash。prefill 基准沿用 DeepInfer 测自己的口径：请求数、热身和测量窗口、指标定义都与官方 `run_sweep.sh prefill` 一致，两个引擎使用同一个 workload 文件。

| 项 | 配置 |
| --- | --- |
| 模型 | 真实 DeepSeek-V4.1-Flash，revision `dba1be0` |
| 硬件 / 拓扑 | 单机 4 × B200，EP4 / DP4 / CP1 |
| 上下文 | 131,072 token，其中 126,976 已缓存 |
| 每步工作量 | 每 rank 4,096 个非缓存输入 token |
| 统计窗口 | rank 0 上 10 个完整稳态步，另抓 2 步 torch profile |
| 双方条件 | full replay、真实路由、无冗余专家、无投机解码、无 decode CUDA Graph |
| 对照 | 官方 DeepInfer + 单节点 NVLink 适配 |

只测 prefill，KV 显存预算未强制相等。除非另有说明，下文每个数字都是单轮配对结果。

## 起点

第一次通过验证的真实模型运行达到 **1,084.8 输入 tok/s/GPU**，官方为 **36,170.9**：只有官方的 3.0%，差距 33.3 倍。单步 profile（ms/步，rank 0）显示差距并不均匀：

| 环节 | mini | 官方 | 差距 |
| --- | ---: | ---: | ---: |
| 稀疏注意力核心 | 2,254.9 | 14.9 | 151× |
| Indexer | 460.7 | 7.9 | 58× |
| MoE（gate + 专家 + 通信） | 746 | 52.8 | 14× |
| 注意力其余（投影、压缩、gather、伪量化） | 253 | 约 19 | 13× |
| HC、归一化及其他 | 123 | 约 10 | 12× |
| **合计（profile 下的步长）** | **3,838** | **110.6** | **35×** |

一个 kernel 占了每步的 59%。做法是：去掉最大的一项，重新 profile，再重复；每次改动后都确认其他环节没有变化。

## A：稀疏注意力改用 tensor core

一个 query 的 64 个 head 共享同一组 640 个 key。旧 Triton kernel 每个 (query, head) 一个 program，用 `tl.sum` 在 CUDA core 上归约，同一组 key 被读了 64 × 2 次。新 kernel 把 32 个 head 拼成 `tl.dot` 的 M 维，走 tensor core，每个 head 块只读一遍 key 做 QK、再读一遍做 PV。

| 形状 (T, H, K, D) | 旧 (ms) | 新 (ms) | 加速 | 新 TFLOP/s |
| --- | ---: | ---: | ---: | ---: |
| 256, 64, 640, 512（真实压缩层） | 3.672 | 0.166 | 22.1× | 129 |
| 256, 64, 128, 512（真实无压缩层） | 0.686 | 0.069 | 9.9× | 62 |
| 256, 4, 640, 512（tiny 模型） | 0.284 | 0.105 | 2.7× | 13 |

每步稀疏注意力从 2,254.9 ms 降到 **98.8 ms**，其他环节都在测量误差以内。端到端：**2,571.7 tok/s/GPU（2.37 倍）**，差距 14.1 倍。

它仍只有 B200 稠密 bf16 峰值的约 6%。M = 32 让 tensor core tile 偏小（64 个 head 时 fp32 累加器 `[64, 512]` 会溢出寄存器）；两遍算法要多写读一次 scores scratch；kernel 外还有约 180 ms 的 gather 和拷贝，用来把 key 拼成 `[T, 640, 512]`。

## B1：融合 indexer 打分

indexer 打分本身是一次 bf16 GEMM，但旧实现把 `[512, 32, n]` 的结果写回显存，再分三遍逐元素做 relu、乘权重、按 head 求和。一个 ratio-1 层要搬运约 4 × 34 GB，占 indexer 耗时的约 80%。

融合 kernel 对一个 `[64 query × 128 条目]` 的 tile 只加载一次 key，32 个 head 依次 `tl.dot`、relu、乘权重，在寄存器里累加，最后只写一次 `[T, n]` 的 bf16 分数。

| 形状 | 旧：分块 einsum (ms) | 新：融合 (ms) | 加速 | TFLOP/s | top-512 重合率（新 / 旧） |
| --- | ---: | ---: | ---: | ---: | --- |
| T = 4,096, n = 65,536（ratio-2 层） | 30.81 | 2.52 | 12.2× | 874 | 0.9965 / 0.9957 |
| T = 4,096, n = 131,072（ratio-1 层） | 61.76 | 5.08 | 12.2× | 866 | 0.9934 / 0.9935 |

约 870 TFLOP/s，达到稠密 bf16 峰值的 39%。第一版按序列逐个启动 kernel；tiny 模型的一个 prefill batch 有几十条短序列，Triton 在 CPU 侧的启动开销让 tiny 吞吐下降了 9.5%。最终版用设备端的 `token_seq` 一次启动整个 batch，行块只属于一条序列时走快速路径，并且没有引入任何主机同步。

indexer 从 460.8 降到 **76.5 ms/步**，峰值显存降低 3.1 GiB。端到端：**3,373.1 tok/s/GPU（+31%）**，差距 10.7 倍。打分上剩下的 5.5 倍来自官方的 FP8 Q × FP4 K kernel，以及第 24–36 层只对候选块打分。

## C1：MoE 只合并本地行

B1 之后，MoE 占每步的 56%。`GroupedExperts` 的输出按排序后的 `[T·k, 5120]` 行排列，T·k = 98,304，其中只有约 1/4 来自本 rank 的专家。旧代码把整块转成 fp32（每层 2 GB），用 `where` 把非本地行置零，再 `index_copy_` 还原顺序、按 slot 求和——大部分搬运的是零。

| 路由专家 kernel（ms/步） | 改动前 | 改动后 |
| --- | ---: | ---: |
| 反量化结果整块拷贝（Memcpy DtoD） | 85.7 | **0.1** |
| bf16 转换（`.float()` 等） | 66.0 | **0** |
| `index_copy_` 还原排序 | 59.0 | **0** |
| `where` 置零非本地行 | 55.8 | **0** |
| 按 slot 求和 | 16.5 | **0** |
| 新 combine kernel | — | **4.0** |
| FP4 反量化 | 128.1 | 132.3 |
| grouped GEMM | 67.1 | 66.0 |
| SwiGLU、gather、排序 | 约 45 | 约 47 |
| **合计** | **526** | **252** |

combine kernel 对每个 token 按 slot 顺序只读本地专家的那几行，在 fp32 里累加，一次写出 `[T, 5120]`。求和顺序与旧实现一致，结果是确定的。反量化现在直接写进 bf16 权重栈中对应的切片，省掉每层 6.8 GB 的拷贝；E8M0 scale 在 kernel 内解码，两个边界值单独处理（0 → fp32 次正规数 2⁻¹²⁷，255 → NaN）。

MoE 从 701 降到 **410 ms/步**。端到端：**4,315.9 tok/s/GPU（+27.8%）**。改动前微基准预测每步约 950 ms，实测 949.0 ms。

## 正确性门槛

没有任何改动只凭速度被接受：

| 改动 | 门槛 |
| --- | --- |
| A | 与 fp32 CPU 参考的最大误差 ≤ 4.9e-4，与旧 kernel 同一量级；bf16 概率舍入回归 fixture 仍然通过（去掉舍入或把 sink 算进最大值都会让它失败） |
| B1 | relu 与加权在 fp32 中累加，与 fp32 参考的误差反而*更小*（1.55e-2 vs 2.10e-2）；测试覆盖融合与回退路径、40 条 2-token 序列、行数不是 64 倍数的情况 |
| C1 | 非本地行填成 NaN 也不能影响输出；与旧 combine 误差 ≤ 1e-6；反量化在全部 256 种字节 × 256 种 E8M0 指数上逐位一致 |
| 全部 | 端到端参考测试（golden token、逐位置 logits、chunked prefill、抢占）；通过数 163 → 174 → 178 |

## 剩下的 8.4 倍在哪里

| 环节（profile，ms/步） | 起点 | A 之后 | B1 之后 | C1 之后 | 官方 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 稀疏注意力核心 | 2,254.9 | 98.8 | 98.9 | 99.0 | 14.9 |
| 注意力其余（含 key 拼接） | 253 | 254 | 254 | 254 | 约 19 |
| Indexer | 460.7 | 460.8 | 76.5 | 79.3 | 7.9 |
| MoE 合计 | 746 | 726 | 701 | 410 | 52.8 |
| HC、归一化及其他 | 123 | 122 | 122 | 122 | 约 10 |
| **合计** | **3,838** | **1,662** | **1,252** | **965** | **110.6** |

| | 起点 | A | B1 | C1 |
| --- | ---: | ---: | ---: | ---: |
| 输入 tok/s/GPU | 1,084.8 | 2,571.7 | 3,373.1 | **4,315.9** |
| 占官方 | 3.0% | 7.1% | 9.3% | **11.9%** |
| 差距 | 33.3× | 14.1× | 10.7× | **8.4×** |

C1 之后"注意力其余"的 254 ms 中，182 ms 是 key 拼接（gather / cat / where），72 ms 是投影、压缩和伪量化。接下来的三项已经确定范围：稀疏注意力 kernel 按索引直接读 KV cache、省掉 key 拼接（A2，预计 −170 ms）；反量化按字节一次解两个 FP4 值并向量化写出（C2，预计 −80 ms）；gate 改用 tf32x3（C3，预计 −40 ms）。官方在 key 拼接上的开销为零，因为 FlashMLA 按索引读取；这一处结构差异，182 ms，现在是 mini 每步里剩下的最大单项。

## 这些数字不能说明什么

- 每个阶段都是单轮配对结果，不是三轮中位数，也不是全部优化开启后的上限。
- 只测了 prefill。两边都没有开 decode CUDA Graph，KV 预算也未强制相等。
- mini 的可选非专家权重缓存未开启。
- tiny 模型的单卡输出吞吐是另一种负载和指标。在那组测试上，三项改动对 goodput 的影响分别是 +6%、−1.8%（在运行间波动范围内）和 +2.1%。

原始日志、profile 和作业配置都在仓库中：[benchmark 文档](https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/benchmarks/README.md)，以及报告 [A](https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/perf-reports/A-tensor-core-sparse-attention.md)、[B1](https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/perf-reports/B1-fused-index-scores.md)、[C1](https://github.com/algebra-MCX/mini-DeepInfer/blob/main/docs/perf-reports/C1-moe-combine.md)。
