---
id: brown-gpt3-few-shot-learners
title: Language Models are Few-Shot Learners
author: Tom B. Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah, Jared Kaplan, et al. (OpenAI, 31 authors)
url: https://arxiv.org/abs/2005.14165
published: 2020-05-28        # v1; this note uses v4, revised 2020-07-22
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The GPT-3 paper. OpenAI trained a plain next-token predictor with 175 billion parameters and showed that it can do new tasks just from text in the prompt: an instruction, plus zero, one or a few worked examples, with no weight updates. The paper calls this "in-context learning" and shows it gets much better as the model gets bigger, which is the main evidence that one simple objective, scaled up, produces useful behavior.

## Key claims

- GPT-3 is a next-token predictor ("autoregressive") with 175B parameters, 10x bigger than any earlier dense model. "we train GPT-3, an autoregressive language model with 175 billion parameters, 10x more than any previous non-sparse language model" (Abstract)
- Tasks are given purely as text, and the model's weights never change during use. "For all tasks, GPT-3 is applied without any gradient updates or fine-tuning, with tasks and few-shot demonstrations specified purely via text interaction with the model." (Abstract)
- The headline result: scale alone makes few-shot performance much better. "Here we show that scaling up language models greatly improves task-agnostic, few-shot performance, sometimes even reaching competitiveness with prior state-of-the-art fine-tuning approaches." (Abstract)
- Definition of in-context learning: the prompt is the task spec, and the model does the task by predicting what comes next. "the model is conditioned on a natural language instruction and/or a few demonstrations of the task and is then expected to complete further instances of the task simply by predicting what comes next." (§1 Introduction)
- In-context learning happens inside a single forward pass over the prompt, not by training. "We use the term “in-context learning” to describe the inner loop of this process, which occurs within the forward-pass upon each sequence." (Figure 1.1 caption)
- Few-shot means K examples of context plus completion, then one more context for the model to complete; K is usually 10 to 100 because that's what fits in 2,048 tokens. "We typically set K in the range of 10 to 100 as this is how many examples can fit in the model’s context window (nctx = 2048)." (§2 Approach, Few-Shot)
- Bigger models use the prompt's examples better; the gap between zero-shot and few-shot grows with size. "Larger models make increasingly efficient use of in-context information." (Figure 1.2 caption)
- Model sizes and training: 8 models from 125M to 175B parameters, all trained on 300 billion tokens; the 175B model has 96 layers and 12,288-wide vectors (Table 2.1). "All models were trained for a total of 300 billion tokens." (Table 2.1 caption)
- Concrete few-shot numbers on arithmetic, done purely from examples in the prompt. "achieving 100% accuracy on 2 digit addition, 98.9% at 2 digit subtraction, 80.2% at 3 digit addition, and 94.2% at 3-digit subtraction." (§3.9.1 Arithmetic)
- Long generated text still has the known failure modes: repetition, drift, contradiction. "GPT-3 samples still sometimes repeat themselves semantically at the document level, start to lose coherence over sufficiently long passages, contradict themselves" (§5 Limitations)
- The authors' own caveat on the objective: every token counts the same. "Our current objective weights every token equally and lacks a notion of what is most important to predict and what is less important." (§5 Limitations)
- They expect pure next-token prediction to run out of road. "scaling pure self-supervised prediction is likely to hit limits, and augmentation with a different approach is likely to be necessary." (§5 Limitations)
- The training mix (Table 2.2): filtered Common Crawl 410B tokens (60% of the mix), WebText2 19B (22%), Books1 12B (8%), Books2 55B (8%), Wikipedia 3B (3%). Higher-quality sets are sampled more often: Wikipedia is seen 3.4 times, Common Crawl 0.44 times. "datasets we view as higher-quality are sampled more frequently" (§2.2 Training Dataset)
- The web data is a snapshot of a fixed period: 2016 to 2019, 45TB compressed before filtering, 570GB after. "The CommonCrawl data was downloaded from 41 shards of monthly CommonCrawl covering 2016 to 2019" (§2.2 Training Dataset)
- Raw web text is lower quality than curated text, so it was filtered and deduplicated. "unfiltered or lightly filtered versions of Common Crawl tend to have lower quality than more curated datasets." (§2.2 Training Dataset)
- Benchmark test sets leak into web training data ("data contamination"), and a bug meant some overlaps weren't removed. "Unfortunately, a bug in the filtering caused us to ignore some overlaps" (§2.2)
- Pretraining is far less sample-efficient than people. "it still sees much more text during pre-training than a human sees in the their lifetime" (§5 Limitations; the typo "the their" is in the paper)
- Compute: GPT-3 175B took several thousand petaflop/s-days of pretraining compute, vs tens for the 1.5B GPT-2. "GPT-3 175B consumed several thousand petaflop/s-days of compute during pre-training" (§6.3 Energy Usage)

## Visuals worth redrawing

- Figure 2.1 (§2 Approach): four panels side by side, fine-tuning vs zero-shot vs one-shot vs few-shot, using English-to-French translation as the task. The best single picture of "the prompt is the task". Redraw as four prompt boxes growing from just an instruction to instruction plus examples.
- Figure 1.2 (§1): accuracy vs number of in-context examples K, one line per model size, on a task of removing random symbols from a word. The caption says the larger models have steeper curves. I read the caption, not the plotted values; check the figure before labeling model sizes. Good for showing "scale makes in-context learning work".
- Figure 1.1 (§1): outer loop (pretraining by SGD) vs inner loop (in-context learning within one sequence). Useful to show that learning from the prompt happens with frozen weights.
- Figure 1.3 (§1): aggregate accuracy over 42 benchmarks vs model size, for zero-, one- and few-shot.

## My notes

- Dated: 2020, pre-ChatGPT, base model only (no instruction tuning or RLHF). Modern chat models are trained further, so "the prompt is the task" works much better today than the paper's zero-shot numbers suggest. Still the primary source for in-context learning as a term and for the 175B / 2,048-token numbers.
- The paper doesn't claim the model "learns" at inference time. Footnote 1 says the terms are "intended to remain agnostic on the question of whether the model learns new tasks from scratch at inference time or simply recognizes patterns seen during training". Worth saying in the article.
- It states the loop only indirectly ("simply by predicting what comes next"). The token-by-token loop and sampling details come from Wolfram and 3Blue1Brown.
- The uncurated poem samples in Appendix F were made "sampling at temperature 1 using nucleus sampling [HBFC19] with P = 0.9", so even OpenAI didn't use greedy decoding for long creative text. Links to the "top token gives flat text" point.
- 300B training tokens here vs Wolfram's "a few hundred billion words" for ChatGPT: consistent in size, but Wolfram mixes words and tokens.
