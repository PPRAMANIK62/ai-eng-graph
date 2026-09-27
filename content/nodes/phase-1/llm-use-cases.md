---
id: llm-use-cases
title: What are LLMs good and bad at?
depth: deep
phase: 1
note: >-
  Good at turning messy text into structure, classifying, answering questions and running agents. Bad at anything that must give the same answer every time.
needs: [ai-engineer, next-token-prediction]
leads_to: [evals]
compare_with: []
updated: 2026-09-23
---

# What are LLMs good and bad at?

Before you build anything with an LLM, you have to decide whether an LLM
should be doing that job at all. They're very good at a wide range of
language work and weak in a few specific, predictable ways. Knowing both
halves is most of what separates a feature that ships from a demo that
breaks, and it's the first judgment call an [[ai-engineer]] makes.

## What one call can do

Take a sales email: "John Smith (john@example.com) is interested in our
Enterprise plan and wants to schedule a demo for next Tuesday at 2pm." One
call can turn that into a name, an email, a plan and a yes/no for "wants a
demo". No regexes, no training data, no rules for the hundred other ways a
person could have said the same thing.

That's the core strength. An LLM takes messy language in and gives back
something your software can use. Most useful features are a variation on
this:

- **Messy text to structure.** Pull fields out of emails, invoices, forms,
  transcripts. Getting reliable JSON back is covered in
  [[structured-output]].
- **Classifying.** Is this ticket billing or technical? Is this review
  angry? The answer is one label from a list.
- **Answering questions**, especially about text you give it.
- **Writing and rewriting.** Drafts, summaries, translations, changes in
  tone.
- **Running agents.** A model that calls tools in a loop until a goal is
  met, most successfully so far for coding and search.

Practitioners in 2024 summed up the first pattern well: accept anything in
natural language, send out only typed, machine-readable objects. It's the
most durable way to put an LLM inside a product.

## What people actually use them for

Chip Huyen's AI Engineering (2025) groups common generative AI use cases
into eight categories, each with consumer and enterprise versions:

| Category | Consumer examples | Enterprise examples |
|---|---|---|
| Coding | Coding | Coding |
| Image and video production | Photo and video editing, design | Presentations, ad generation |
| Writing | Email, social media and blog posts | Copywriting, SEO, reports and memos |
| Education | Tutoring, essay grading | Onboarding, upskill training |
| Conversational bots | General chatbot, AI companion | Customer support, product copilots |
| Information aggregation | Summarization, talk-to-your-docs | Summarization, market research |
| Data organization | Image search | Knowledge management, document processing |
| Workflow automation | Travel and event planning | Data extraction and entry, lead generation |

Real usage data adds numbers, and it depends a lot on whose users you look
at.

**Consumer ChatGPT, 2022-11 to 2025-07.** OpenAI's own study found that
three topics, practical guidance, seeking information and writing, make up
nearly 80% of conversations. Writing dominates work use. Programming is a
small share. Non-work use grew from 53% to over 70% of messages. By mid-2025
around 10% of the world's adults had used it.

**Claude, 2026-04 to 2026-06.** Anthropic's June 2026 report found that 93%
of chat and Cowork conversations produce a concrete output. The most common
are explanations (17%), documents and reports (15%) and guidance (11%). Code
and technical work make up about a sixth of those conversations, and
Claude Code, the coding agent, is counted separately. Personal use rises
from about 35% on weekdays to just under 50% on weekends.

## How usage has shifted

The list of what LLMs are "for" keeps moving. A rough timeline:

| When | What changed |
|---|---|
| 2022-11 | ChatGPT's consumer product launches. |
| 2024-06 | Practitioners call LLM apps brittle but very useful when tightly scoped. Their advice: keep the human in charge and prefer fixed, deterministic workflows over free-running agents. |
| 2024 | The cost of a given level of capability keeps falling fast: about $20 to under 10¢ per million tokens over four years, halving roughly every six months. |
| 2024-09 | OpenAI's o1 starts the [[reasoning-models]] wave, trained on problems with checkable answers like math and code. |
| 2025-02 | Claude Code is released. Coding agents, systems that write code, run it, look at the result and try again, become the year's breakout use. |
| 2025 | Agents become real for coding and search. By METR's measure, top models can complete, about half the time, software tasks that take people hours; 2024's best topped out under 30 minutes. |
| 2025-12 | Claude Code is credited with $1bn in run-rate revenue. |
| 2026-06 | Anthropic reports that Claude sessions are more and more long-running agentic tasks, where a year earlier most use was a chat conversation. |

![A timeline from 2022-11 to 2026-06. 2022-11: ChatGPT launches. 2024-06: practitioners call LLM apps brittle and advise fixed workflows with a human in charge. 2024-09: o1 starts the reasoning-model wave. 2025-02: Claude Code is released and coding agents take off. 2025-12: Claude Code is credited with $1bn run-rate revenue. 2026-06: Claude sessions are more and more long-running agentic tasks. Underneath, a band moves from chat, to fixed workflows with a human in charge, to agents.](img/llm-use-cases-timeline.svg)

So "good at running agents" is a 2025 addition. In mid-2024 the careful
advice was the opposite.

## What they're bad at

The weaknesses aren't random. Most come straight from how the model works:
it predicts the next token by picking from a probability list, again and
again (see [[next-token-prediction]]).

**Giving the same answer every time.** The pick is usually random, weighted
by probability (see [[sampling]]), so the same prompt gives different
answers. Turning [[temperature]] down to 0 should make it take the top
token every time, but on real servers it still varies. In a 2025 test,
1,000 runs of the same prompt at temperature 0 on an open model gave 80
different completions. They matched for the first 102 tokens, then split:
992 runs wrote "Queens, New York" and 8 wrote "New York City". The cause is that your request gets batched with other people's, and the
math comes out very slightly different at different batch sizes. So if
your feature needs the exact same output for the same input (billing,
legal text, anything audited), an LLM on a shared API is the wrong place to
produce it. Compute it in code, or cache the first answer and reuse it.

**Knowing when they don't know.** Models state false things confidently.
Practitioners in 2024 saw factual errors in 5 to 10% of outputs as a
baseline, and found it hard to get under 2% even for summaries. That's
[[hallucination]], and it has its own article.

**Staying quiet when there's nothing to say.** Ask a model to extract a
field that isn't in the document and it may return a value anyway. It will
also answer questions it shouldn't, unless you give it a clear way out.

**Long chains of steps (at least in 2024).** Each step an agent takes can
fail, and it's bad at recovering. The chance of finishing a multi-step task
drops fast as steps are added: if every step works 95% of the time, 20
steps in a row work only about 36% of the time. That was the core argument
for fixed workflows in 2024. Coding agents are built around a check at
every step: they write code, run it, look at the result and try again.

**Staying the same when the model changes.** A model upgrade can quietly
change behavior. One team saw a 10% drop on intent classification when
moving from one gpt-3.5-turbo snapshot to the next (0301 to 1106). Pin
model versions and re-test when you move.

**Cheap, narrow, high-volume tasks.** For a fixed classification task, a
small fine-tuned model can beat an LLM. One example from 2024: a 400M
parameter model, fine-tuned to spot hallucinations, reached ROC-AUC 0.84,
beating most LLMs at under 5% of the latency and cost. When the task is
narrow and you have labelled data, [[fine-tuning]] a small model is worth
comparing against.

![A two-column summary card. Reach for an LLM for: messy text to structure, classifying with a clear label set, answering from text you give it, drafting and rewriting, and agents with a built-in check such as code or search. Think twice when: the output must be identical every run, it must be factually right with no source given, it's a long chain with no check between steps, or it's a high-volume narrow classification task with labelled data.](img/llm-use-cases-reach-or-think-twice.svg)

## Where it gets tricky

**Usage studies describe their own users.** Consumer ChatGPT shows little
programming. Anthropic's reports show more code and agent work. Neither
is wrong. They measure different products and different people, and both
are companies reporting on their own product with automated classifiers.
Don't treat either as the list of what LLMs are for.

**The "bad at agents" advice aged fast.** The 2024 argument, that errors
compound across steps, is still true as arithmetic. What changed by 2025 is
that agents started working in practice, mostly in coding and search, where
the agent can check its own work as it goes by running the code or reading
the results. Where checking is hard, the 2024 advice still holds.

**"Same answer every time" can be fixed, at a cost.** The 2025 test above
also showed that with special batch-invariant math, all 1,000 runs matched.
But that needs control over the serving stack, which you don't have on a
hosted API, and it's slower: in their test, a batch of 1,000 completions
took 42 seconds instead of 26.
Also, "identical" isn't "correct": a deterministic model can repeat the
same wrong answer every time.

**Tightly scoped beats general.** The same practitioners who called LLM
apps brittle also said they're very useful when tightly scoped. Most
failures come from asking one call to do too much.

## What this means when you build

Before using an LLM for a feature, ask:

- **Is there one right answer that must never vary?** Then compute it in
  code, or at least cache and reuse the model's answer.
- **Can the output be checked?** By a schema, a test, a human, a source
  document. The easier the check, the more you can trust and automate.
- **Does it need facts the model might not have?** Give it the text; don't
  rely on what it remembers.
- **How many steps, and what happens when one fails?** Short fixed
  workflows first; agents where each step can be verified.
- **Is it narrow and high-volume?** Compare against a small fine-tuned
  model on cost and accuracy.
- **Whose usage data are you looking at, and when?** Advice from 2024 and
  numbers from one vendor's users both need a date and a context.

## Further reading

- [What We've Learned From A Year of Building with LLMs](https://applied-llms.org/),
  Yan, Bischof, Frye, Husain, Liu and Shankar, 2024. The practitioners' view
  in mid-2024: where LLM apps break, why they preferred fixed workflows,
  and when small models win.
- [AI Engineering: book repo and chapter summaries](https://github.com/chiphuyen/aie-book),
  Chip Huyen, 2025. The table of common use cases across consumer and
  enterprise apps.
- [How People Use ChatGPT](https://www.nber.org/papers/w34255),
  Chatterji et al. (OpenAI, Harvard), 2025. What consumers actually used
  ChatGPT for from launch to mid-2025.
- [Anthropic Economic Index report: Cadences](https://www.anthropic.com/research/economic-index-june-2026-report),
  Anthropic, 2026. What Claude conversations produce as of mid-2026, and
  the shift toward agentic use.
- [2025: The year in LLMs](https://simonwillison.net/2025/Dec/31/the-year-in-llms/),
  Simon Willison, 2025. A dated record of how reasoning models and coding
  agents changed what LLMs get used for.
- [Defeating Nondeterminism in LLM Inference](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/),
  Horace He (Thinking Machines Lab), 2025. Why the same prompt at
  temperature 0 still gives different answers, with the 1,000-run test.
