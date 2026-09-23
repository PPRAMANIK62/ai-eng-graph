---
id: xml-tags
title: Why use XML tags in prompts?
depth: short
phase: 1
note: >-
  Wrapping parts of the prompt in tags so the model can tell instructions from data.
needs: [system-prompt]
leads_to: []
compare_with: []
status: review
updated: 2026-09-23
---

# Why use XML tags in prompts?

A real prompt mixes things: your instructions, a document to work on, a few
examples, the user's question. To the model it's all one stream of text.
XML tags draw lines around each part, so the model can tell what you're
asking from what it's reading.

## The problem: everything is text

Say you ask for a summary of a support email, and the email ends with
"Please reply in French." Is that an instruction for the model, or part of
the email you want summarized? In a flat prompt, the model has to guess.

Tags remove the guess:

```xml
<instructions>
Summarize the customer email below in two sentences, in English.
</instructions>

<email>
Hi, my order #4411 arrived broken... Please reply in French.
</email>
```

Now "reply in French" is clearly inside the email. It's something the
customer said, not something you asked for.

![The same prompt drawn twice. On the left, the instruction and the customer email run together in one grey block, and it's unclear whether "Please reply in French." is an order or part of the email. On the right, the instruction sits inside instructions tags and the email inside email tags, so the French line is plainly part of the email.](img/xml-tags-boundaries.svg)

## How to tag a prompt

The tag names are yours to choose. What matters, going by the 2026-09
guidance from Anthropic and OpenAI:

- **One tag per kind of content.** `<instructions>`, `<context>`,
  `<examples>`, `<input>`. Anthropic recommends tags most when a prompt
  mixes instructions, context, examples and variable inputs.
- **Descriptive names, used consistently.** Pick `<email>` and keep calling
  it that across your prompts.
- **Nest when there's a hierarchy.** Several documents go inside
  `<documents>`, each in `<document index="1">`, with its `<source>` and
  `<document_content>` inside.
- **Attributes for metadata.** An `id` or `index` lets your instructions
  point at "document 2" or "example-1".

For long inputs (Anthropic's threshold is 20k+ tokens), put the tagged
documents at the top and your question at the end. In Anthropic's own tests,
ending with the question improved answer quality by up to 30%, most on
complex, multi-document inputs.

```xml
<documents>
  <document index="1">
    <source>annual_report_2023.pdf</source>
    <document_content>{{ANNUAL_REPORT}}</document_content>
  </document>
</documents>

Using the annual report, list the three biggest risks.
```

Tags work on the output side too. You can ask for the answer inside a
named tag, such as `<summary>`, which also makes it easy to pull out in
code.

## It's not only a Claude thing

XML tags are best known from Anthropic's docs, but OpenAI's prompting guide
recommends a mix of Markdown and XML too: Markdown headings for the sections
of your instructions, XML to mark where a piece of content starts and ends.
XML is one good way to mark boundaries. Markdown headings are another.

## Where it gets tricky

**Tags don't make injected text safe.** Wrapping a web page in `<document>`
tags helps the model treat it as data. OpenAI's Model Spec (2026-08-18)
asks developers to put untrusted input in XML, JSON or YAML for exactly
this reason: without it, injected instructions can be very hard for the
model to tell apart from yours. But a tag is still just text, and someone
can write `</document>` inside the document. Tags lower the risk. They
don't remove it. See
[[system-prompt]] for why the model's sense of priority is soft.

**Nobody here shows XML beats other delimiters.** The advice comes from
vendor docs, and none of them compares XML against Markdown headings or
JSON in a controlled test. What the guides agree on is clear boundaries,
used consistently.

**Your prompt's style leaks into the answer.** The formatting of your
prompt can shape the formatting of the reply: taking Markdown out of a
prompt tends to reduce the Markdown in what comes back.

## What this means when you build

- Tag any prompt that mixes instructions with content you didn't write.
- Put user input and retrieved documents inside tags, and say in your
  instructions that tagged content is data.
- Keep tag names stable across prompts, so your code and your examples stay
  in sync.
- Don't rely on tags for security. Validate what the model is allowed to do
  in code.

## Further reading

- [Prompting best practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices),
  Anthropic docs. How to tag, nest and order a prompt, including the
  long-document layout.
- [Prompt engineering](https://developers.openai.com/api/docs/guides/prompt-engineering),
  OpenAI docs. The Markdown-plus-XML approach and a standard layout for
  instructions.
- [OpenAI Model Spec (2026-08-18)](https://model-spec.openai.com/2026-08-18.html),
  OpenAI. Why untrusted input should be wrapped in XML, JSON or YAML, and
  why that alone isn't enough.
