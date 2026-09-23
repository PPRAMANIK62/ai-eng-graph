---
id: anthropic-tracing-thoughts
title: Tracing the thoughts of a large language model
author: Anthropic (Interpretability team)
url: https://www.anthropic.com/research/tracing-thoughts-language-model
published: 2025-03-27
accessed: 2026-09-23
kind: blog
primary: true
---

## Summary

Anthropic's summary of two interpretability papers that trace the internal steps Claude 3.5 Haiku takes on simple tasks. The finding that matters for next-token prediction: the model writes one token at a time but plans ahead, picking a rhyme word before it writes the line that ends in it. It also shows parallel paths for mental math and chained facts for two-step questions.

## Key claims

- The question the post sets up: output is one word at a time, but is prediction all that happens? "Claude writes text one word at a time. Is it only focusing on predicting the next word or does it ever plan ahead?" (intro)
- The main counterpoint: training is one word at a time, but the model's thinking can reach further. "This is powerful evidence that even though models are trained to output one word at a time, they may think on much longer horizons to do so." (intro, list of findings)
- The model plans the destination and writes toward it. "Claude will plan what it will say many words ahead, and write to get to that destination." (intro, list of findings)
- The researchers expected no planning and were surprised. "In the poetry case study, we had set out to show that the model didn't plan ahead, and found instead that it did." (intro)
- The rhyme example: the poem is He saw a carrot and had to grab it, / His hunger was like a starving rabbit. Before writing line two, the model already has candidate rhyme words for "grab it" in mind (rabbit is the one it uses). "Instead, we found that Claude plans ahead." (Does Claude plan its rhymes?)
- Then it writes the line to land on the planned word. "Then, with these plans in mind, it writes a line to end with the planned word." (Does Claude plan its rhymes?)
- Removing the planned word from the model's internal state makes it aim at a different rhyme: with "rabbit" subtracted, it writes a new line ending in "habit". "This demonstrates both planning ability and adaptive flexibility—Claude can modify its approach when the intended outcome changes." (Does Claude plan its rhymes?)
- Injecting a different concept ("green") changes the whole line to fit it: a sensible line that no longer rhymes and ends in "green". "the model makes plans for this entirely different ending." (Does Claude plan its rhymes?, figure caption)
- Mental math (36+59) uses two parallel paths inside one forward pass. "One path computes a rough approximation of the answer and the other focuses on precisely determining the last digit of the sum." (Mental math)
- Two-step questions chain facts internally: Dallas → Texas → Austin; swapping "Texas" for "California" changes the answer to Sacramento. "the model is combining independent facts to reach its answer rather than regurgitating a memorized response." (Multi-step reasoning)
- The next-token objective itself pushes toward guessing. "At a basic level, language model training incentivizes hallucination: models are always supposed to give a guess for the next word." (Hallucinations)
- Limits of the method: it sees only part of the computation, on short prompts, with hours of work. "Even on short, simple prompts, our method only captures a fraction of the total computation performed by Claude" (intro, limitations paragraph)
- Anti-hallucination training works, but not fully: models often decline rather than speculate. "Models like Claude have relatively successful (though imperfect) anti-hallucination training" (Hallucinations)
- Inside Claude, declining is the default: a circuit that says there isn't enough information is on unless something turns it off. "It turns out that, in Claude, refusal to answer is the default behavior" (Hallucinations)
- For a well-known entity (Michael Jordan), a known-entity feature inhibits that default circuit. "This allows Claude to answer the question when it knows the answer." (Hallucinations)
- For an unknown name (Michael Batkin) the default wins and Claude declines; forcing the known-answer features on makes it claim Batkin plays chess. "we’re able to cause the model to hallucinate (quite consistently!) that Michael Batkin plays chess." (Hallucinations)
- Natural hallucinations are misfires of that circuit on names the model recognizes but knows nothing about. "such misfires can occur when Claude recognizes a name but doesn't know anything else about that person." (Hallucinations)
- After that, it fills in something plausible. "Once the model has decided that it needs to answer the question, it proceeds to confabulate: to generate a plausible—but unfortunately untrue—response." (Hallucinations)

## Visuals worth redrawing

- The three-row rhyme figure (Does Claude plan its rhymes?): no intervention → line ends in "rabbit"; "rabbit" suppressed → ends in "habit"; "green" injected → ends in "green". The best picture for the article's counterpoint section. Redraw as three rows with the planned word shown before the line is written.
- Mental math figure (Mental math): two parallel paths for 36+59, one rough estimate of the total and one that works out the exact last digit, merging into 95. I didn't check the figure's internal labels; open it before redrawing the details.
- Dallas → Texas → Austin chain (Multi-step reasoning), with the Texas → California swap giving Sacramento.

## My notes

- Model is Claude 3.5 Haiku (the post says "we look inside Claude 3.5 Haiku"). Dated relative to current Claude models; the findings are about mechanisms, not model quality, so they still illustrate the point.
- This is Anthropic's summary. The detail is in two papers ("Circuit tracing: Revealing computational graphs in language models" and "On the biology of a large language model"), not opened here. If the article needs more than the summary's claims, open and add them as separate sources.
- The post's own caveat matters: the tools see "a fraction of the total computation" and may add artifacts. So "the model plans ahead" is strong evidence from a few case studies, not a proof for all outputs.
- Doesn't contradict Wolfram's "everything feeds forward": planning here means the internal state at the start of a line already represents the target word. No loop needed.
- The hallucination claim ("always supposed to give a guess for the next word") links next-token prediction to the hallucination node.
- The page puts straight double quotes around "rabbit", "habit", "green" and "thinking", so the quotes above were picked to avoid them; an article quote with inner straight quotes would break the check script's quote matching.
