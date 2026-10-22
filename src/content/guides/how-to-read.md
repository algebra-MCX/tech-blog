---
title: "How to read this notebook"
titleZh: "如何阅读这个博客"
description: "A project-driven notebook, with a starting point for beginners and separate spaces for evidence and personal thinking."
descriptionZh: "以项目驱动的方式组织内容，为零基础读者安排起点，也让实践证据与个人思考各有位置。"
publishDate: 2026-10-22
category: learning-paths
domains: [algorithms, data, infra]
tags: [Start Here, Reading Path]
---
## Welcome

This blog grows around projects. A concrete question leads to code, an experiment, an unexpected result, a debugging session, and sometimes a different judgment. The project page brings those pieces together so you can follow the work in context.

There are three ways into the content: **Projects** for the work, **Guides** for learning and reusable methods, and **Notes** for personal thinking. You can enter at the level that fits your question.

## If you are starting from zero

Start with a small mental model. Algorithms describe how a computation or learning process works; data supplies the examples and observations; infrastructure makes execution, storage and measurement possible. These domains interact, so articles can belong to more than one.

1. Browse [Concepts](/guides/sections/concepts/) to understand one mechanism and its limits.
2. Open [Quickstarts](/guides/sections/quickstarts/). Each small example states what you need, how to run it and what you should observe. The first examples use Python without additional packages or a GPU.
3. Change one variable and predict the result before running again. If you have not set up Python yet, begin by reading the example and comparing its inputs with the expected output.
4. Continue with a [Playbook](/guides/sections/playbooks/) or a [Learning Path](/guides/sections/learning-paths/) when you want a repeatable method or a longer sequence.

A starting example is [checking train/test overlap](/guides/data-leakage/). It asks one concrete question, has a short program and explains exactly what its rule misses.

## Follow a project when you want depth

Choose a project from [Projects](/projects/), then use its sections:

- **Overview** explains the question, scope, current evidence and limits.
- **Start Here** links the prerequisites and small starting examples.
- **Experiments** tests hypotheses through baselines and controlled comparisons.
- **Debugging** follows a specific symptom through evidence toward a cause.
- **Design** explains mechanisms, constraints and choices.
- **Resources** points to the repository and original materials.

Sections appear when they have content. A repository link identifies the code context; the project description explains the scope of the notebook. Follow the recorded version and environment when attempting a reproduction.

## If you have a specific problem

Use [Search](/search/) in English or Chinese, or start with the [debugging map](/guides/sections/playbooks/#debugging-map). Search can narrow results by project, content type and technical domain.

Read the scope before applying a conclusion. A result from one workload, timing boundary or version needs additional evidence before it can answer a broader question.

## Read Notes for the thinking

[Notes](/notes/) collects personal perspectives across [Research](/notes/topics/research/), [Learning](/notes/topics/learning/), [Investing](/notes/topics/investing/), [Life](/notes/topics/life/) and [Personal Finance](/notes/topics/personal-finance/).

Topics tell you what a note concerns. Its type tells you what it is doing: a **Perspective** develops a position, a **Decision** explains a choice, and a **Question** leaves an issue open. Investment notes concern views on allocating capital and uncertainty; personal-finance notes concern everyday money management and planning. Categories will fill as notes are written.

When a project informs a perspective, follow its related-project link back to the implementation or evidence. A personal reflection can remain provisional and change with experience.

## Notice the state of the evidence

Some older articles are marked **Working outline**. They preserve a hypothesis or measurement plan; they are not finished experimental reports. Missing configurations and results are identified in the article rather than replaced with an invented conclusion.

For a technical result, look for the input, comparison rule, environment, measurement boundary and original artifact. For a personal judgment, look for its assumptions and the conditions under which it might change.

## Make this your route

You do not need to read chronologically. Begin with a problem, a small example or a question that matters to you. Use the project to keep context, the guides to fill gaps, and the notes to examine the choices behind the work.
