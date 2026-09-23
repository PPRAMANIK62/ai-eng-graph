---
id: openai-reasoning-guide
title: Reasoning models
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/guides/reasoning
published: 2026              # page is undated; it covers GPT-5.6 and GPT-6 models, so 2026
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

OpenAI's API guide to reasoning models as of 2026-09. Reasoning models produce hidden "reasoning tokens" before the visible answer. Those tokens take up context window space and are billed as output even though you never see them. You control how much the model thinks with `reasoning.effort`, can ask for a summary of the reasoning (never the raw tokens), and should leave plenty of room in `max_output_tokens` or risk paying for reasoning with no visible answer.

## Key claims

- What reasoning tokens are for. "Reasoning models use internal reasoning tokens before producing a response." (intro)
- Where they help. "Reasoning models work especially well for complex problem solving, coding, scientific reasoning, and multi-step agentic workflows." (intro)
- As of 2026-09 the recommended starting model is gpt-6-astra; gpt-5.6-terra and gpt-5.6-luna are cheaper. "Start with gpt-6-astra for most reasoning workloads." (intro)
- Effort control. "The reasoning.effort parameter guides the model on how much to think when performing a task." (Reasoning effort)
- Effort levels depend on the model: none, minimal, low, medium, high, xhigh, max. "Lower effort favors speed and lower token usage, while at higher effort the model thinks more completely to provide higher quality responses." (Reasoning effort)
- Models adjust on their own too. "The models also reason adaptively across reasoning efforts, using fewer tokens for simpler tasks and thinking harder for complex tasks." (Reasoning effort)
- gpt-5.5 defaults to medium effort; GPT-5.6 also defaults to medium. "gpt-5.5 defaults to medium reasoning effort." (Reasoning effort)
- The effort table: none for latency-critical tasks like voice and classification; medium as the default for most workloads; xhigh only when evals show a clear benefit. "Only use when your evals show a clear benefit that justifies the extra latency and cost." (Reasoning effort, xhigh row)
- Hidden but billed. "While reasoning tokens are not visible via the API, they still occupy space in the model’s context window and are billed as output tokens." (How reasoning works)
- How many: a few hundred to tens of thousands. "the models may generate anywhere from a few hundred to tens of thousands of reasoning tokens." (Managing the context window)
- The count is reported in usage under output_tokens_details. (Managing the context window)
- max_output_tokens caps reasoning plus visible output. "you can limit the total number of tokens the model generates, including reasoning tokens, visible output tokens, and non-visible formatting tokens" (Controlling costs)
- You can pay and get nothing: hitting the limit during reasoning returns an incomplete response. "This might occur before any visible output tokens are produced, meaning you could incur costs for input and reasoning tokens without receiving a visible response." (Managing the context window)
- Reserve 25,000 tokens to start. "OpenAI recommends reserving at least 25,000 tokens for reasoning and outputs when you start experimenting with these models." (Managing the context window)
- Raw reasoning is never shown; summaries are opt-in. "While we don’t expose the raw reasoning tokens emitted by the model, you can view a summary of the model’s reasoning using the summary parameter." (Reasoning summaries)
- Prompting advice for GPT-5 reasoning models. "Reasoning-capable GPT-5 models usually work best when you give them a clear goal, strong constraints, and an explicit output contract without prescribing every intermediate step." (Advice on prompting)

## Visuals worth redrawing

- No figure checked. Worth drawing our own: input → [hidden reasoning tokens] → visible output, with a bracket showing both reasoning and output billed as output and counted in max_output_tokens.

## My notes

- Undated living doc; model names (GPT-5.5, GPT-5.6, GPT-6 Astra/Sol/Luna) will change. Date every model-specific claim "as of 2026-09".
- Agrees with Anthropic's thinking docs (`anthropic-thinking`): thinking is billed as output, counts toward the output limit, and you only ever see a summary.
- The 25,000-token reserve is a starting guideline, not a rule.
- The candidates list says OpenAI's GPT-6 guidance drops temperature/top_p when reasoning is on; that's on another page (`openai-gpt6-model-guidance`), not this one.
