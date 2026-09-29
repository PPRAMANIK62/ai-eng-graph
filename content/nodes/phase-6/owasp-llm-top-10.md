---
id: owasp-llm-top-10
title: What is the OWASP Top 10 for LLM apps?
depth: short
phase: 6
note: >-
  The standard checklist of security risks in LLM applications.
needs: [prompt-injection]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# What is the OWASP Top 10 for LLM apps?

The OWASP Top 10 for LLM applications is a ranked list of the ten security
risks that matter most when you build on a language model. It's written
by a community of developers and security people, it's openly licensed,
and it's a good checklist for a security review of your app. The current
edition came out on 2026-08-04, and it reordered the list more than
earlier editions did.

## The ten risks, 2026 edition

Each entry is one kind of failure, with examples, fixes and attack
scenarios. In one line each:

1. **Prompt injection.** Text the model reads changes what it does. See
   [[prompt-injection]].
2. **Sensitive information disclosure.** Private data gets out, through the
   answer but also through tool arguments, reasoning traces, logs,
   telemetry and embeddings. See [[pii-handling]].
3. **Excessive agency.** The agent can do more than its job needs, so a
   fooled model does real damage. See [[excessive-agency]].
4. **Supply chain.** A third-party model, dataset, adapter or other
   artifact has been tampered with or swapped.
5. **Data and model poisoning.** Someone plants bad behavior through data,
   at any stage from pretraining and [[fine-tuning]] to the documents in
   your [[rag|RAG]] index.
6. **Unbounded consumption.** No limits on usage, so attackers can take
   the service down, run up your bill, or copy the model by querying it.
7. **Misinformation.** The model is wrong in a believable way, and a
   person, a workflow or an agent acts on it. See [[hallucination]].
8. **Hidden context exposure.** Someone extracts what you put in the
   context but didn't show the user: the [[system-prompt]], tool schemas,
   retrieved policy text.
9. **Vector and embedding weaknesses.** Attacks through the similarity
   search that decides what the model sees: RAG, agent memory,
   [[semantic-caching|semantic caches]].
10. **Improper output handling.** Model output goes into other
    components and systems without being validated first.

One idea runs through all ten, and the project leads open the 2026
edition with it: stop trying to build a model that can't be fooled, and
build the system so that when it is fooled, nothing important breaks.

## What changed from 2025

The first version came out in 2023. The 2025 edition was released in
2024-11. For 2026 the order moved a lot:

![Bump chart of the OWASP Top 10 for LLM apps, 2025 rank on the left, 2026 rank on the right. Prompt injection and sensitive information disclosure stay first and second. Excessive agency climbs from 6 to 3. Unbounded consumption climbs from 10 to 6. Misinformation rises from 9 to 7. System prompt leakage, 7th in 2025, becomes hidden context exposure at 8. Supply chain, data and model poisoning, and vector and embedding weaknesses each drop one place. Improper output handling falls from 5 to 10.](img/owasp-llm-top-10-rank-changes.svg)

- **Excessive agency jumped from 6th to 3rd**, because agents with tools
  are where the damage is happening.
- **Unbounded consumption rose four places**, to 6th.
- **Improper output handling fell furthest**, from 5th to 10th.
- **System prompt leakage became hidden context exposure**, which covers
  everything hidden in the context. Assume all of it can be discovered,
  and never put credentials there.

Some newer attacks were folded into existing entries instead of getting
their own. Injection hidden in images or audio now sits under prompt
injection. Subverting a model through fine-tuning sits under poisoning.
Insecure code written by coding assistants sits under output handling.

## How the order is decided

Every edition before 2026 was ranked by a practitioner vote. The 2026
edition added data: a set of 7,714 real incidents from public
vulnerability databases and an AI-harm database, of which 6,639 had
enough detail to be sorted into categories. The vote counts for three
quarters of each rank and the incident data for one quarter.

The two didn't always agree, and the gaps are worth knowing:

- **Prompt injection** would fall out of the top 10 if you ranked only by
  public incidents. The project reads that as teams defending hard against
  it, so fewer clean exploits get published. It stays first.
- **Misinformation** was near the bottom of the vote but near the top of
  the incident record. The weighting pulled it up to the middle.

## Where it gets tricky

**It's a list for the model as a component.** Once a model has tools,
memory across sessions and acts on its own, OWASP moves the risk to a
separate list, the Top 10 for Agentic Applications (announced 2025-12-09).
Its entries include agent goal hijack, tool misuse, identity and privilege
abuse, memory and context poisoning, cascading failures and rogue agents.
The LLM list maps each of its entries to the agentic ones. If you're
building an agent, read both.

**Check which edition you're reading.** Older write-ups use the 2025
numbers, where excessive agency is LLM06 and output handling is LLM05. And
if a summary of the 2026 list gives a different order from the one above,
trust the project's own repository.

## What this means when you build

- Use the 2026 list for a security review, and walk every entry against
  your app, top to bottom.
- For each entry, ask what happens when it goes wrong, not only how to
  stop it. The list's own advice is to limit the damage a fooled model
  can do.
- If your app calls tools, add the Agentic Top 10.
- Treat anything in the prompt as readable by the user.

## Further reading

- [OWASP Top 10 for Large Language Model Applications (GitHub repository)](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10),
  OWASP GenAI Security Project, 2026. The official order, the full text of
  every entry, and the preface on method and what moved.
- [OWASP GenAI LLM Top 10 2026 (publication)](https://genai.owasp.org/resource/owasp-genai-llm-top-10-2026/),
  OWASP GenAI Security Project, 2026. The PDF, with the version history
  and the mapping to the Agentic Top 10.
