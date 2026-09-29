---
id: constrained-decoding
title: What is constrained decoding?
depth: deep
phase: 3
note: >-
  Forcing valid output by blocking, at every step, the tokens that would break the schema.
needs: [structured-output, sampling, tokenization]
leads_to: []
compare_with: [schema-validation]
updated: 2026-09-29
---

# What is constrained decoding?

Constrained decoding is the machinery under a strict schema: at every
generation step, a grammar engine works out which tokens could still lead to
valid output, and every other token is blocked before the model picks. The
idea is simple. The hard parts are doing it fast enough with a 128,000-token
vocabulary, and doing it without pushing the model into text it would never
write. That second part decides whether a schema makes your answers better
or worse.

## The mask, one more time

You met the basic move in [[structured-output]]. The model scores every token
in its vocabulary, and the engine builds a **mask**: a yes or no for each
token. Blocked tokens get a score of minus infinity, so after
[[softmax]] their probability is zero, and the allowed tokens keep their
relative odds. Then [[sampling]] happens as normal, only over what's left.

The naive way to build that mask is to try every token in the vocabulary
against the grammar at every step. With a vocabulary in the tens of thousands
or more, that's a lot of work per token, and it sits on the path of every
single token you generate. Much of the engineering in constrained decoding
goes into avoiding that work.

## Tokens don't line up with the grammar

Take a tiny example: a pattern for decimal numbers, like `12.5` or `.2`
(the regex `([0-9]*)?\.?[0-9]*`). As a state machine it has a few states:
"nothing yet", "in the whole part", "just read the dot", "in the decimal
part".

Now give the model a toy vocabulary of five tokens: `A`, `.`, `42`, `.2`
and `1`. At the start, `A` is blocked and the other four are fine. If the
model picks `.2`, the machine has read a dot *and* a digit in one step, so
it's in the decimal part, and now only `42` and `1` are allowed. Another dot
would be invalid.

That's the core problem. The grammar thinks in characters. The model thinks
in [[tokenization|tokens]], and a single token can cover half a grammar rule,
or the end of one rule and the start of the next. `.2` crosses the boundary
between the dot and the digits.

![The decimal-number pattern as a state machine with four states: start, whole part, dot read, decimal part. Next to each state, the toy vocabulary A, dot, 42, .2 and 1, with the tokens that are allowed from that state highlighted and the rest crossed out. At start, everything but A is allowed. After the token .2 the machine jumps two steps in one token, from start straight to the decimal part, where only 42 and 1 are allowed. Below, the index built ahead of time: a table from each state to its allowed tokens, so each step is a lookup instead of a scan of the vocabulary.](img/constrained-decoding-fsm-index.svg)

The fix, from the 2023 paper behind the Outlines library, is to do the work
ahead of time. For every state of the machine, walk every vocabulary token
through it and record which tokens are accepted from there. You have to start
from every state, because a token can begin anywhere in the pattern. The
result is an index: state in, set of allowed tokens out. At run time you track
which state you're in and look up the mask. The per-step cost goes from
"check the whole vocabulary" to a lookup that is constant on average.

## JSON needs a stack

That works for regular expressions. JSON is harder, because it nests: an
object can hold an array that holds an object, as deep as you like. A regex
can't describe that. You need a context-free grammar, and matching one needs
a stack to remember which brackets are still open.

The stack breaks the precompute trick. With no limit on its depth, the number
of possible states is infinite, so you can't build a mask for every state in
advance. The engines that matter today each answer this differently:

- **Outlines** turns a JSON schema into a big regular expression, then
  precomputes the index as above. Sampling is fast once it's built, but
  building it is slow, and some schema features (array length limits,
  enums) can take from 40 seconds to 10 minutes.
- **XGrammar** (2024, from CMU and others) notices that most tokens can be
  judged from the current position in the grammar alone, without looking at
  the whole stack. Those are precomputed. Only tokens that could close the
  current rule and continue in a parent rule need the full stack at run time.
  For Llama 3.1 with a JSON grammar that's under 1% of the vocabulary: 1,134
  out of 128k tokens, cut to 120 with an extra trick that looks ahead into the
  parent rules.
- **llguidance** (Microsoft's engine behind the Guidance library) skips most
  precomputation. It computes the mask fresh at each step with a fast parser
  and a walk over a prefix tree of the vocabulary, so there's almost no
  startup cost.

The engine you use may not be your choice. As of 2025-05, llguidance powers
OpenAI's Structured Outputs for JSON Schema, and it's also built into vLLM,
SGLang and llama.cpp, where you can pick the grammar backend yourself.

## Why microseconds matter

The mask is CPU work, and it has to be ready by the time the GPU finishes
computing the next token's scores. If it isn't, the GPU waits. On a busy
server you need one mask per sequence in the batch, every step.

That's why the engines quote tiny numbers. llguidance claims about 50
microseconds of CPU time per token for a 128k vocabulary, and works out that
16 cores could keep up with a batch of 3,200 sequences at a 10 ms forward
pass. XGrammar claims under 40 microseconds per token for JSON, and up to
100x faster than existing engines. Both also hide their
work behind the GPU's: compiling the grammar while the prompt is being read
(see [[prefill-decode]]), and computing the mask while the model computes
its scores.

Constrained decoding can even be faster than no constraint at all. When the
grammar allows exactly one continuation, like the fixed text of a key name,
the engine can insert those tokens without running the model for each one.

## What the independent-ish measurements found

Each engine's speed claims come from its own authors. JSONSchemaBench (2025)
tested them side by side on real schemas from its set of about 10,000, with
Llama 3.1 8B on one GPU at batch size 1. Median times across five of its
schema sets:

| Engine | Compile time | Time per output token |
|---|---|---|
| No constraint | none | 15 to 17 ms |
| Guidance (llguidance) | about 0 s | 6 to 9 ms |
| llama.cpp grammars | 0.05 to 0.06 s | 27 to 30 ms |
| Outlines | 3.5 to 8 s | 30 to 47 ms |

XGrammar couldn't run on that backend, so it was tested separately on
Hugging Face Transformers against Guidance: 0.1 to 0.3 s to compile and 65
to 67 ms per token, against 36 to 44 ms for Guidance. Guidance beat the
unconstrained model because it skips the steps the grammar forces.

The same benchmark checked something the speed claims skip: does the engine
actually handle your schema? It separates schemas an engine *accepts* from
schemas where its output is *actually valid*. On one set of simple GitHub
schemas, OpenAI's API accepted only 30%, but 97% of what it accepted came back
valid. Gemini accepted 8%. The open engines accepted far more, and more of
what they accepted came back invalid. Hosted APIs support a smaller part of
JSON Schema and enforce it tightly, which is why you hit "unsupported
schema" errors on them.

An engine can also be wrong in two directions. **Over-constrained**: it
blocks output your schema allows. **Under-constrained**: it lets through
output your schema forbids, so you're back to checking and retrying. On the
official JSON Schema test suite, XGrammar was the most permissive of the
four open engines.

## Where it gets tricky

**Does constraining hurt answer quality?** In theory it shouldn't, since it
only removes invalid tokens. In practice it can, and the argument has gone
back and forth since 2024.

- *Let Me Speak Freely?* (2024) found reasoning got worse under format
  restrictions. But its "constrained decoding" condition was JSON mode, which
  only promises valid JSON, not a schema. And on the Last Letter task,
  100% of GPT-3.5's JSON-mode answers put the `answer` key before the
  `reason` key, so the model answered before it thought (see [[chain-of-thought]]). The same paper found
  JSON mode held up, and sometimes helped, on [[classification]] tasks, where
  limiting the answer space cuts mistakes. A later test in the paper with a real strict schema on
  gpt-4o-mini came out mixed: worse on GSM8K (91.7 vs 94.6 in plain text),
  better on Last Letter (86.1 vs 83.1).
- The Outlines team's rebuttal, covered in [[structured-output]], re-ran the
  tasks with a reasoning field first and got structured output slightly ahead.
- JSONSchemaBench re-ran the three reasoning tasks with every engine, using
  the rebuttal's prompts, and every engine matched or beat unconstrained
  output. Guidance was about 3 points ahead on each (GSM8K 80.1% to 83.8%).
- The DOMINO paper (2024) explains how both sides can see real effects: the
  engine matters. A naive engine only allows tokens that match the very next
  grammar piece. In JSON, the model would normally write a space and a quote
  as one token; the naive engine only allows a lone quote or whitespace, so
  the model picks a tab instead, then another odd token, and drifts into text
  it would never write. On a JSON version of GSM8K with Mistral 7B, naive
  constraining dropped accuracy from 41.5% to 30.8%. An engine that allows
  tokens spanning grammar pieces got 41.8%.

![Two ways to constrain the same JSON. Top, the tokens a model writes on its own after an opening brace: a space-quote token, name, quote-colon, space-quote, John. Middle, a naive engine that only allows a lone quote or whitespace next: the model writes a tab, a lone quote, name, a lone quote, a tab, a colon, a tab. Bottom, a bar chart of accuracy on a JSON version of GSM8K: unconstrained 41.5%, naive constraining 30.8%, token-aligned constraining 41.8%.](img/constrained-decoding-misalignment.svg)

Notice who says what. The results finding constraints help all come from
people who build engines: JSONSchemaBench from the Guidance team (and
Guidance topped its tables), the rebuttal from the company behind Outlines,
DOMINO from the authors of another constrained-generation tool. The paper
finding harm tested JSON mode, with outputs that let the model answer
before reasoning. Nobody neutral has settled it. The reading that
fits all the evidence: good engines plus sensible prompts don't hurt, and can
help; naive engines, or schemas that force the answer before the reasoning,
can hurt a lot.

**Even a good engine can nudge the model.** The benchmark gives a toy case:
a model that wants to write `89,000` in an integer field can't write the
comma, and may continue with `890000`. The field is valid; the number is
wrong.

**Speed numbers don't compare.** XGrammar's 40 microseconds is mask time;
JSONSchemaBench's 65 to 67 ms is time per token end to end on a different backend.
llguidance's README says XGrammar's precomputation can take seconds or even
minutes, and XGrammar's paper says it's up to 100x faster than the rest. Each
claim is from a competitor. Measure on your own schema and serving setup.

**Valid is not correct.** The engine guarantees shape. Values, ranges and
anything the engine under-constrains are your job; that's
[[schema-validation]].

## What this means when you build

- On a hosted API, you don't choose the engine. Expect a narrower set of
  supported schema features than JSON Schema allows, enforced tightly.
- If you serve open models with vLLM, SGLang or llama.cpp, the grammar
  backend is a setting. Test compile time and per-token time with your real
  schemas, not the published numbers.
- Put reasoning fields before answer fields, so the output never forces the
  answer first.
- Keep schemas simple. Big schemas and less common keywords are where
  engines get slow, refuse, or quietly under-constrain.
- Still validate the output. Constrained decoding removes parse errors, not
  wrong values.

## Further reading

- [Efficient Guided Generation for Large Language Models](https://arxiv.org/abs/2307.09702),
  Brandon Willard and Rémi Louf, 2023. The state-machine index behind
  Outlines, with the decimal-number example.
- [XGrammar: Flexible and Efficient Structured Generation Engine for Large Language Models](https://arxiv.org/abs/2411.15100),
  Yixin Dong et al., 2024. Why JSON needs a stack, and splitting the
  vocabulary into tokens you can precheck and tokens you can't.
- [Low-level Guidance (llguidance)](https://github.com/guidance-ai/llguidance),
  guidance-ai (Microsoft), 2025. The engine behind OpenAI's Structured
  Outputs, how it computes masks on the fly, and a (competitor's) comparison
  with Outlines and XGrammar.
- [JSONSchemaBench](https://arxiv.org/abs/2501.10868), Saibo Geng et al.,
  2025. Side-by-side speed, schema coverage and quality for six engines and
  APIs, from the Guidance team.
- [Guiding LLMs The Right Way](https://arxiv.org/abs/2403.06988), Luca
  Beurer-Kellner, Marc Fischer and Martin Vechev, 2024. Token misalignment,
  with the clearest example of how a naive engine hurts accuracy.
- [Let Me Speak Freely?](https://arxiv.org/abs/2408.02442), Zhi Rui Tam et
  al., 2024. The study that found format restrictions hurt reasoning, but
  not classification.
