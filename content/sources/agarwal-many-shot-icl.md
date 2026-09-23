---
id: agarwal-many-shot-icl
title: Many-Shot In-Context Learning
author: Rishabh Agarwal, Avi Singh, Lei M. Zhang, Bernd Bohnet, et al. (Google DeepMind, 15 authors)
url: https://arxiv.org/abs/2404.11018
published: 2024-04-17        # v1; v3 revised 2024-10-17; NeurIPS 2024 spotlight
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

With 1M-token context windows, you can put hundreds or thousands of examples in a prompt instead of a handful. This paper does that on Gemini 1.5 Pro across translation, summarization, math, planning, sentiment and more, and finds large gains over few-shot. With enough examples the model can even learn labels that contradict what it learned in training, and results get close to fine-tuning on some tasks. The costs: longer prompts cost more to run, and example order still matters.

## Key claims

- Many-shot gains. "Going from few-shot to many-shot, we observe significant performance gains across a wide variety of generative and discriminative tasks." (Abstract)
- Why it's possible now: context windows grew "by at least 100×: from only a few thousand tokens in GPT-3 and Llama 2 to 1M tokens in Gemini 1.5 Pro". (§1)
- Scale of the tests: "up to 8192 shots" and "up to 1M tokens". Best results often came only at "hundreds of thousands of tokens". (§1)
- Overriding what the model already believes. "unlike few-shot learning, many-shot learning is effective at overriding pretraining biases" (Abstract). On sentiment with flipped labels (negative/neutral/positive rotated), accuracy is much lower than normal labels with few shots but "as the number of shots increases, performance on flipped and abstract labels dramatically improves, approaching that of default labels." (§4.1)
- Close to fine-tuning, sometimes. On low-resource translation with 250 and 997 examples, "SFT and ICL performance is quite close for Bemba, while SFT has a slight edge for Kurdish." Conclusion: "many-shot ICL can be a viable alternative to SFT for some tasks." (§4.3)
- Trade-off vs fine-tuning. Fine-tuning "is computationally expensive in terms of training. In contrast, many-shot ICL does not require any training, however it has a larger inference cost, which can be substantially reduced with KV caching" (§4.3)
- Cost grows with shots. "inference cost increases linearly in the many-shot regime" (Abstract)
- Order still matters at 50 examples. Ten random orderings of the same 50 MATH examples gave significantly different results per subarea, and "an ordering that excels in one subarea may perform poorly in another". (§4.7)
- More isn't always better. For some tasks "we did observe slight performance deterioration beyond a certain number of shots"; on MATH and GPQA, success rate "decreases after 125 shots". (§1, §4.8)
- Running out of human-written examples. Model-generated reasoning can stand in: "Reinforced ICL uses model-generated chain-of-thought rationales in place of human examples." (Abstract)
- Different models benefit differently. "frontier LLMs benefit from many-shot ICL to varying degrees." (Abstract) GPT-4-Turbo and Claude-3-Opus were also tested on translation. (§4.5)

## Visuals worth redrawing

- Figure 1: bar pairs, best few-shot vs best many-shot, per task. Shows the size of the jump.
- Figure 10: accuracy vs number of shots for default, flipped and abstract labels on sentiment. The flipped line starts low and catches up. The best picture for "many examples can override what the model thinks it knows".

## My notes

- 2024, mostly Gemini 1.5 Pro. Pre-reasoning-model era; it doesn't test o-series or current Claude.
- Bridges few-shot and [[fine-tuning]]: same examples, either in the prompt (pay per call) or in the weights (pay once to train).
- Contrasts with `min-rethinking-demonstrations`: with few examples, labels barely matter because the model uses its prior; with many, the labels themselves start to teach.
