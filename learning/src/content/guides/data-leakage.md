---
title: "Find exact overlap before trusting an evaluation"
titleZh: "相信评测前，先检查精确重复"
description: "A small train/test overlap check with an explicit normalization rule. Python only."
descriptionZh: "使用明确的规范化规则，检查训练集与测试集重叠。仅需 Python。"
publishDate: 2026-10-22
category: quickstarts
primaryCategory: data
researchAreas: [data-quality]
technicalTags: [data-quality, evaluation, python]
domains: [data]
tags: [Evaluation, Python]
---
## The question

Does the test set contain text already present in training? Here we check equality after stripping outer whitespace and applying Unicode case folding. That rule is a choice, not a universal definition of duplicate data.

## Run the check

Save as `overlap.py` and run `python3 overlap.py` with Python 3.8 or later. The toy strings are synthetic and require no downloads.

```python
def normalize(text):
    return text.strip().casefold()

train = ["GPU scheduling", "Data quality", "Mixture of experts"]
test = [" data QUALITY ", "Unseen example"]
train_keys = {normalize(text) for text in train}
overlap = [text for text in test if normalize(text) in train_keys]
print("overlap:", overlap)
assert overlap == [" data QUALITY "]
```

## Interpret the result

The output is `overlap: [' data QUALITY ']`. One test entry matches training under the declared rule. Preserve sample IDs so you can inspect provenance before deciding whether to remove or regroup examples.

## Check the boundary

This does not detect paraphrases, shared documents, related users or time leakage. Case can also carry meaning in some tasks. For real data, define the unit of independence, keep split provenance, and check that normalization does not erase distinctions your task needs.

Try changing only capitalization, then punctuation, then wording. Observe which changes this rule detects. Add a regression case for each behavior you intend to support.
