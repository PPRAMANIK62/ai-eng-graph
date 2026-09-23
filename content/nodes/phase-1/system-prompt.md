---
id: system-prompt
title: What is a system prompt?
depth: short
phase: 1
note: >-
  Instructions that sit above the conversation and set the model's job. A priority signal, not a security boundary.
needs: [chat-api]
leads_to: [role-prompting, xml-tags, prompts-as-code]
compare_with: []
status: review
updated: 2026-09-23
---

# What is a system prompt?

The system prompt is where you, the developer, tell the model what its job
is. It sits above the conversation, applies to every turn, and the model is
trained to rank it higher than what the user types. That ranking is real but
soft: it makes the model more likely to follow you, and it can still be
talked out of it.

## Where it goes in the request

A [[chat-api]] call is a list of `user` and `assistant` messages. The
system prompt goes next to that list, not inside it. On Claude it's a
top-level field:

```json
{
  "model": "claude-opus-5-5",
  "max_tokens": 1024,
  "system": "You answer questions about our billing API. Keep answers under 100 words.",
  "messages": [
    {"role": "user", "content": "How do I get a refund?"}
  ]
}
```

Your end users don't write it. Your app sends the same system prompt with
every call, while the messages change.

Two details that vary by provider:

- **On OpenAI, it's called the developer message.** In OpenAI's scheme,
  "system" is the level for OpenAI's own rules. Your instructions as an app
  builder sit one level down, at "developer". Same job, different word.
- **Newer Claude models accept a system message mid-conversation.** As of
  2026-09, Opus 4.8, Opus 5, Opus 5.5 and the 5-series Fable and Mythos
  models let you add a `"role": "system"` message after a user turn, with the
  same authority as the top-level field. It can't be the first message. Use
  the top-level field for rules that apply from the start, and a mid-chat
  one for rules that only matter later. Adding it at the end also keeps the
  cached start of the conversation valid.

## Higher rank, not a wall

The point of a system prompt is priority. When your instructions and the
user's disagree, yours should win.

OpenAI writes this down as a chain of command, as of its 2026-08-18 Model
Spec:

| Level | Who sets it | Can be overridden by |
|---|---|---|
| Root | The spec itself | Nothing |
| System | OpenAI | Root |
| Developer | You, the app builder | Root, system |
| User | The person chatting | Developer, system, root |
| Guideline | Defaults | Anyone, even implicitly |

Text that arrives as data, such as quoted text, file attachments, tool
outputs and images, gets no authority by default. It's information to use,
not orders to follow.

![The chain of command from OpenAI's Model Spec as a ladder of five levels, from top to bottom: root (the spec itself), system (OpenAI), developer (you, the app builder), user (the person chatting) and guideline (defaults). Each level can be overridden only by the levels above it. Beside the ladder, a separate box for data such as quoted text, files, tool outputs and images, marked as having no authority by default.](img/system-prompt-chain-of-command.svg)

The catch is that this ranking is learned behavior. The API doesn't enforce
it. In 2024, OpenAI researchers found that models often treated the system
prompt as no more important than text from users or third parties. That's
the weakness prompt injection exploits: someone slips "ignore your previous
instructions" into a message or a document, and the model may obey. Their fix
was training. They generated examples of conflicting instructions and taught
GPT-3.5 to ignore the lower-ranked ones. Robustness went up sharply, even
against attacks it hadn't seen in training, with little cost to normal
performance.

Sharply better is still not immune. OpenAI's own spec says its production
models don't fully match the spec yet.

## Where it gets tricky

**It's not a place for secrets.** The Model Spec asks the model to keep the
exact text of system and developer messages private by default, while
sharing basics like its identity, abilities and tools. That's a behavior
target, and models don't fully meet their targets. Assume a determined user
can get your system prompt out. Keep API keys and anything else sensitive
out of it.

**It's not a security boundary.** If a tool call or a user message can
trigger something harmful, "the system prompt says not to" isn't a control.
Put the real checks in your code: permissions, validation, limits.

## What this means when you build

- Put the model's job, rules and output format in the system prompt, and
  keep user input in `messages`.
- Treat it as a strong hint. Enforce anything that matters outside the model.
- Keep untrusted content (documents, web pages, tool results) clearly
  marked as data. [[xml-tags]] are one way to do that.
- The system prompt is where a persona usually goes; whether that helps is
  its own question, covered in [[role-prompting]].
- It's the most important string in your app, so version and test it like
  code: see [[prompts-as-code]].

## Further reading

- [Using the Messages API](https://platform.claude.com/docs/en/build-with-claude/working-with-messages),
  Anthropic docs. The top-level `system` field and the newer mid-conversation
  system messages.
- [OpenAI Model Spec (2026-08-18)](https://model-spec.openai.com/2026-08-18.html),
  OpenAI. The chain of command, how data is treated, and what the model
  should keep private.
- [The Instruction Hierarchy](https://arxiv.org/abs/2404.13208), Wallace et
  al., 2024. Why models used to treat system prompts and user text the same,
  and the training fix.
