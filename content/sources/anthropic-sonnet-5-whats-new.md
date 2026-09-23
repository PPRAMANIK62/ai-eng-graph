---
id: anthropic-sonnet-5-whats-new
title: What's new in Claude Sonnet 5
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/models/sonnet-5/whats-new-sonnet-5
published: 2026              # page is undated; it names the computer_toolset_20260801 tool version, so 2026
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

Anthropic's launch notes for Claude Sonnet 5. For tokenization, the key fact is that Sonnet 5 ships a new tokenizer that turns the same text into about 30% more tokens than Sonnet 4.6, which changes token counts, how much text fits in the context window, `max_tokens` budgets and the real cost per request, even though the per-token price went down. The page also says Sonnet 5 rejects non-default `temperature`, `top_p` and `top_k` with a 400 error (needed for the later sampling articles).

## Key claims

- New tokenizer, about 30% more tokens for the same text than Sonnet 4.6. "The same input text produces approximately 30% more tokens than on Claude Sonnet 4.6." (New tokenizer)
- The 30% is an average; it varies by content. "The exact increase depends on the content." (New tokenizer)
- Nothing changes in the API shape, only the counts. "This is not an API change" (New tokenizer)
- Old token counts are no longer valid. "Don't reuse counts measured against earlier models; recount against Claude Sonnet 5." (New tokenizer, Token counts)
- The context window is the same number of tokens but holds less text. "each token covers less text on average, so the same window holds less text than on Claude Sonnet 4.6." (New tokenizer, Context window capacity)
- Output limits set for the old tokenizer may now cut answers short. "an output limit tuned for Claude Sonnet 4.6 may truncate equivalent output on Claude Sonnet 5." (New tokenizer, max_tokens budgets)
- Price per token dropped: $2/$10 per million input/output tokens, down from Sonnet 4.6's $3/$15. "Claude Sonnet 5 is priced at $2 per million input tokens and $10 per million output tokens" (Pricing)
- But a lower per-token price doesn't mean a proportionally cheaper request, because there are more tokens. "the cost of an equivalent request does not drop in direct proportion" (New tokenizer, Per-request cost; repeated in Pricing)
- Context window and output size: 1M tokens (no smaller variant) and 128k max output tokens. "1M tokens is both the default and the maximum" (New model)
- Sampling parameters (for the `temperature`/`top-p` articles): any non-default `temperature`, `top_p` or `top_k` returns a 400 error. "Remove these parameters when migrating; the default value (or omitting the parameter) is accepted." (Behavior changes, Sampling parameters not accepted)
- The same lock came earlier on Opus, and the docs point to prompting instead. "the same constraint was previously introduced on Claude Opus 4.7." and "Use system-prompt instructions to guide model behavior." (Behavior changes, Sampling parameters not accepted)
- `max_tokens` also covers thinking, and thinking is on by default on Sonnet 5. "is a hard limit on total output (thinking plus response text)" (Behavior changes, Adaptive thinking on by default)

## Visuals worth redrawing

- No diagrams on the page. Worth making our own: two bars for the same prompt, "Sonnet 4.6 tokenizer: N tokens" vs "Sonnet 5 tokenizer: ~1.3N tokens", with the price per million under each, to show why per-token price and per-request cost move differently.

## My notes

- My arithmetic, not from the page: if a prompt was N tokens on Sonnet 4.6 and is about 1.3N on Sonnet 5, input costs 1.3 × $2 = $2.60 per "old million" vs $3 (about 13% cheaper, not 33%), and output 1.3 × $10 = $13 vs $15. Only valid when the increase is exactly 30%; the page says it varies. Better: measure a real prompt with the token counting endpoint on both models and report that.
- The page doesn't say why the tokenizer changed, how big the new vocabulary is, or which content grows more or less. Don't guess.
- The page compares only with Sonnet 4.6. The token counting doc (`anthropic-token-counting`) says the same tokenizer arrived with Opus 4.7 and is shared by the Fable and Mythos 5.x models.
- Undated page. The 2026 year comes from the `computer_toolset_20260801` tool version named on it. The launch date isn't shown.
- Sampling section matches `_candidates.md`: "Claude no longer lets you set sampling parameters." Useful for the `temperature` and `top-p` nodes.
