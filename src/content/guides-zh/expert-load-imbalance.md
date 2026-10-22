---
source: expert-load-imbalance
---
## 要验证什么

总工作量相同，单个专家的最大负载是否也相同？本例使用四个专家与 64 次 Token–专家分配。这是调度模型，不是 GPU 性能测试。

## 运行示例

保存为 `expert_load.py`，使用 Python 3.8 或更新版本执行 `python3 expert_load.py`。无需安装依赖。

```python
cases = {
    "balanced": [16, 16, 16, 16],
    "skewed": [40, 8, 8, 8],
    "concentrated": [64, 0, 0, 0],
}
for name, loads in cases.items():
    total = sum(loads)
    mean = total / len(loads)
    imbalance = max(loads) / mean if mean else 0
    capacity = max(loads) * len(loads)
    print(f"{name}: total={total}, max={max(loads)}, "
          f"imbalance={imbalance:.1f}, capacity={capacity}")
```

## 预期输出

```text
balanced: total=64, max=16, imbalance=1.0, capacity=64
skewed: total=64, max=40, imbalance=2.5, capacity=160
concentrated: total=64, max=64, imbalance=4.0, capacity=256
```

总数一致，最大负载和假想的固定容量存储却不同。保持总数为 64，尝试改变分布，再改变专家数量。

## 这个模型的边界

它没有包含通信、内核效率、路由开销与真实容量策略，不能用于预测加速比。可以据此提出下一项实验，再进入 [MoEFlow 项目](/projects/moeflow/)或[配对测量手册](/guides/paired-benchmarks/)。
