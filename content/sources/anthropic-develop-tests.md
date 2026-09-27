---
id: anthropic-develop-tests
title: Define success criteria and build evaluations
author: Anthropic (Claude Platform docs)
url: https://platform.claude.com/docs/en/test-and-evaluate/develop-tests
published: undated           # no date on the page; code examples use claude-opus-5-5. The old define-success URL now redirects here.
accessed: 2026-09-27
kind: docs
primary: true
---

## Summary

Anthropic's docs page on defining what success means for an LLM feature and then building evals to measure it. Good criteria are specific, measurable, achievable and relevant, and most features need several of them at once. It then gives eval design principles and worked examples of graders: exact match, cosine similarity, ROUGE-L, and LLM graders on a Likert scale, a yes/no question, and an ordinal scale. On 2026-09-27 the older "define success" page (`/test-and-evaluate/define-success`) redirects to this one.

## Key claims

- Criteria first. "Building a successful LLM-based application starts with clearly defining your success criteria and then designing evaluations to measure performance against them." (intro)
- Good criteria are Specific ("Instead of "good performance," specify "accurate sentiment classification.""), Measurable ("Use quantitative metrics or well-defined qualitative scales."), Achievable ("Base your targets on industry benchmarks, prior experiments, AI research, or expert knowledge."), and Relevant ("Align your criteria with your application's purpose and user needs."). (Define your success criteria)
- Relevance example: "Strong citation accuracy might be critical for medical apps but less so for casual chatbots." (Relevant)
- Even vague goals can be measured. Safety, bad: "Safe outputs". Good: "Less than 0.1% of outputs out of 10,000 trials flagged for toxicity by the content filter." (Measurable)
- Bad vs good criterion for sentiment analysis. Bad: "The model should classify sentiments well". Good: "an F1 score of at least 0.85 (Measurable, Specific) on a held-out test set* of 10,000 diverse Twitter posts (Relevant), which is a 5% improvement over the current baseline (Achievable)." (Example task fidelity criteria)
- Common criteria: task fidelity, consistency, relevance and coherence, tone and style, privacy preservation, context utilization, latency, price. "This list is non-exhaustive." (Common success criteria)
- "Most use cases need multidimensional evaluation along several success criteria." (Common success criteria)
- Multidimensional example on 10,000 posts: "an F1 score of at least 0.85", "99.5% of outputs are non-toxic", "90% of errors would cause inconvenience, not egregious error*", "95% response time < 200ms", with the note "In reality, you would also define what "inconvenience" and "egregious" mean." (Example multidimensional criteria)
- Design principle 1: "Be task-specific: Design evals that mirror your real-world task distribution. Don't forget to factor in edge cases!" Edge cases listed: irrelevant or missing input, overly long input, poor or harmful user input, and "Ambiguous test cases where even humans would find it hard to reach an assessment consensus". (Eval design principles)
- Design principle 2: "Automate when possible: Structure questions to allow for automated grading (for example, multiple-choice, string match, code-graded, LLM-graded)." (Eval design principles)
- Design principle 3: "Prioritize volume over quality: More questions with slightly lower signal automated grading is better than fewer questions with high-quality human hand-graded evals." (Eval design principles)
- Exact match: "Exact match evals measure whether the model's output matches a predefined correct answer, typically after normalizing whitespace and case." Example set: "1,000 tweets with human-labeled sentiments", including sarcasm and mixed-sentiment edge cases. (Example evals: exact match)
- Cosine similarity for consistency: similar questions "should yield semantically similar answers"; example set of "50 groups with a few paraphrased versions each". (Example evals: cosine similarity)
- ROUGE-L for summaries against reference summaries; "200 articles with reference summaries". (Example evals: ROUGE-L)
- LLM Likert grader for tone: rates responses 1 to 5; "100 customer inquiries with target tone". (Example evals: Likert)
- LLM binary grader for privacy: yes/no on whether a reply contains health information; "500 simulated patient queries, some with PHI". (Example evals: binary)
- A code comment in the examples: "Generally best practice to use a different model to evaluate than the model used to generate the evaluated output". (LLM grader code examples)
- Pick the grader: "choose the fastest, most reliable, most scalable method". Code-based grading: "Fastest and most reliable, extremely scalable, but also lacks nuance". Human grading: "Most flexible and high quality, but slow and expensive. Avoid if possible." LLM-based grading: "Fast and flexible, scalable and suitable for complex judgment. Test to ensure reliability first then scale." (Grade your evaluations)
- LLM grading tips: detailed rubrics; "instruct the LLM to output only 'correct' or 'incorrect', or to judge from a scale of 1–5"; "Ask the LLM to reason first before producing an evaluation score, and then discard the reasoning." (Tips for LLM-based grading)
- Achievable, in full: "Base your targets on industry benchmarks, prior experiments, AI research, or expert knowledge. Your success metrics should not be unrealistic to current frontier model capabilities." (Define your success criteria)
- Likert grading fits things fixed metrics can't capture: it's "ideal for evaluating nuanced aspects like empathy, professionalism, or patience that are difficult to quantify with traditional metrics." (Example evals: Likert)
- Privacy criterion: "Can it follow instructions not to use or share certain details?" (Common success criteria)
- Test cases can be generated: "Get Claude to help you generate more from a baseline set of example test cases." (after the examples)

## Visuals worth redrawing

- The bad vs good criteria tables (sentiment analysis, single and multidimensional). Good as a side-by-side figure.
- The prompt engineering flowchart at the top: test cases, preliminary prompt, iterative testing and refinement, final validation, ship.

## My notes

- "Prioritize volume over quality" pulls against Anthropic's own 2026 engineering post (anthropic-demystifying-evals: start with 20 to 50 tasks from real failures) and Husain and Shankar's trace-reading method.
- It shows Likert and 1 to 5 scales as normal; Husain prefers binary labels. A real disagreement.
- It assumes criteria can be written before you look at outputs. See shankar-who-validates-validators for evidence that they shift as you grade.
