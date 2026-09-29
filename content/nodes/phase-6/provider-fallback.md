---
id: provider-fallback
title: What is provider fallback?
depth: short
phase: 6
note: >-
  Switching to a second model or provider when the first one fails.
needs: [retries]
leads_to: []
compare_with: [model-upgrades]
updated: 2026-09-29
---

# What is provider fallback?

Provider fallback means that when a call to your main model fails, your
app sends the same request somewhere else instead of giving up: the same
model through another provider, or a different model altogether. It keeps
your feature working through an outage or a rate limit. The price is that
the answer may come from a model you tested less, cost more, and arrive
slower.

## A chain of backups, tried in order

A [[retries|retry]] sends the same request to the same place again. A
fallback changes where it goes. You list backups in order, and the first
one that succeeds answers.

Gateways such as Vercel's AI Gateway and OpenRouter do this for you. In
Vercel's version, as of 2026-09, there are two levels:

1. **Providers for one model.** Many models are served by more than one
   company. You can ask for `openai/gpt-6-astra` through Azure first, then
   through OpenAI itself.
2. **Other models.** If every provider for the first model fails, the
   gateway moves to the next model in your list, and tries its providers
   the same way.

![A fallback chain in an AI gateway. The request goes to the primary model, gpt-6-astra, first through Azure, then through OpenAI. If both fail, it goes to a second model, gpt-5.4-nano, through Azure then OpenAI. If those fail too, it goes to claude-opus-5 through any available provider. The first success answers the request, and the response metadata lists every attempt. Below, what can trigger a fallback: downtime, rate limits, context-length errors, and moderation refusals.](img/provider-fallback-chain.svg)

The response comes from the first model and provider pair that worked. The
gateway records every attempt, with its error, in the response metadata,
so you can see that a fallback happened and why. On OpenRouter you're
billed for the model that actually answered, and its name comes back in
the response.

## What triggers it

By default on OpenRouter, any error from the first model triggers the next
one. That includes the obvious ones:

- **Downtime** at the provider.
- **Rate limits**, when you've used up your [[rate-limits|limit]] on one
  model or provider.

And two you might not expect:

- **Context-length errors.** If the prompt is too long for the first
  model, a model with a bigger window can take it.
- **Moderation refusals.** If a provider refuses to answer, the next model
  gets the same request.

That last one is a policy choice as much as an engineering one. A request
one provider refused on safety grounds will quietly go to another. Decide
whether you want that, instead of inheriting the default.

## Where it gets tricky

**A fallback model is a different product.** It answers differently,
follows your prompt differently, and may fail your evals. The gateway docs
explain the mechanics, but none measure how much quality drops when a
fallback kicks in. Test your prompts and [[evals]] on every model in the
chain, the same way you'd test a [[model-upgrades|model upgrade]]. Falling
back to a stronger, pricier model has the opposite problem: a surprise on
the bill.

**The cache doesn't come along.** A [[prompt-caching|prompt cache]] belongs
to one model. When a request with a long, cached prompt falls back to
another model, that model starts cold: it reads the whole prompt at full
price and full prefill time. The Claude Code team found that even
switching between two models from the same provider, 100,000 tokens into a
conversation, cost more than staying on the pricier model. So a fallback
on a long agent conversation is slower and more expensive than the same
call on the primary, just when things are already going wrong.

**Fallbacks multiply with retries.** A gateway that tries three models,
behind an SDK that retries, behind your own retry loop, can turn one
request into dozens of calls during an outage. Count fallbacks as part of
your retry budget, and decide which layer owns what.

**You have to look to know it happened.** Failover is automatic and
silent unless you read the metadata. If you don't log which model
answered, a week of traffic on the backup looks like a week of traffic on
the primary, and so do its costs and errors.

## What this means when you build

- Fall back across providers for the same model first. It changes the
  least.
- Keep the model list short, and run your eval set on every model in it.
- Log the model and provider that answered every request, and alert when
  the fallback rate rises.
- Decide on purpose which errors should trigger a fallback, especially
  moderation refusals and context-length errors.
- Expect a cold cache on the backup model. For long agent sessions,
  waiting and retrying the primary can be cheaper than switching.
- Count fallback attempts together with retries so an outage can't
  multiply your traffic.

## Further reading

- [AI Gateway Model Fallbacks](https://vercel.com/docs/ai-gateway/models-and-providers/model-fallbacks),
  Vercel docs, updated 2026-09-10. Provider order within a model, then the
  next model, and the attempt log in the response metadata.
- [Model Fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks),
  OpenRouter docs. Which errors trigger a fallback, and how billing works.
- [Lessons from building Claude Code: Prompt caching is everything](https://claude.dev/blog/lessons-from-building-claude-code-prompt-caching-is-everything/),
  Thariq Shihipar (Anthropic), 2026. Why the cache belongs to one model,
  and why switching models mid-session costs more than it looks.
