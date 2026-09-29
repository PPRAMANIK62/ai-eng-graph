---
id: husain-your-ai-product-needs-evals
title: Your AI Product Needs Evals
author: Hamel Husain
url: https://hamel.dev/blog/posts/evals/
published: 2024-03-29
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

A practitioner's guide to building an eval system for one AI product, told through Lucy, the AI assistant in the real estate app Rechat. It splits evaluation into three levels by cost: fast assertions that run on every code change, human and model review of logged traces on a schedule, and A/B tests after big changes. Its main argument is that products stall without evals, and that looking at your own data, often, is where the value is.

## Key claims

- Most failed AI products share one cause. "unsuccessful products almost always share a common root cause: a failure to create robust evaluation systems." (Motivation)
- Vibe checks aren't enough. "you need a way to measure success beyond vibe checks (which are useful, but not enough)" (Motivation)
- Product evals differ from benchmarks: evals "tailored to your users’ tasks, which measure something different from general model benchmarks." (Motivation)
- The Lucy plateau, before evals: "Addressing one failure mode led to the emergence of others, resembling a game of whack-a-mole." Also limited visibility "beyond vibe checks", and prompts that "expanded into long and unwieldy forms". (Case Study: Lucy)
- Three levels: "Level 1: Unit Tests", "Level 2: Model & Human Eval (this includes debugging)", "Level 3: A/B testing". (The Types Of Evaluation)
- Cost sets cadence. "The cost of Level 3 > Level 2 > Level 1." The author runs "Level 1 evals on every code change, Level 2 on a set cadence and Level 3 only after significant product changes." (The Types Of Evaluation)
- Level 1 is assertions. "Unit tests for LLMs are assertions (like you would write in pytest)." They "should run fast and cheaply as you develop your application so that you can run them every time your code changes." (Level 1: Unit Tests)
- Example: a listing-finder feature with three scenarios (one match, several matches, no match), each checked with an assertion on the result count, e.g. `len(listing_array) == 0`. (Step 1: Write Scoped Tests)
- Generic check: a regex asserts that internal UUIDs never appear in the reply. "We use a simple regex to assert that the LLM response doesn’t include UUIDs." (Step 1)
- "Rechat has hundreds of these unit tests." They're updated "based on new failures we observe in the data". (Step 1)
- Test inputs can be synthetic: "I often utilize an LLM to generate these inputs synthetically". "You don’t need to wait for production data to test your system." (Step 2: Create Test Cases)
- Pass rate isn't 100%. "unlike traditional unit tests, you don’t necessarily need a 100% pass rate. Your pass rate is a product decision, depending on the failures you are willing to tolerate." (Step 2)
- Track results over time. "you need to track the results of your tests over time so you can see if you are making progress." Rechat runs them in CI and charts them in Metabase. (Step 3: Run & Track Your Tests Regularly)
- A trace is the logged conversation. "In the context of LLMs, traces often refer to conversations you have with a LLM." Logging traces is "A prerequisite to performing human and model-based eval". (Logging Traces)
- "You must remove all friction from the process of looking at data." (Looking At Your Traces)
- Binary labels are easier. "I’ve found that assigning scores or more granular ratings is more onerous to manage than binary ratings." (Looking At Your Traces)
- How much to read: "When starting, you should examine as much data as possible." "You can never stop looking at data—no free lunch exists." (How much data should you look at?)
- Model graders need checking against people. "You should track the correlation between model-based and human evaluation to decide how much you can rely on automatic evaluation." (Automated Evaluation w/ LLMs)
- Raw agreement can mislead: "using raw agreement is generally not recommended and can be misleading when classes are imbalanced." Measure precision and recall separately. (Important Note on Using Agreement as a Metric)
- A/B tests are for mature products: "This level of evaluation is usually only appropriate for more mature products." (Level 3: A/B Testing)
- The same setup serves debugging and fine-tuning data: "there is an incredibly large overlap between the infrastructure needed for evaluation and that for debugging." (Debugging)
- Takeaways include "Don’t rely on generic evaluation frameworks to measure the quality of your AI." and "Write lots of tests and frequently update them." (Conclusion)
- Three activities: evaluating quality, debugging, and changing the system. "Many people focus exclusively on #3 above, which prevents them from improving their LLM products beyond a demo." Doing all three well "creates a virtuous cycle". (Motivation)
- Rechat made Lucy's final output editable "so that we could curate & fix data for fine-tuning." (Looking At Your Traces)
- Fine-tuning data comes from the eval setup: "99% of the labor involved with fine-tuning is assembling high-quality data that covers your AI product’s surface area." With a solid eval system, "you already have a robust data generation and curation engine!" (Fine-Tuning)
- Filtering generated fine-tuning data with the evals: "You can then use your Level 1 & Level 2 tests to filter out undesirable data that fails assertions or that the critique model thinks are wrong." (Data Synthesis & Curation)
- "Evaluation systems create a flywheel that allows you to iterate very quickly." (Conclusion)

## Visuals worth redrawing

- The improvement loop diagram with "Eval and Curation" at the center, linking evaluation, debugging and changing the system (Problem: How To Systematically Improve The AI?).
- The three-level cost ladder (unit tests, human and model eval, A/B tests) could be drawn as a ladder with cadence next to each rung.

## My notes

- From 2024, so tool names (LangSmith, Lilac) have aged; the method hasn't.
- The author sells an evals course; he says so at the end. The advice matches Anthropic's and OpenAI's docs on the main points.
