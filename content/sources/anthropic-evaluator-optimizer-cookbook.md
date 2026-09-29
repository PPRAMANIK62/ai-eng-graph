---
id: anthropic-evaluator-optimizer-cookbook
title: Evaluator-Optimizer Workflow (claude-cookbooks notebook)
author: Anthropic
url: https://github.com/anthropics/claude-cookbooks/blob/main/patterns/agents/evaluator_optimizer.ipynb
published: 2025-11-28          # date of the last commit touching the file
accessed: 2026-09-29
kind: code
primary: true
---

## Summary

A notebook implementing the evaluator-optimizer loop: `generate()` writes a solution (with its thinking in `<thoughts>` and the answer in `<response>`), `evaluate()` grades it and returns `PASS`, `NEEDS_IMPROVEMENT` or `FAIL` plus feedback, and `loop()` keeps going until the evaluator says `PASS`, passing all previous attempts and the latest feedback back to the generator. The example task is a stack with O(1) `push`, `pop` and `getMin`, judged on correctness, time complexity and style.

## Key claims

- When it fits, repeating the blog: "Clear evaluation criteria" and "Value from iterative refinement"; good fit when "LLM responses can be demonstrably improved when feedback is provided" and "The LLM can provide meaningful feedback itself". (intro cell)
- The evaluator returns a verdict and feedback: `<evaluation>PASS, NEEDS_IMPROVEMENT, or FAIL</evaluation>` and `<feedback>What needs improvement and why.</feedback>`. (evaluator_prompt)
- The evaluator is told not to solve: "You should be evaluating only and not attemping to solve the task." and "Only output "PASS" if all criteria are met and you have no further suggestions for improvements." (evaluator_prompt)
- Memory of past tries: the generator's context is "Previous attempts:" followed by every earlier result, then the latest "Feedback:". (loop())
- The loop is `while True:` and returns only when `evaluation == "PASS"`. (loop())
- Criteria in the example: "1. code correctness 2. time complexity 3. style and best practices". (evaluator_prompt)

## Visuals worth redrawing

- The loop: generate → evaluate → PASS? → exit, else feed back attempts and feedback.

## My notes

- No cap on iterations. `FAIL` doesn't stop the loop either; only `PASS` does. With a strict evaluator ("no further suggestions") this can run for a long time. A real build needs a max-iterations limit and a plan for what to return when it's hit. Observed from reading the code, not from running it.
- Generator and evaluator are the same model through the same `llm_call` helper: this is the intrinsic self-correction setup that `huang-cannot-self-correct` tested, unless the criteria can be checked against something outside the model.
