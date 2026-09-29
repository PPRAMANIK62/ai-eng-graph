---
id: pii-handling
title: How do you handle personal data in LLM apps?
depth: short
phase: 6
note: >-
  Keeping personal data out of prompts, logs and training data where it doesn't belong.
needs: [llm-tracing]
leads_to: []
compare_with: [guardrails]
updated: 2026-09-29
---

# How do you handle personal data in LLM apps?

Users type personal data into LLM apps all the time: names, emails, phone
numbers, card numbers, account details. Each copy of that text can end up
in three places you control or choose: the model provider, your traces and
logs, and any dataset you build from them. Handling PII means deciding, for
each place, what goes in, what gets masked, and how long it stays.

## Follow one message

A user writes: "Hi, I'm Priya Shah, my card 4111 1111 1111 1111 was charged
twice." Here's where that sentence goes:

1. **Into the prompt.** Your app sends it to the model provider.
2. **Into your traces.** If you capture messages in [[llm-tracing]], the
   trace store now holds her name and card number.
3. **Into later datasets.** Traces become eval cases and examples to
   review, so the same text can spread further.

![One user message with a name and a card number, and the three places it can go: to the model provider in the prompt, where retention depends on the provider's policy; to your trace store, where a masking function can replace the card number with a placeholder before export; and on into eval sets built from traces. The mask protects the trace, not what the provider received.](img/pii-handling-flow.svg)

## Keep it out of traces by default

The OpenTelemetry conventions for LLM spans leave the prompt and the reply
off by default. Capturing them is opt-in, because they're likely to hold
users' personal data. Token counts, model, timing and cost don't need the
text at all.

When you do capture messages, mask them before they leave your app.
Tracing SDKs such as Langfuse's take a masking function that runs on your
side, at export time, over inputs, outputs and metadata. A simple version
is a regex: anything that looks like 13 to 19 digits becomes
`[REDACTED CREDIT CARD]`, and the same for emails and phone numbers. Keep
the function fast, because it runs on every export, and make sure it can't
throw: if it does, Langfuse drops the whole batch of traces.

## Finding PII is harder than it looks

Regexes catch things with a shape, like card numbers and emails. They miss
"Priya Shah". For names, places and ID numbers you need a detector.
Presidio, an open-source toolkit started at Microsoft and now community-run
under the Data Privacy Stack, combines named-entity recognition, regexes,
rules and checksums, using the surrounding words as context. Its anonymizer
then replaces, redacts, masks, hashes or encrypts what it found.

Even Presidio's own docs warn that automated detection has no guarantee of
finding everything, and that you need other protections too. Treat
detection as one layer. The other layers are capturing less, restricting
who can read traces, and deleting old ones.

## What the provider keeps

Masking your traces doesn't change what you sent the model. That's set by
the provider's data policy, and it differs by provider. For example, as of
2026-09, OpenAI doesn't train on API data unless you opt in, keeps
abuse-monitoring logs for up to 30 days by default, and offers Zero Data
Retention, which keeps your content out of those logs, only with its
approval. If you use stored conversations there (`store` on the Responses
API), those are kept for at least 30 days. Check the policy of every
provider you send data to, including any [[provider-fallback|fallback provider]].

## Where it gets tricky

**Masking can break the feature.** If the user asks "did you charge card
ending 1111?", masking the prompt before the model sees it removes what it
needs. Masking the trace is usually safe. Masking the prompt means
checking, feature by feature, what the model still needs to see.

**Other exporters don't get your mask.** A masking hook on one tracing SDK
only cleans what that SDK sends. If spans also go to another backend, they
go unmasked. With plain OpenTelemetry, mask in the collector so every
backend gets the cleaned copy.

## What this means when you build

- Leave message capture off until you need it, then turn it on with a mask.
- Mask shapes with regexes and names with a detector, and assume some will
  slip through.
- Limit who can read traces, and set a retention period.
- Read each provider's retention policy before sending real user data.
- Keep PII out of eval sets and examples you share.

## Further reading

- [Presidio](https://presidio.dataprivacystack.org/), Data Privacy Stack
  (formerly Microsoft). How PII detection and anonymization work, and the
  honest warning that detection misses things.
- [Masking sensitive data](https://langfuse.com/docs/observability/features/masking),
  Langfuse docs. A client-side masking hook for traces, with regex examples
  and the caveats.
- [Semantic conventions for generative client AI spans](https://github.com/open-telemetry/semantic-conventions-genai/blob/main/docs/gen-ai/gen-ai-spans.md),
  OpenTelemetry GenAI SIG, status Development. Why message content is
  opt-in on LLM spans.
- [Data controls in the OpenAI platform](https://developers.openai.com/api/docs/guides/your-data),
  OpenAI docs. One provider's training, retention and zero-retention rules.
