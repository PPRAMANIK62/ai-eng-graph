---
id: shankar-who-validates-validators
title: "Who Validates the Validators? Aligning LLM-Assisted Evaluation of LLM Outputs with Human Preferences"
author: Shreya Shankar, J.D. Zamfirescu-Pereira, Björn Hartmann, Aditya G. Parameswaran, Ian Arawjo
url: https://arxiv.org/abs/2404.12272
published: 2024-04-18
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

A research paper on EvalGen, a tool that helps people write evaluation criteria and turn them into code checks or LLM grader prompts, then pick the ones that match the person's own grades. Its lasting finding is "criteria drift": in a study with 9 expert users, people changed their criteria as they graded outputs, adding new ones and reinterpreting old ones. So you can't fully write down what "good" means before you look at outputs. I read the abstract page and the HTML version (sections 1, 7.3.1, 8.1 and the conclusion).

## Key claims

- LLM graders need checking too: "LLM-generated evaluators simply inherit all the problems of the LLMs they evaluate, requiring further human validation." (Abstract)
- Criteria drift defined: "users need criteria to grade outputs, but grading outputs helps users define criteria." (Abstract)
- Some criteria depend on outputs: "some criteria appears dependent on the specific LLM outputs observed (rather than independent criteria that can be defined a priori)". (Abstract)
- The strong form: criteria drift "implies that it is impossible to completely determine evaluation criteria prior to human judging of LLM outputs." (Section 1, Introduction)
- Even grading first didn't settle it: "Even when participants graded first, we observed that they still refined their criteria upon further grading, even going back to change previous grades." (Section 1)
- Two kinds of drift: participants "wanted to add new criteria when they observed new “types” of bad LLM outputs", and "as participants graded more outputs, we found that they reinterpret existing criteria to better fit the LLM’s behavior". (Section 7.3.1)
- Example: a "proper noun" criterion for an entity-extraction task started as every entity must be a proper noun; after seeing outputs, two participants wanted "most of the entities were proper nouns, rather than all." (Section 7.3.1)
- A participant: "I think it’s hard to know until you see it". (Section 7.3.1)
- Some criteria are hard for humans but easy for code: "A criterion like word count is hard for humans to assess but easy for a good Python function to evaluate." (Section 7.3.2)
- Implication: "criteria refinement and grading should happen in tandem in interactive settings". (Section 8.1)
- Study size: "a qualitative study with 9 expert users". (Conclusion)

## Visuals worth redrawing

- A simple loop: write criteria, grade outputs, revise criteria. The paper's own figures are of the EvalGen interface, not worth redrawing.

## My notes

- Small qualitative study (9 people), one tool. Strong idea, thin numbers.
- Counterweight to anthropic-develop-tests, which treats criteria as something you write first. Both hold: write a first version, expect to change it after reading outputs.
- Shankar co-writes the evals FAQ with Husain, so the FAQ's "read traces first" advice and this paper come from the same camp.
