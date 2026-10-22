---
title: "How to read this blog"
titleZh: "如何阅读这个博客"
description: "Project-driven learning: a short path in, a working mental model, and the ability to explore independently."
descriptionZh: "以项目驱动学习：尽快入门，建立可运行的心智模型，具备独立探索的能力。"
publishDate: 2026-10-22
category: learning-paths
domains: [algorithms, data, infra]
tags: [Start Here, Project-driven Learning]
---
**Knowledge keeps growing. What is truly scarce is a learning path that is short and clear without sacrificing depth.**

The LLM field moves fast. Infrastructure, model algorithms, GPU architecture, agents and data bring new papers and frameworks almost every day. You set out to learn inference, discover a new attention mechanism the next day, and then find another kernel library for Blackwell. Good resources are abundant, yet it is easy to study for a long time without knowing what you have actually mastered or what to do next. More troublingly, some people hand the most important thinking over to a coding agent.

Zhang Yiming has spoken about understanding as a core competitive advantage—something others must ultimately find valuable. Depth of understanding does not come from collecting more technologies. It comes from knowing which problems matter most in a field and developing your own thinking about them. That is why I started this blog.

## 01. Get started as quickly as possible

Getting started should be fast, but the foundations must hold. I believe the first pass should take no more than a week: a short, concentrated effort with one test of understanding—can you reconstruct the core principles from a blank whiteboard?

For LLM infrastructure, for example, you do not need to spend two months learning all of PyTorch first. Learn the necessary concepts—tensors, autograd and GPU execution—then build a minimal inference program. Return to the principles when a concrete problem exposes a gap. Foundations should help you solve problems rather than become a barrier to starting.

This is the method behind the whole blog: **project-driven learning**.

## 02. One short entry path for each field

I plan to build a concise route into each major field, paired with a small project:

- **Systems**: start with a minimal inference engine to understand runtime, scheduling, GPU kernels and distributed execution.
- **Algorithms**: use mathematical intuition and minimal implementations to understand why model architectures work.
- **Hardware**: begin with GPU execution and memory models to build intuition for hardware–software co-design.
- **Agents**: start with a minimal tool-calling loop to understand planning, memory and state.
- **Data**: build a runnable data pipeline to understand the central problems in data systems.

You do not need to begin with tens of thousands of lines of framework source. Build the essential mechanism first.

## 03. What counts as being ready to explore?

I do not measure understanding by the number of articles read or hours spent studying. For each field, I will provide three things: **a minimal implementation, a few key experiments, and a set of practical checks**—modify the implementation, explain what happens and analyze the bottlenecks.

After working through a minimal inference engine, for example, you should be able to do more than run it. You should understand how requests are scheduled, how the KV cache is managed, where bottlenecks might arise, and how to test your judgment experimentally. That is what I mean by being ready to explore. It does not mean mastery; it means having a working mental model and the ability to keep going independently.

**The goal of an introduction is not to learn everything. It is to become capable of continuing on your own.**

## 04. Connect the parts to the whole

Understanding one kernel, attention mechanism or runtime in isolation is not enough. Why does a model architecture change the design of an inference system? Why does a GPU's memory hierarchy affect algorithm choices? Why do some methods that theoretically reduce computation turn out to be slower in practice? No single field offers a complete answer.

Once the individual routes are more complete, I plan to write a cross-field overview connecting all five. It will be an expandable map rather than a checklist to memorize, accompanied by **Nano Projects**: minimal versions of larger systems.

The aim is to see the forest and still be able to take each tree apart yourself.

## 05. Open code and experiments

I will gradually open-source the small projects, core experiments and practical checks on GitHub so that others can run, modify, question and reproduce them. For each experiment, I will try to record the version, environment, measurement method, comparison conditions and known limitations. Failed experiments, mistaken hypotheses and debugging records deserve a place too. Unverified conclusions will be marked explicitly; conjectures will remain conjectures.

## 06. Perhaps we can research together

If the opportunity arises, I would like to organize small study groups around these projects: reading papers, reproducing experiments and discussing designs. An impressive background is not required. What matters is a willingness to build, think carefully and let experimental results test your views. This is still an idea; I hope it can gradually take shape.

## Where to begin

- **New to a field**: start with [Quickstarts](/guides/sections/quickstarts/), then work through a first Nano Project and its core experiments as the routes develop.
- **Already have the foundations**: go straight to [Projects](/projects/), source code and performance analysis. There is no need to read everything in order.
- **Interested in my judgment**: read [Notes](/notes/) for why I choose a direction, abandon an approach or interpret an experimental result.

Find a question you truly care about and follow it deeper. Spend less time preparing without direction, and more time building and thinking.

— Chenxi Ma
