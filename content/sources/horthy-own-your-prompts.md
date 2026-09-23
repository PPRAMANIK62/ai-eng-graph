---
id: horthy-own-your-prompts
title: "12-Factor Agents, Factor 2: Own your prompts"
author: Dex Horthy (HumanLayer)
url: https://github.com/humanlayer/12-factor-agents/blob/main/content/factor-02-own-your-prompts.md
published: 2025-04-29        # page is undated; date of the file's first commit in the repo's git history (last change 2025-06-06)
accessed: 2026-09-23
kind: blog
primary: false
---

## Summary

A short essay from the "12-Factor Agents" guide arguing that you shouldn't let an agent framework write and hide your prompts. Frameworks that take `role`, `goal` and `personality` fields and build the prompt for you are a good start but hard to tune. Instead, write the prompt yourself as code, so you can test it, change it, and see exactly what the model gets.

## Key claims

- The rule. "Don't outsource your prompt engineering to a framework." (top)
- The pattern it argues against: an `Agent(role="...", goal="...", personality="...", tools=[...])` object that builds the prompt for you. That's "great for pulling in some TOP NOTCH prompt engineering to get you started, but it is often difficult to tune and/or reverse engineer to get exactly the right tokens into your model." (after first code block)
- The alternative. "own your prompts and treat them as first-class code" (before second code block)
- Its example is a typed function `DetermineNextStep(thread: string)` whose body is the full prompt text (system role, deployment rules, then the thread), written in BAML; "you can do this with any prompt engineering tool you want, or even just template it manually". (second code block)
- Benefits listed: "Full Control", "Testing and Evals: Build tests and evals for your prompts just like you would for any other code", "Iteration", "Transparency: Know exactly what instructions your agent is working with", and "Role Hacking". (Key benefits)
- Why it matters. "Your prompts are the primary interface between your application logic and the LLM." (end)
- Honest about uncertainty. "I don't know what's the best prompt, but I know you want the flexibility to be able to try EVERYTHING." (end)

## Visuals worth redrawing

- The contrast between the two code blocks: a framework `Agent(...)` object on the left, a plain prompt-as-function on the right. Could be redrawn as a two-panel "hidden prompt vs visible prompt" figure.

## My notes

- Secondary and opinionated (the author's company builds agent tooling; the example uses BAML, a third-party tool). Good for the argument, not for numbers.
- Agrees with OpenAI's move to deprecate hosted prompt objects (`openai-prompt-engineering`): both say the prompt should live in your code.
