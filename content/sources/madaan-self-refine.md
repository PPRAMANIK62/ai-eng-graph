---
id: madaan-self-refine
title: "Self-Refine: Iterative Refinement with Self-Feedback"
author: Aman Madaan, Niket Tandon, Prakhar Gupta, Skyler Hallinan, Luyu Gao, Sarah Wiegreffe, Uri Alon, Nouha Dziri, Shrimai Prabhumoye, Yiming Yang, Shashank Gupta, Bodhisattwa Prasad Majumder, Katherine Hermann, Sean Welleck, Amir Yazdanbakhsh, Peter Clark
url: https://arxiv.org/abs/2303.17651
published: 2023-03-30          # v2 2023-05-25
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

One model writes a draft, gives itself feedback, and rewrites using that feedback, repeating up to four times. Across seven tasks (dialogue replies, code optimization, code readability, math, sentiment reversal, acronyms, constrained generation) with GPT-3.5, ChatGPT and GPT-4, the refined outputs beat one-shot outputs by about 20 points on average. Gains were biggest on open-ended, preference-judged tasks and smallest on math, where the model usually couldn't see its own mistake. Specific, actionable feedback mattered, and most of the gain came in the first round or two.

## Key claims

- The method: generate, then "the same LLMs provides feedback for its output and uses it to refine itself, iteratively." (Abstract)
- Headline: "improving by ~20% absolute on average in task performance." (Abstract)
- Stopping: the loop runs until a stopping condition, either a fixed number of steps or a stop signal the model writes into its feedback; in the experiments, "up to a maximum of 4 iterations". (2 Iterating Self-Refine; 3.1)
- History: previous outputs and feedback are appended to the prompt so the model can "avoid repeating" mistakes. (2)
- Biggest gains on preference tasks, e.g. dialogue responses: GPT-4 preference "from 25.4% to 74.6%". (3.3 Results)
- Math gains were modest because the model couldn't tell whether there was an error: "ChatGPT feedback for 94% instances is ’everything looks good’". With an external signal saying the answer is wrong, gains on math were "much bigger (5%+)". (3.3 Results)
- Diminishing returns: code optimization 22.0 → 27.0 → 27.9 → 28.8 over three rounds; constrained generation 29.0 → 40.3 → 46.7 → 49.7. "the marginal improvement naturally decreases with more iterations." (4 Analysis, Figure 4)
- Feedback quality matters: code optimization 27.5 with Self-Refine feedback, 26.0 with generic feedback, 24.8 with none; sentiment reversal 43.2 → 31.2 with generic feedback, and it "fails without feedback". (4 Analysis, Table 2)
- The feedback examples: actionable "Avoid repeated calculations in the for loop" vs generic "Improve the efficiency of the code". (4 Analysis, The impact of the feedback quality)
- More samples aren't the same thing: Self-Refine's output was preferred by humans over all of k=4 plain samples. (4 Analysis)
- Weak models can't do it: Vicuna-13B "struggles significantly with the refinement process" and "was not able to consistently generate the feedback in the required format." (4 Analysis)
- Failures were mostly bad feedback, not bad rewrites: "When Self-Refine failed to improve the original generation, the majority of issues were due to erroneous feedback rather than faulty refinements." (4 Qualitative Analysis)

## Visuals worth redrawing

- Figure 4: score per iteration for three tasks, flattening.

## My notes

- 2023 models. The constrained-generation gain was later partly explained by a weak first prompt (see `huang-cannot-self-correct`, section 5).
