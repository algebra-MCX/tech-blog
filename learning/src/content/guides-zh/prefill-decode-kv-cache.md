---
source: prefill-decode-kv-cache
---
## 跟着前四个输出 token 走一遍

Prefill 处理输入的 2,048 个位置，写入这些位置的注意力 key 和 value，并预测第一个输出 token。为了预测第二个输出，模型把第一个输出 token 喂回去，读取已有 KV，再为这个新位置存下 KV。之后重复这个过程。

| 要预测的输出 | 本步处理的位置数 | 本步结束时缓存的位置数 |
| --- | ---: | ---: |
| 第 1 个 token | 2,048 | 2,048 |
| 第 2 个 token | 1 | 2,049 |
| 第 3 个 token | 1 | 2,050 |
| 第 4 个 token | 1 | 2,051 |

最后采样出来的 token，需要等它被喂回模型才会产生 KV。标准因果注意力仍会访问此前上下文，所以即使每步只新增一个位置，上下文越长也可能读到越多 KV。

## 先预测，再运行

先预测同一个输入生成 8 个 token 时，要处理多少个位置。代码只是计算有无 KV 复用时处理的位置数，省略了注意力计算量、显存带宽、批处理和运行时开销。

```python
prompt = 2048
outputs = 4
with_cache = prompt + outputs - 1
without_cache = sum(prompt + step for step in range(outputs))
print(with_cache, without_cache)  # 2051 8198
```

只把 `outputs` 改成 8，在白板上写出每一步，并解释第一个输出为什么来自 prefill。再想一想：位置计数相同的情况下，滑动窗口注意力会改变哪部分显存读取？

## 看真实运行时怎样安排这条请求

[DeepInfer-Lab 架构说明](https://github.com/algebra-MCX/DeepInfer-Lab/blob/23ccc4dca8bb58fb47803ee061ee0825bacdfe9f/README.md#architecture)把同一个问题放到真实运行时里，介绍排队、分页缓存分配、分块 prefill 和采样。继续读可以弄清连续批处理怎样改变每一步的执行时机。
