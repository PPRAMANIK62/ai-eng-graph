---
id: role-prompting
title: Does telling the model who it is help?
depth: short
phase: 1
note: >-
  Telling the model who it is ("you're a senior editor"). What it changes and what it doesn't.
needs: [system-prompt]
leads_to: []
compare_with: []
status: review
updated: 2026-09-23
---

# Does telling the model who it is help?

Role prompting means opening with "You are a...": a senior editor, a
physics expert, a helpful coding assistant. It's one of the most common
lines in any prompt. The evidence says it changes how the model sounds and
what it pays attention to, and doesn't make its answers more correct.

## What a role prompt looks like

The role usually goes at the top of the [[system-prompt]]:

```json
{
  "system": "You are a helpful coding assistant specializing in Python.",
  "messages": [
    {"role": "user", "content": "How do I sort a list of dictionaries by key?"}
  ]
}
```

That's the example from Anthropic's prompting guide (as of 2026-09), which
recommends a role to focus the model's behavior and tone on your use case,
and adds that even one sentence makes a difference.

So what kind of difference?

## Accuracy: no gain, sometimes a loss

Two studies tested the obvious hope: that "you are an expert" makes the
model more likely to get the answer right.

**2023, open models.** Researchers tried 162 roles, covering 8 areas of
expertise and 6 kinds of relationship, on 2,410 factual multiple-choice
questions from MMLU. The models were open instruction-tuned ones: Llama 3,
Qwen 2.5, Mistral and FLAN-T5. Adding a persona didn't beat the version with no persona. Some
persona did help on some question, but nobody could tell in advance which
one. Automatic persona picking did about as well as picking at random. Two
Qwen 2.5 models didn't react to any of the 162 personas at all.

**2025, closed and reasoning models.** A Wharton team repeated the idea on
harder, graduate-level questions (GPQA Diamond and MMLU-Pro) with GPT-4o,
GPT-4o-mini, o3-mini, o4-mini, Gemini 2.0 Flash and Gemini 2.5 Flash. Each
question was asked 25 times per setup.

| Persona | Example | Effect on accuracy |
|---|---|---|
| Matching expert | "You are a world-class expert in physics..." on physics questions | No significant change (except Gemini 2.0 Flash) |
| Wrong-field expert | A physics expert on law questions | Small differences, sometimes worse |
| Low-knowledge | "You are a 4-year-old toddler who thinks the moon is made of cheese." | Often worse |

![Three personas and what they did to accuracy on hard multiple-choice questions in a 2025 study. A matching expert persona left accuracy flat. An expert from the wrong field sometimes made it slightly worse. A low-knowledge persona, a 4-year-old toddler, often made it worse.](img/role-prompting-persona-accuracy.svg)

One failure is worth knowing. Given an expert role that didn't match the
question, Gemini 2.5 Flash often refused to answer, saying it lacked the
expertise. On one benchmark it refused about 10 of every 25 tries. A role
that's too narrow can make the model hold back knowledge it has.

Two studies, two years apart, open and closed models, same answer: an expert
persona doesn't add knowledge.

## What a role does change

The 2025 authors say plainly that their results are about accuracy only. Personas may still
change tone, what the model focuses on, and how it approaches a problem. A
compliance officer and a business developer look at the same deal and care
about different things.

Anthropic's claim is also about behavior and tone. So both can be true at
once: a role changes how the model answers, and leaves how often it's right
about the same.

## Where it gets tricky

**Nobody has measured the tone effect well.** The accuracy side has careful
studies. The "it changes tone and focus" side is mostly vendor advice and
the study authors' own caveat. If tone is why you're adding a role, check it
on your own outputs.

**No study here tested Claude.** The 2023 study used open models. The 2025
one used OpenAI and Google models. The result has held across both, but
it's an assumption for any model not tested.

## What this means when you build

- Use a role to set voice, audience and focus, not to make answers more
  correct.
- Don't expect "you are a world-class expert" to fix wrong answers. Better
  context, examples or a stronger model are the levers for that.
- Keep roles broad enough for the questions you'll get. A narrow role can
  cause refusals.
- Never give the model a low-knowledge persona for effect on a task that
  needs correct answers.
- If you keep a role, test the prompt with and without it on your own eval
  set.

## Further reading

- [When "A Helpful Assistant" Is Not Really Helpful](https://arxiv.org/abs/2311.10054),
  Zheng et al., 2023 (EMNLP Findings 2024). The big persona test: 162 roles,
  2,410 questions, no accuracy gain.
- [Playing Pretend: Expert Personas Don't Improve Factual Accuracy](https://arxiv.org/abs/2512.05858),
  Basil et al. (Wharton), 2025. The newer replication on hard benchmarks and
  reasoning models, with the refusal failure mode.
- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices),
  Anthropic docs. The case for roles as a way to set behavior and tone.
