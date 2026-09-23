---
id: anthropic-token-counting
title: Token counting
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/build-with-claude/token-counting
published: undated           # the page shows no date or year; current as of the access date (examples use claude-opus-5-5)
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

Anthropic's docs for the free `count_tokens` endpoint, which tells you how many input tokens a request will use before you send it. It says the count is an estimate, that models from Claude Opus 4.7 onward use a newer tokenizer giving about 30% more tokens than earlier models, and that counts should always be taken with the model you'll actually use. It gives concrete counts for example requests (text, tools, image, PDF).

## Key claims

- What it's for: count tokens before sending, to manage cost, rate limits and prompt length. "Token counting lets you determine the number of tokens in a message before you send it to Claude." (intro)
- It takes the same input as a real request (system prompt, tools, images, PDFs) and returns a total. "The response contains the total number of input tokens." (How to count message tokens)
- Example counts on `claude-opus-5-5`: system "You are a scientist" plus user "Hello, Claude" is 14 tokens; one `get_weather` tool definition plus a one-line question is 403; an image plus "Describe this image" is 1028; a short thinking conversation is 88; a PDF plus "Please summarize this document." is 2188. The docs point to these counts for fitting prompts: "Use token counts to keep prompts within a model's context window." (Output blocks under each example; quote from Next steps)
- The count is an estimate. "In some cases, the actual number of input tokens used when creating a message might differ by a small amount." (How to count message tokens, note)
- Anthropic may add hidden system tokens; you don't pay for them. "Billing reflects only your content." (How to count message tokens, note)
- Newer tokenizer from 4.7 on, about 30% more tokens. "Claude 4.7 and later models and Claude Mythos Preview use a newer tokenizer." (Supported models, note)
- Varies by content, so recount per model. "Recount prompts against the model you plan to use rather than reusing counts measured against earlier models." (Supported models, note)
- Current Fable and Mythos models share that tokenizer, so a prompt counts the same on all of them. "share the tokenizer introduced with Claude Opus 4.7" (Token counts on Claude Fable and Claude Mythos models)
- How to measure the change for your own prompts. "count the same request twice, once with your current model and once with the model you plan to move to" (Token counts on Claude Fable and Claude Mythos models)
- Billing follows the new counts. "Usage and billing on these models reflect this tokenizer's counts." (Token counts on Claude Fable and Claude Mythos models, note)
- Free, with its own rate limits (5,000 / 10,000 / 20,000 requests per minute for the Start / Build / Scale tiers). "free to use" (Pricing and rate limits); "Token counting and message creation have separate and independent rate limits." (Pricing and rate limits, note)
- Some inputs can't be counted here (server tools like web search, the MCP connector, images or PDFs given by URL or file id). "Send images and PDFs as base64 to count them." (How to count message tokens)

## Visuals worth redrawing

- No diagrams. The example counts make a nice small table for the article: text only 14, with one tool 403, with one image 1028, with a PDF 2188. It shows that tools, images and documents dominate token use, not the chat text.

## My notes

- Wording differs from the Sonnet 5 page. This page says "Claude 4.7 and later models" in one note and "models before Claude Opus 4.7" in another; the Sonnet 5 page compares against Sonnet 4.6. They fit together: the new tokenizer came with Opus 4.7, and Sonnet 5 is the first Sonnet on it. Say "from Opus 4.7 on" in the article.
- The example counts are for `claude-opus-5-5` and will change with other models. They're good for relative size (a tool definition is ~30x a short greeting), not as fixed numbers.
- The page gives no characters-per-token rule for Claude. The ~4 bytes per token figure is OpenAI's (`openai-tiktoken`) and is for OpenAI tokenizers; don't apply it to Claude, especially after the 30% change.
- Anthropic doesn't publish its tokenizer, unlike OpenAI's open-source tiktoken. Counting Claude tokens means calling this endpoint (it needs an API key). That's a real difference between model families worth one line in the article.
- No date anywhere on the page, so `published` is left undated.
- Also in the source: No prompt caching in counting. "No, token counting provides an estimate without using caching logic." (FAQ)
