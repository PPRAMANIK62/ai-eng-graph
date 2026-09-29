---
id: open-vs-closed-models
title: Open or closed models?
depth: deep
phase: 4
note: >-
  Open weights you can run yourself vs API-only models: control, cost, quality, hosting.
needs: [model-selection]
leads_to: [local-models]
compare_with: []
updated: 2026-09-29
---

# Open or closed models?

A closed model is one you can only use through its maker's API. An open
model, more precisely an open-weight model, has its weights published, so
you can run it yourself or pick from many companies that host it. Open
models are cheaper and give you more control. The best closed models are
still ahead on the hardest tasks, and with an open model it's on you to
make sure it's served correctly.

## Three ways to call a model

Take one task, say an agent that calls tools, and three ways to power it:

1. **A closed model through its maker's API.** You send requests, you pay
   per token. The maker controls the weights, the serving and the
   settings. You can't run it yourself.
2. **An open model through a hosting provider.** You still pay per token,
   usually less, and there are many providers to choose from. Each provider runs the
   weights on its own software and hardware, with its own settings.
3. **An open model on your own machines.** You control everything,
   including where the data goes. You also do all the work: GPUs, serving
   software, settings, updates. That's covered in [[local-models]].

Option 3 is the one people picture, but in production open models are
often used the second way, through a host. Most of this article is about
1 vs 2.

## How far behind are open models? Depends who you ask

As of 2026-09 there are three published answers, and they don't agree.

**About four months.** Epoch AI tracks a Capabilities Index built from
many public benchmarks. From January to May 2026, the best open model at
any date matched where the closed frontier had been about four months
earlier. In points, the gap averaged 8 (90% interval 7 to 11), about the
distance between GPT-5 and GPT-5.5. With a stricter definition of
"caught up", the gap grows to six months. In their earlier study of 2023
to late 2025 it was about three.

**Six index points.** Artificial Analysis runs its own Intelligence Index.
At the end of April 2026, the best open models (Kimi K2.6 and MiMo V2.5
Pro) scored 54 against 60 for the top closed model, GPT-5.5. A year
earlier the best open model scored 22 against 35 for the best closed one.

**Nine to twelve months.** Menlo Ventures, in a mid-2025 report built on
a survey of 150 technical leaders, put the gap at nine to twelve months. The report states it
rather than showing how it was measured.

![Three measurements of the gap between the best open-weight and best closed models. Epoch AI, January to May 2026, capabilities index built from public benchmarks: about 4 months behind, or 6 months with a stricter test, 8 index points. Artificial Analysis, April 2026, its own Intelligence Index: 6 points behind (54 vs 60), down from 13 points a year earlier (22 vs 35). Menlo Ventures, mid-2025, in a report built on a survey of 150 tech leaders: 9 to 12 months, stated without a method.](img/open-vs-closed-models-gap.svg)

These can all be true at once. They differ in four ways:

- **When.** Menlo's number is from mid-2025. The other two are from 2026,
  after a run of strong open releases. Artificial Analysis shows the gap
  in its index roughly halving in a year.
- **What ruler.** "Months behind" and "points behind" answer different
  questions. A small point gap can still be months of progress if the
  frontier moves slowly, and the reverse.
- **Which tests.** Epoch's index is built from public benchmarks, which
  probably understates the gap. Open models tend to do worse on private
  benchmarks, likely because they're tuned harder on the public ones, so
  their public scores drift above their real skill (see [[benchmarks]]).
  Closed labs also don't always release their best models.
- **Average or hardest.** On an average across tests the gap is small. On
  the hardest ones it's wide. In April 2026, top open models scored 43% to
  46% on TerminalBench Hard (agentic coding in a terminal) against 61% for
  GPT-5.5, and they did clearly worse on a test of knowledge and
hallucination.

So "how far behind" depends on your task. For extraction or
classification, the gap may not matter. For long agent runs on hard code,
it's more likely to. The only way to know is to run the open candidates
through your own eval loop, as in [[model-selection]].

## What open models cost

Through hosted APIs, open models are much cheaper for similar scores. In
April 2026, the three best open models offered intelligence comparable to
leading closed models at between half and one sixth of the price, and 9 of
the 13 models on Artificial Analysis's best-score-for-the-price frontier
were open.

What it costs to run one yourself is a different question, and there's no
good public answer. We looked for a trustworthy source comparing
self-hosting with API prices and found only vendor marketing with
unsourced numbers. The top open models are also big: as of April 2026, the
top three are mixture-of-experts models with a trillion or more
parameters each (Kimi K2.6 has 1 trillion in total, 32 billion active per token).
If cost is your reason to self-host, you'll have to work it out for your
own hardware and traffic.

## The same model is not the same service

An open model runs on many providers' setups, and they don't all behave
the same.

Moonshot AI, which makes the open Kimi models, found this out from user
complaints about benchmark scores. Many cases came down to hosts using the
wrong sampling settings (see [[sampling]]). Others were subtler: bugs in
the [[kv-cache]] or quality loss from [[quantization]] that only show up on
long outputs. After testing many providers, they found the gap between
third-party and official APIs was widespread.

Their public test is a good picture of it. They sent the same 4,000
tool-call requests to each provider hosting Kimi K2 and checked how many
tool calls matched the expected JSON schema.

![Horizontal bar chart of tool-call schema accuracy for the same open model, Kimi K2 0905, served by different providers, on 4,000 requests (test date 2025-11-15). Moonshot's own API, Moonshot AI Turbo, DeepInfra, Fireworks, Infinigence, NovitaAI and Groq 100%, SiliconFlow 99.8%, Chutes 96.7%, Nebius 84.5%, vLLM 76.0%, SGLang 73.1%, Volc 72.9%, Baseten 72.5%, AtlasCloud 72.4%, Together 72.0%.](img/open-vs-closed-models-vendors.svg)

Same weights, from 100% down to about 72%. The vLLM and SGLang rows are
the open-source serving engines themselves, at fixed versions, not a
hosted provider. That's the closest row to running the model yourself.
In an agent, errors in [[tool-calling|tool calls]] compound over a run, so
a few points here matter a lot.

A 2026 study of hosted open-weight APIs found the same pattern more
broadly. Latency, throughput, context length, supported features and error
behavior all varied by provider and over time, while listed prices stayed
fairly steady. What you're buying is a provider's endpoint, not a model
name. Picking providers per task paid off: routing cut the cost of
Qwen3-32B by 37.8% and nearly doubled DeepSeek-V3.2's throughput compared
with the official API.

## Why teams pick one or the other

The reasons for open models are control and cost: you can customize the
model, it may save money, and you can deploy it in your own cloud or on
your own servers so data stays with you.

In mid-2025, enterprise teams were moving the other way. In Menlo's
survey, open models' share of workloads fell from 19% to 13% in six
months. The reasons given were the quality gap, the work of deploying open
models, and reluctance to use APIs from Chinese companies, which make many
of the best open models. As of April 2026, all ten top open models on
Artificial Analysis's index came from labs based in China.

## Where it gets tricky

**The gap numbers measure different things.** Four months, six points and
nine to twelve months come from different dates, rulers and tests. Quote
the one that matches your question, with its date, and expect it to be out
of date soon.

**Open models may look better on paper than in use.** If open models are
tuned harder on public benchmarks, their scores flatter them more than
closed models' scores do. Your own eval set is the check.

**Self-hosting cost is unknown here.** There's no trustworthy public
comparison of running an open model yourself vs paying per token. Treat
any break-even number you find with suspicion unless it shows its inputs.

**You inherit the serving risk.** With an open model, your provider's
settings and quantization are part of your model's quality. Moonshot's own conclusion was that publishing the weights
isn't enough if people don't know how to run them correctly.

**Sources have interests.** Moonshot wants you on its official API. The
provider study's data all came from one platform, AI Ping. Menlo invests in some of
the companies it writes about. The numbers are still useful, read with that
in mind.

## What this means when you build

- Put open candidates through the same eval set as closed ones. Don't pick
  by index score.
- Test the exact provider and endpoint you'll use, not the model name.
  Rerun the eval when you change provider.
- Check the provider's sampling settings, context length and quantization
  against what the model maker recommends.
- For agents, measure tool-call accuracy per provider, and validate every
  tool call against its schema (see [[structured-output]]).
- Keep a second provider ready for the same model (see
  [[provider-fallback]]).
- If you want to self-host, measure your own cost; don't borrow someone's
  break-even chart.

## Further reading

- [Open models lag state-of-the-art closed models by 4 months](https://epoch.ai/data-insights/open-closed-eci-gap),
  Jack Edwards and Luke Emberson (Epoch AI), 2026. The gap in months and
  index points, how it's computed, and why it's likely understated.
- [Recent open weights model launches](https://artificialanalysis.ai/articles/recent-open-weights-model-launches),
  Artificial Analysis, 2026. The gap on their index, where it's still
  wide, and the price difference.
- [2025 Mid-Year LLM Market Update](https://menlovc.com/perspective/2025-mid-year-llm-market-update/),
  Menlo Ventures, 2025. Enterprise adoption of open models and the reasons
  teams gave for moving away.
- [Rebuilding the "Chain of Trust": Kimi Vendor Verifier](https://www.kimi.ai/blog/kimi-vendor-verifier),
  Moonshot AI, 2026. A model maker on why the same open model behaves
  differently across hosts, and how they test for it.
- [K2 Vendor Verifier](https://github.com/MoonshotAI/K2-Vendor-Verifier),
  Moonshot AI, 2025. The per-provider tool-call results behind the chart
  above.
- [When Is the Same Model Not the Same Service?](https://arxiv.org/abs/2605.02821),
  Haorui Li et al., 2026. A measurement study of hosted open-weight APIs:
  latency, features and errors by provider. A preprint.
