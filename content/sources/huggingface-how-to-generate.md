---
id: huggingface-how-to-generate
title: "How to generate text: using different decoding methods for language generation with Transformers"
author: Patrick von Platen (Hugging Face)
url: https://huggingface.co/blog/how-to-generate
published: 2020-03-01         # edited July 2023 with up-to-date references and examples
accessed: 2026-09-23
kind: blog
primary: true
---

## Summary

A hands-on tour of greedy search, beam search, plain sampling, temperature, top-k and top-p, each run on GPT-2 with the prompt "I enjoy walking with my cute dog". Toy probability trees show how each method picks words. It ends honestly: top-p and top-k read better than greedy and beam for open-ended text, but they have repetition problems too, and no method wins everywhere.

## Key claims

- Greedy picks the single most likely word each step. "It selects the word with the highest probability as its next word" (Greedy Search)
- Greedy on GPT-2 repeats fast: "I'm not sure if I'll ever be able to walk with my dog" twice in a row. "the model quickly starts repeating itself!" (Greedy Search)
- Greedy can miss a better sequence hidden behind a lower-probability first word: "has" at 0.9 sits behind "dog" (second choice), so greedy never finds "The dog has". (Greedy Search)
- Beam search keeps several candidate sequences and picks the most likely overall: ("The","dog","has") at 0.36 beats greedy's ("The","nice","woman") at 0.2. "Beam search will always find an output sequence with higher probability than greedy search, but is not guaranteed to find the most likely" one. (Beam search)
- Beam search works for predictable-length tasks like translation and summarization, less for dialog and stories. (Beam search)
- Sampling makes generation non-deterministic. "It becomes obvious that language generation using sampling is not deterministic anymore." (Sampling)
- Plain sampling often gives incoherent text. "The models often generate incoherent gibberish" (Sampling)
- Lowering temperature sharpens the distribution: "increasing the likelihood of high probability words and decreasing the likelihood of low probability words". Example uses temperature=0.6. (Sampling)
- Temperature near 0 is greedy. "when setting temperature → 0, temperature scaled sampling becomes equal to greedy decoding and will suffer from the same problems as before." (Sampling)
- Top-k: keep the K most likely words and redistribute probability among them; GPT-2 used it. "the K most likely next words are filtered and the probability mass is redistributed among only those K next words." Example uses top_k=50. (Top-K Sampling)
- Top-k's weakness: fixed size. With K=6 it cuts reasonable words ("people", "big", "house", "cat") in a flat step and lets in poor ones ("down", "a") in a sharp step. (Top-K Sampling)
- How much of the probability the K=6 set covers in each step: about two-thirds in the flat step, and "it includes almost all of the probability mass in the second step". (Top-K Sampling, paragraph after the figure; re-opened 2026-09-23)
- The flat and sharp steps are after "The" and after "The", "car": top-p "keeps a wide range of words where the next word is arguably less predictable, e.g. P(w | "The"), and only a few words when the next word seems more predictable, e.g. P(w | "The", "car")." (Top-p (nucleus) sampling; re-opened 2026-09-23)
- Top-p: the smallest set whose cumulative probability exceeds p. "Top-p sampling chooses from the smallest possible set of words whose cumulative probability exceeds the probability p." With p=0.92 that was 9 words in one step and 3 in the next. (Top-p sampling)
- Top-p and top-k can be combined. "Top-p can also be used in combination with Top-K , which can avoid very low ranked words while allowing for some dynamic selection." Final example: top_k=50, top_p=0.95. (Top-p sampling)
- Both work in practice. "While in theory, Top-p seems more elegant than Top-K , both methods work well in practice." (Top-p sampling)
- No method wins everywhere; top-k and top-p repeat too, and some evidence says repetition comes from training. "there is no one-size-fits-all method here" (Conclusion)

## Visuals worth redrawing

- The toy probability tree: "The" → {nice 0.5, dog 0.4, car 0.1} → next words, with greedy and beam paths highlighted. Best main visual for `sampling`.
- Top-k vs top-p on a flat and a sharp distribution (K=6 vs p=0.92): the fixed-size cut vs the adaptive cut. Main visual for `top-p`.

## My notes

- 2020, edited 2023. GPT-2 examples throughout.
- "primary: true" because Hugging Face builds the `generate()` implementation described; the methods themselves come from Holtzman et al. and Fan et al.
- The toy tree's first-step probabilities (nice 0.5, dog 0.4, car 0.1) are in the images; the text confirms nice 0.5 × woman 0.4 = 0.2 and dog 0.4 × has 0.9 = 0.36.
