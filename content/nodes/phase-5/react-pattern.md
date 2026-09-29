---
id: react-pattern
title: What is ReAct?
depth: short
phase: 5
note: >-
  The 2022 paper that named the reason-then-act loop agents run on.
needs: [agent-loop, chain-of-thought]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# What is ReAct?

ReAct ("reason + act") is a 2022 prompting method where a model writes a
thought, takes an action, reads what came back, and repeats. It was the
first clear write-up of the loop that every [[agent-loop|agent loop]] runs
today, and its results still explain why agents mix thinking with tool
use rather than doing only one.

## Thought, action, observation

Here's the example the paper opens with. The question: "Aside from the
Apple Remote, what other device can control the program Apple Remote was
originally designed to interact with?"

With [[chain-of-thought]] alone, the model reasons from memory: the Apple
Remote was designed for the Apple TV, and the Apple TV can be controlled by
an iPhone, iPad or iPod Touch. That sounds fine and is wrong.

With ReAct, the model has three actions on a small Wikipedia tool: search
for a page, look up a phrase in it, and finish with an answer. The run goes
like this:

1. **Thought:** I need to search Apple Remote and find the program it was
   designed for. **Action:** search Apple Remote. **Observation:** it was
   designed to control the Front Row media center program.
2. **Thought:** now search Front Row. **Action:** search Front Row.
   **Observation:** not found, with a list of similar titles.
3. **Thought:** try "Front Row (software)". **Action:** search that.
   **Observation:** Front Row is a discontinued media center program.
4. The model reads that it's controlled by an Apple Remote or the keyboard
   function keys, and finishes with "keyboard function keys".

The thoughts don't touch the outside world. They plan the next search,
pull the key fact out of a result and decide what to try when a search
fails. The actions do touch the world and bring back real text. Each needs
the other: reasoning alone makes facts up, and acting alone loses track of
what it was looking for.

The original setup was plain prompting. The authors took PaLM-540B, wrote
6 example runs in this format for the question answering task and 3 for
fact checking, and put them in the prompt. More examples didn't help.

## What the results showed

The gains were largest on tasks where the model has to explore:

- In ALFWorld, a text game where the agent moves around a house to do
  chores, ReAct succeeded 71% of the time (best of 6 prompts) against 45%
  for the same prompts with the thoughts removed.
- In WebShop, a shopping site with 1.18 million real products, ReAct's
  success rate was 40.0% against 30.1% for acting alone.

On question answering the picture was mixed. ReAct beat chain-of-thought
on fact checking (60.9 vs 56.3 accuracy) but slightly lost on multi-hop
questions (27.4 vs 29.4 exact match). The best results on both came from
combining the two: fall back to chain-of-thought when ReAct doesn't finish
in a few steps, or to ReAct when chain-of-thought samples disagree.

The error analysis shows why. The authors hand-labeled 200 runs on the
multi-hop questions:

![Two bar groups from hand-labeled failures on HotpotQA. Hallucinated facts or reasoning: 56% of chain-of-thought failures, 0% of ReAct failures. Wrong reasoning, including getting stuck repeating steps: 16% for chain-of-thought, 47% for ReAct. Search returned nothing useful: 23% of ReAct failures, not applicable to chain-of-thought.](img/react-pattern-failures.svg)

Grounding in real search results removed hallucination as a cause of
failure. It traded it for new ones: a search that returns nothing useful
derails the run, and the fixed think-act-observe format makes it harder
to reason flexibly.

## Where it gets tricky

**It's a 2022 prompting trick.** ReAct parsed actions out of plain text.
Today [[tool-calling]] gives you structured actions instead, so you rarely
write a ReAct prompt. The loop you build still has its shape.

**Loops can get stuck.** One failure the paper names is specific to this
pattern: the model repeats its earlier thoughts and actions and can't get
out. That's why agent loops have turn limits.

**The tool decides a lot.** The paper's Wikipedia tool was deliberately
weak: it only found pages by exact title. 23% of ReAct's failures were
searches that came back empty or useless. A better tool changes the
numbers, so these results say more about the pattern than about any fixed
level of accuracy.

**Humans can steer it.** Because the thoughts are plain text, the authors
could fix a failing run by editing a couple of the model's thoughts
mid-task, and it went on to succeed.

## What this means when you build

- Let the model reason before it acts and after each result. Don't ask
  for a tool call with no room to think.
- Put effort into what tools return. Empty or noisy results are the
  loop's main way to fail.
- Cap the number of steps so a stuck loop ends.
- Keep the model's reasoning in your logs. It's the easiest way to see
  why a run went wrong.

## Further reading

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629),
  Shunyu Yao et al., 2022 (ICLR 2023). The paper: the Apple Remote
  example, the results on four tasks and the hand-labeled error analysis.
- [ReAct: Synergizing Reasoning and Acting in Language Models (Google Research blog)](https://research.google/blog/react-synergizing-reasoning-and-acting-in-language-models/),
  Shunyu Yao and Yuan Cao, 2022. A short walkthrough by the authors, with
  the reason-only vs act-only comparison and the thought-editing example.
