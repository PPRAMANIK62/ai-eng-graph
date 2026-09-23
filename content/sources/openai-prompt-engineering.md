---
id: openai-prompt-engineering
title: Prompt engineering
author: OpenAI (API docs)
url: https://developers.openai.com/api/docs/guides/prompt-engineering
published: undated           # no date on the page; examples use gpt-6-astra and it names 2026 deprecation dates
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

OpenAI's general prompting guide. It covers message roles (`developer` ranks above `user`), formatting prompts with Markdown and XML, a standard layout for a developer message (Identity, Instructions, Examples, Context), and few-shot examples. It also tells you to keep production prompts in your own code: reusable prompt objects in the API are being deprecated, with `v1/prompts` shutting down on 2026-11-30. It recommends pinning model snapshots and building evals.

## Key claims

- Deprecation. "OpenAI is deprecating reusable prompt objects in the API. Prompt creation will be de-emphasized beginning June 3, 2026, and v1/prompts is scheduled to shut down on November 30, 2026." (Version prompts in code)
- Keep prompts in code. "Store production prompts in your application code instead of creating reusable prompt objects. Code-managed prompts let you use typed inputs, code review, tests, and your normal deployment process to change model behavior." (Version prompts in code)
- How to organize them: "Keep prompt builders in a small module near the feature they support." "Use typed function arguments or schemas for dynamic values such as customer data, files, or task options." "Add representative fixtures, tests, and evaluation checks before changing production prompts." "Roll out prompt changes through your deployment system, using feature flags or configuration when you need staged releases." (Version prompts in code)
- Existing saved prompts: use "the prompt object migration guide to move that prompt into code." (Version prompts in code)
- Snapshots behave differently. "Even different snapshots of models within the same family could produce different results." (intro)
- Pin and test. "Pinning your production applications to specific model snapshots (like gpt-4.1-2025-04-14 for example) to ensure consistent behavior" and "Building tests and evaluation suites that measure prompt behavior so you can monitor performance as you iterate, or when you change and upgrade model versions" (intro)
- Roles rank. "developer messages are instructions provided by the application developer, prioritized ahead of user messages." (Message roles and instruction following)
- Analogy. "You could think about developer and user messages like a function and its arguments in a programming language." (Message roles and instruction following)
- `instructions` is a shortcut for a developer message: `instructions: "Talk like a pirate."` with `input: "Are semicolons optional in JavaScript?"` equals a `developer` message plus a `user` message. (Message roles and instruction following, example)
- Markdown and XML. "you can help the model understand logical boundaries of your prompt and context data using a combination of Markdown formatting and XML tags." (Message formatting with Markdown and XML)
- What XML is for. "XML tags can help delineate where one piece of content (like a supporting document used for reference) begins and ends. XML attributes can also be used to define metadata about content in the prompt that can be referenced by your instructions." (Message formatting with Markdown and XML)
- Developer message layout: Identity ("Describe the purpose, communication style, and high-level goals of the assistant."), Instructions, Examples, Context, "usually in this order (though the exact optimal content and order may vary by which model you are using)". (Message formatting with Markdown and XML)
- Few-shot definition. "Few-shot learning lets you steer a large language model toward a new task by including a handful of input/output examples in the prompt, rather than fine-tuning the model." and "try to show a diverse range of possible inputs with the desired outputs." (Few-shot learning)
- Example format: product reviews labelled Positive/Negative/Neutral, each example wrapped as `<product_review id="example-1">...</product_review>` and `<assistant_response id="example-1">Positive</assistant_response>`, inside the developer message. (Few-shot learning)
- Reasoning vs GPT models. "reasoning models will provide better results on tasks with only high-level guidance. This differs from GPT models, which benefit from very precise instructions." (Prompting reasoning models)

## Visuals worth redrawing

- The developer-message layout (Identity → Instructions → Examples → Context) as a labelled prompt skeleton.

## My notes

- The deprecation is the strongest provider-backed argument for prompts-as-code: the vendor itself removed hosted prompt objects. Dates: de-emphasis from 2026-06-03, `v1/prompts` shutdown 2026-11-30. The page says to check its deprecations page for the current timeline; I didn't open that page.
- The model snapshot example (`gpt-4.1-2025-04-14`) is old; the point is the practice.
- XML advice here matches Anthropic's (`anthropic-prompting-best-practices`), so XML tags aren't a Claude-only habit.
