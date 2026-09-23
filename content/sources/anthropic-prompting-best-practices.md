---
id: anthropic-prompting-best-practices
title: Prompting best practices
author: Anthropic (Claude API docs)
url: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
published: undated           # no date on the page; covers models up to Claude Fable 5.1 and Opus 5.5, so current as of 2026-09
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

Anthropic's single reference page for prompting current Claude models (it replaced the older one-page-per-technique docs). The general principles cover being clear and explaining why, examples (3–5, relevant, diverse, wrapped in `<example>` tags), XML tags to separate the parts of a prompt, giving Claude a role in the system prompt, and putting long documents before the question. It also covers output formatting, thinking, and moving away from prefill.

## Key claims

- Scope: written for current models. It lists Claude Fable 5.1, Mythos 5.1, Fable 5, Mythos 5, Opus 5.5, Opus 5, Opus 4.8, Opus 4.7, Opus 4.6, Sonnet 5, Sonnet 4.6 and Haiku 4.5. (intro)
- Model-specific advice should be re-checked. "Where a technique names a specific model, treat it as measured on that model and re-check it against your own evals before applying it to another." (General principles)
- Be explicit. "Think of Claude as a brilliant but new employee who lacks context on your norms and workflows." (Be clear and direct)
- Golden rule. "Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too." (Be clear and direct)
- Explain why. "NEVER use ellipses" works worse than giving the reason (text-to-speech can't pronounce them). "Claude is smart enough to generalize from the explanation." (Add context to improve performance)
- Examples steer strongly. "Examples are one of the most reliable ways to steer Claude's output format, tone, and structure." (Use examples effectively)
- What good examples look like: relevant ("Mirror your actual use case closely"), diverse ("Cover edge cases and vary enough that Claude doesn't pick up unintended patterns"), structured ("Wrap examples in `<example>` tags (multiple examples in `<examples>` tags) so Claude can distinguish them from instructions"). (Use examples effectively)
- How many. "Include 3–5 examples for best results." Claude can also check or extend your set: "ask Claude to evaluate your examples for relevance and diversity, or to generate additional ones based on your initial set." (Use examples effectively, Tip)
- XML tags separate parts of a prompt. "XML tags help Claude parse complex prompts unambiguously, especially when your prompt mixes instructions, context, examples, and variable inputs." Tags like `<instructions>`, `<context>`, `<input>` reduce "misinterpretation". (Structure prompts with XML tags)
- Tag hygiene. "Use consistent, descriptive tag names across your prompts." and "Nest tags when content has a natural hierarchy (documents inside `<documents>`, each inside `<document index="n">`)." (Structure prompts with XML tags)
- Roles. "Setting a role in the system prompt focuses Claude's behavior and tone for your use case. Even a single sentence makes a difference" — example system prompt: "You are a helpful coding assistant specializing in Python." (Give Claude a role)
- Long documents first, question last. For 20k+ token inputs, "Place your long documents and inputs near the top of your prompt, above your query, instructions, and examples." and "Queries at the end can improve response quality by up to 30 percent in tests, especially with complex, multidocument inputs." (Long context prompting)
- Multi-document layout: `<documents>` → `<document index="1">` → `<source>` and `<document_content>`. (Long context prompting, example)
- Tags can also shape output. "Write the prose sections of your response in <smoothly_flowing_prose_paragraphs> tags." And prompt style leaks into output: "removing markdown from your prompt can reduce the volume of markdown in the output." (Control the format of responses)
- Examples with thinking. "Use `<thinking>` tags inside your few-shot examples to show Claude the reasoning pattern. It will generalize that style to its own extended thinking blocks." (Leverage thinking)
- General beats prescriptive for thinking. "A prompt like "think thoroughly" often produces better reasoning than a hand-written step-by-step plan." (Leverage thinking)
- Prefill is gone from Claude 4.6 on; for classification, use "tools with an enum field containing your valid labels or structured outputs." (Migrating away from prefilled responses)

## Visuals worth redrawing

- The multi-document XML layout (Long context prompting) as an annotated prompt: documents block on top, instructions and question at the bottom. Good for the xml-tags article.

## My notes

- Undated, and the model list will change. Date the model-specific claims.
- "Up to 30 percent" is Anthropic's own internal test with no details (task, model, baseline). Say "in Anthropic's tests".
- "Even a single sentence makes a difference" for roles is about behavior and tone. It doesn't claim accuracy gains. The persona papers (`zheng-personas-system-prompts`, `basil-expert-personas`) test accuracy and find none. Different claims; they don't directly conflict.
- "3–5 examples" vs OpenAI's "try zero-shot first" for reasoning models (`openai-reasoning-best-practices`): Anthropic says examples work with thinking; OpenAI says reasoning models often don't need them. Both are vendor advice without published numbers.
- No evidence given that XML beats other delimiters; it's a Claude convention, and OpenAI also recommends XML plus Markdown.
