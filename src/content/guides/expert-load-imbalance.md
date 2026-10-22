---
title: "A minimal experiment in expert-load imbalance"
titleZh: "专家负载不均衡的最小实验"
description: "Keep the total assignment count fixed and change only its distribution. Python standard library; no GPU required."
descriptionZh: "固定总分配数，只改变分布。仅需 Python 标准库，无需 GPU。"
publishDate: 2026-10-22
category: quickstarts
domains: [algorithms, infra]
tags: [MoE, Python]
---
## What you will test

Can equal total work have different maximum per-expert loads? This example uses four experts and 64 token–expert assignments. It is a scheduling model, not a GPU benchmark.

## Run the example

Save as `expert_load.py` and run `python3 expert_load.py` with Python 3.8 or later. No packages are required.

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

## Expected output

```text
balanced: total=64, max=16, imbalance=1.0, capacity=64
skewed: total=64, max=40, imbalance=2.5, capacity=160
concentrated: total=64, max=64, imbalance=4.0, capacity=256
```

The total is identical. Maximum load and hypothetical fixed-capacity storage differ. Change the distributions while preserving a total of 64; then try a different number of experts.

## What this does not establish

The model omits communication, kernel efficiency, routing overhead and the actual capacity policy. It predicts no speedup. Use it to formulate the next experiment, then follow the [MoEFlow project](/projects/moeflow/) or the [paired measurement playbook](/guides/paired-benchmarks/).
