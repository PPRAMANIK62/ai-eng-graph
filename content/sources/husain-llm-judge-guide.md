---
id: husain-llm-judge-guide
title: "Using LLM-as-a-Judge For Evaluation: A Complete Guide"
author: Hamel Husain
url: https://hamel.dev/blog/posts/llm-judge/
published: 2024-10-29        # modified 2026-09-01
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

A step-by-step method for building an LLM judge, which the author calls "Critique Shadowing": pick one principal domain expert, build a diverse set of inputs, have the expert give each output a pass or fail plus a written critique, fix obvious bugs, then write a judge prompt using those critiques as examples and revise it until the judge agrees with the expert. Told partly through Honeycomb's query assistant. Argues hard for binary pass/fail over 1 to 5 scales, and says the real value is the careful look at data that the process forces.

## Key claims

- Common mistakes include "Arbitrary Scoring Systems: Using uncalibrated scales (like 1-5) across multiple dimensions, where the difference between scores is unclear and subjective. What makes something a 3 versus a 4?" (The Problem)
- One expert sets the bar: find "one (maybe two) key individuals whose judgment is crucial for the success of your AI product." Examples: "A psychologist for a mental health AI assistant." "A lawyer for an AI that analyzes legal documents." (Step 1)
- The expert's job: "Did the AI achieve the desired outcome?" "Just a clear pass or fail decision." Plus "a critique that explains their reasoning." (Step 3)
- Why critiques: "domain experts may not have fully internalized all the judgment criteria. By forcing them to make a pass/fail decision and explain their reasoning, they clarify their expectations". (Step 3)
- Critique detail: "detailed enough so that you can use it in a few-shot prompt for a LLM judge." "Being too terse is a common mistake." (Step 3)
- Against scales: "If your evaluations consist of a bunch of metrics that LLMs score on a 1-5 scale (or any other scale), you’re doing it wrong." "People don’t know what to do with a 3 or 4." (Don’t stray from binary pass/fail judgments)
- How many: start with "around 30 examples and keep going until I do not see any new failure modes." For validating a judge: "Aim for about 100 examples per failure mode, with enough Pass and Fail examples to measure both classes. Below 60 examples, the confidence intervals are often too wide to support a useful conclusion." (How many examples do you need?)
- Criteria drift, quoted from Shankar et al.: "it is impossible to completely determine evaluation criteria prior to human judging of LLM outputs." (The Hidden Power of Critiques)
- The Honeycomb judge prompt uses the expert's critiques as few-shot examples, each with the input, the generated query, and a critique ending in "good" or "bad", and asks the judge to "first write a detailed critique explaining your reasoning, then provide a pass/fail judgment". (Start with Expert Examples)
- Iterate by spreadsheet: the expert fills in his own critiques next to the judge's and the author "tracked agreement rates over time". (Keep Iterating)
- Agreement caveat: raw agreement was fine because "our dataset was roughly balanced (about 50% of instances were failures)". "Raw agreement can be misleading when classes are imbalanced." (Important Note on Using Agreement as a Metric)
- Result: "It took us only three iterations to achieve > 90% agreement between the LLM and Phillip." (Keep Iterating)
- Side effect on the expert: "Seeing how the LLM breaks down its reasoning made me realize I wasn’t being consistent about how I judged certain edge cases." (The Human Side of the Process)
- Re-run the human review "at regular intervals and whenever something material changes. For example, if I update a model". (How Often Should You Evaluate?)
- When it fails: "The AI is overscoped", "The process is not followed correctly", "The expectations of alignment are unrealistic or not feasible." (What if this doesn’t work?)
- The real value: "creating a LLM judge is a nice “hack” I use to trick people into carefully looking at their data!" (It’s Not The Judge That Created Value)
- Judges can be bigger than the system they grade: "Effective judges often use larger models or more compute (via longer prompts, chain-of-thought, etc.) than the systems they evaluate." (FAQ)
- Model choice: "the most powerful model I can afford in my cost/latency budget." (FAQ: What model do you use for the LLM judge?)
- Validation split: "A typical split uses 10 to 20 percent of the labeled examples for training, with 40 to 45 percent each for dev and test." "Never place dev or test examples in the judge prompt." (FAQ: How do you validate an LLM judge against human labels?)
- Why not accuracy: "if an error occurs in 5% of examples, a judge that always predicts Pass still has 95% agreement while detecting none of the errors." (same FAQ)
- Off-the-shelf judges: "Nothing is strictly wrong with them. It’s just that many people are led astray by them." (FAQ)
- Some failures don't need a judge: "You might not even need a LLM judge for some errors (and use a code-based assertion instead)." (Step 7)
- Experience behind it: "This guide shares what I’ve learned after helping over 30 companies set up their evaluation systems." (intro)

## Visuals worth redrawing

- The seven-step flowchart (expert, dataset, pass/fail with critiques, fix errors, build judge, error analysis, specialized judges) as a loop.

## My notes

- The author sells an evals course and says so on the page. The method matches Anthropic's and OpenAI's docs on the main points (calibrate against people), and differs on scales.
