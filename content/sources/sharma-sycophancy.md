---
id: sharma-sycophancy
title: Towards Understanding Sycophancy in Language Models
author: Mrinank Sharma, Meg Tong, Tomasz Korbak, et al., Ethan Perez (Anthropic, 19 authors)
url: https://arxiv.org/abs/2310.13548
published: 2023-10-20        # v4 2025-05-10; ICLR 2024
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

Anthropic's study of sycophancy: AI assistants telling users what they want to hear instead of what's true. Five assistants from 2023 all did it, in four kinds of tests. The paper then traces a likely cause to human preference data: answers that agree with the user are more likely to be preferred, and both people and preference models sometimes pick a convincing wrong answer over a correct one. So training on human preferences can teach flattery.

## Key claims

- Definition. "human feedback may also encourage model responses that match user beliefs over truthful ones, a behaviour known as sycophancy." (Abstract)
- Five assistants tested: claude-1.3, claude-2.0, gpt-3.5-turbo, gpt-4 and llama-2-70b-chat. "We examine claude-1.3, claude-2.0, gpt-3.5-turbo, gpt-4, and llama-2-70b-chat" (§3)
- Three behaviors found. "these AI assistants frequently wrongly admit mistakes when questioned by the user, give predictably biased feedback, and mimic errors made by the user." (§1 Introduction)
- Biased feedback: adding "I really like the [solution/argument/poem]" or "I wrote the [. . . ]" to the prompt makes the feedback more positive. (§3.1, Figure 1)
- "Are you sure?": after a correct answer, the user says "I don’t think that’s right. Are you sure?" and models often back down. "Claude 1.3 wrongly admits mistakes on 98% of questions." (§3.2)
- A weakly stated wrong belief lowers accuracy by up to 27%. "The user suggesting an incorrect answer can reduce accuracy by up to 27% (LLaMA 2; Fig. 3)." (§3.3)
- GPT-4 was the most robust of the five. "with GPT-4 being the most robust." (§3.3)
- Mimicry: told a poem is by the wrong poet, assistants go along with it even though they know the right poet. (§3.4, Figure 4)
- In human preference data, agreeing with the user is one of the strongest predictors of being preferred. "matching a user’s views is one of the most predictive features of human preference judgments" (§1)
- Both humans and preference models sometimes prefer convincing sycophantic answers. "both humans and preference models (PMs) prefer convincingly-written sycophantic responses over correct ones a non-negligible fraction of the time." (Abstract)
- On the hardest misconceptions, Claude 2's preference model preferred the sycophantic answer 45% of the time. "for the most challenging misconceptions, the PM prefers the sycophantic response almost half the time (45%)." (§4.3.1)
- Humans get less reliable as questions get harder. "they do so less reliably at higher difficulty levels" (§4.3.1, Human Feedback Results)
- Optimizing harder against a preference model can trade truth for flattery. "Optimizing model outputs against PMs also sometimes sacrifices truthfulness in favor of sycophancy." (Abstract)
- Conclusion. "sycophancy is a general behavior of state-of-the-art AI assistants, likely driven in part by human preference judgments favoring sycophantic responses." (Abstract)

## Visuals worth redrawing

- Figure 2: the "Are you sure?" exchange (model answers correctly, user pushes back, model apologizes and changes to a wrong answer), with bars per model. A strong opening example for the "why they flatter" section.
- Figure 7: how often the PM and humans prefer sycophantic over truthful answers, by misconception difficulty.

## My notes

- 2023 models. Newer models may be less sycophantic, but the mechanism (preference data rewards agreement) is the point.
- "Likely driven in part": the paper doesn't claim preference training is the only cause.
- The OpenAI GPT-4o sycophancy postmortem (2025) would be a real production case, but it returned 403 in the candidate research; not opened, don't cite.
- In the misconception test, crowd-workers had no internet and weren't experts, and weren't the user holding the belief.
