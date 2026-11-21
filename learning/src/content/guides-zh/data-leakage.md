---
source: data-leakage
---
## 要回答的问题

测试集中是否出现训练集已有的文本？本例在去掉首尾空白、执行 Unicode 大小写折叠后检查相等。这是明确选定的一种规则，不是重复数据的通用定义。

## 运行检查

保存为 `overlap.py`，使用 Python 3.8 或更新版本执行 `python3 overlap.py`。示例文本为合成数据，无需下载。

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

## 如何理解结果

输出为 `overlap: [' data QUALITY ']`。在给定规则下，一个测试样本与训练样本重合。保留样本 ID，先检查来源，再决定删除还是重新分组。

## 检查边界

本例不能发现改写、共享来源文档、相关用户或时间泄漏。某些任务中大小写本身也有意义。处理真实数据时，需要定义独立样本的单位、保存划分来源，并检查规范化是否抹去了任务需要的差别。

依次只改变大小写、标点、措辞，观察规则能发现什么，并为你希望支持的行为增加回归样例。
