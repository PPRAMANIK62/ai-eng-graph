---
id: ridnik-alphacodium
title: "Code Generation with AlphaCodium: From Prompt Engineering to Flow Engineering"
author: Tal Ridnik, Dedy Kredo, Itamar Friedman (CodiumAI)
url: https://arxiv.org/abs/2401.08500
published: 2024-01-16
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

Replaces a single well-written prompt for competitive programming with a fixed multi-step flow: reason about the problem and its tests in plain language, generate and rank candidate solutions, write extra tests, then generate code and fix it in a loop by running it against the public tests and the AI-written tests. On CodeContests, GPT-4 pass@5 more than doubled. The flow is fixed by the authors, and the checking step uses real code execution.

## Key claims

- Headline. "GPT-4 accuracy (pass@5) increased from 19% with a single well-designed direct prompt to 44% with the AlphaCodium flow." (Abstract)
- Two phases: "a pre-processing phase where we reason about the problem in natural language, and an iterative code generation phase where we generate, run, and fix a code solution against public and AI-generated tests." (Introduction)
- Flow steps (Figure 1 / section 3): problem reflection, public tests reasoning, generate possible solutions, rank solutions, generate additional AI tests, initial code solution, iterate on public tests, iterate on AI-generated tests.
- Tests are easier than solutions. "generating additional useful tests is easier than generating a correct code solution." (Introduction)
- Iteration uses execution: if code "fails on a specific test, try to fix it, given the error message." (3.2)
- Easy to hard. "the flow relies on knowledge accumulation - trying to progress from easy to hard, gaining knowledge and insight along the way to help with the more difficult stages." (3.3)
- Results table: GPT-3.5 validation 15% → 25%, test 8% → 17%; GPT-4 validation 19% → 44%, test 12% → 29%. (Table 1)
- Cost. "With AlphaCodium flow we perform ∼15-20 LLM calls per solution, so a pass@5 submission involves ∼100 LLM calls." (5.3)
- Compared with AlphaCode it reached better top results "with four orders of magnitude fewer LLM calls" (under the assumption of one call per AlphaCode sample). (Introduction, 5.3)

## Visuals worth redrawing

- Figure 1(a), the flow diagram: pre-processing boxes then the code iteration loop. Good for `llm-workflows` or `evaluator-optimizer`.

## My notes

- GPT-4 era (2024-01). Present as history: it shows the size of gain a fixed flow gave then, not what it gives on 2026 reasoning models.
- The checking step is external (running code), which is exactly the case where self-correction works best (see `huang-cannot-self-correct`).
