---
id: anthropic-demystifying-evals
title: Demystifying evals for AI agents
author: Mikaela Grace, Jeremy Hadfield, Rodrigo Olivares, Jiri De Jonghe (Anthropic)
url: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents
published: 2026-01-09
accessed: 2026-09-27
kind: blog
primary: true
---

## Summary

Anthropic's engineering guide to evals, written for agents but with a vocabulary and a starting recipe that apply to any LLM feature. It defines tasks, trials, graders, transcripts and the harness; compares code, model and human graders; separates capability evals from regression evals; and gives an eight-step roadmap from no evals to a maintained suite, starting from 20 to 50 tasks taken from real failures.

## Key claims

- Definition. "An evaluation (“eval”) is a test for an AI system: give an AI an input, then apply grading logic to its output to measure success." (The structure of an evaluation)
- Single-turn evals are the simple case: "a prompt, a response, and grading logic." (The structure of an evaluation)
- Terms: "A task (a.k.a problem or test case) is a single test with defined inputs and success criteria." "Each attempt at a task is a trial. Because model outputs vary between runs, we run multiple trials to produce more consistent results." "A grader is logic that scores some aspect of the agent’s performance." An evaluation harness "runs tasks concurrently, records all the steps, grades outputs, and aggregates results." An evaluation suite is "a collection of tasks designed to measure specific capabilities or behaviors." (The structure of an evaluation)
- Why teams add evals: users say the agent "feels worse after changes, and the team is “flying blind”". Without evals, "debugging is reactive: wait for complaints, reproduce manually, fix the bug, and hope nothing else regressed." (Why build evaluations?)
- Claude Code got evals "first for narrow areas like concision and file edits, and then for more complex behaviors like over-engineering." (Why build evaluations?)
- Evals force a definition of success: "Early on, evals force product teams to specify what success means for the agent". "Two engineers reading the same initial spec could come away with different interpretations on how the AI should handle edge cases. An eval suite resolves this ambiguity." (Why build evaluations?)
- Model upgrades: "teams without evals face weeks of testing while competitors with evals can quickly determine the model’s strengths, tune their prompts, and upgrade in days." (Why build evaluations?)
- Free baselines: "latency, token usage, cost per task, and error rates can be tracked on a static bank of tasks." (Why build evaluations?)
- Three grader types: "code-based, model-based, and human." (Types of graders for agents)
- Code-based graders (string match, regex, binary tests, static analysis, tool-call checks) are "Fast", "Cheap", "Objective", "Reproducible" but "Brittle to valid variations that don’t match expected patterns exactly" and "Lacking in nuance". (Code-based graders table)
- Model-based graders (rubric scoring, natural language assertions, pairwise comparison, reference-based) are "Flexible", "Scalable", "Captures nuance" but "Non-deterministic", "More expensive than code", and "Requires calibration with human graders for accuracy". (Model-based graders table)
- Human graders (SME review, crowdsourcing, spot checks, A/B tests) are "Gold standard quality" but "Expensive" and "Slow". (Human graders table)
- Scoring can be "weighted (combined grader scores must hit a threshold), binary (all graders must pass), or a hybrid." (Types of graders)
- Capability evals "should start at a low pass rate, targeting tasks the agent struggles with and giving teams a hill to climb." Regression evals "should have a nearly 100% pass rate." (Capability vs. regression evals)
- Graduation: "capability evals with high pass rates can “graduate” to become a regression suite that is run continuously to catch any drift." (Capability vs. regression evals)
- pass@k and pass^k. pass@k "measures the likelihood that an agent gets at least one correct solution in k attempts". pass^k "measures the probability that all k trials succeed". Example: "If your agent has a 75% per-trial success rate and you run 3 trials, the probability of passing all three is (0.75)³ ≈ 42%." (How to think about non-determinism)
- Start small. "In reality, 20-50 simple tasks drawn from real failures is a great start." Early on, changes have a large effect, so "small sample sizes suffice." (Step 0. Start early)
- Wait and it gets harder: "Wait too long and you're reverse-engineering success criteria from a live system." (Step 0)
- Where tasks come from: "Begin with the manual checks you run during development". In production, "look at your bug tracker and support queue." (Step 1)
- Good tasks: "A good task is one where two domain experts would independently reach the same pass/fail verdict." "Ambiguity in task specifications becomes noise in metrics." Write a reference solution: "a known working output that passes all graders." (Step 2)
- Balance: "Test both the cases where a behavior should occur and where it shouldn't. One-sided evals create one-sided optimization." Example: web search evals needed queries where Claude should search and ones where it should answer from what it knows. (Step 3)
- Grader order: "choosing deterministic graders where possible, LLM graders where necessary or for additional flexibility, and using human graders judiciously for additional validation." (Step 5)
- Grade the result, not the path: "it’s often better to grade what the agent produced, not the path it took." (Step 5)
- Give judges a way out: "providing an instruction to return “Unknown” when it doesn’t have enough information." (Step 5)
- Grading bugs: "Opus 4.5 initially scored 42% on CORE-Bench", partly from "rigid grading that penalized “96.12” when expecting “96.124991…”". "After fixing bugs and using a less constrained scaffold, Opus 4.5’s score jumped to 95%." (Step 5)
- Read transcripts: "You won't know if your graders are working well unless you read the transcripts and grades from many trials." (Step 6)
- Saturation: "An eval at 100% tracks regressions but provides no signal for improvement." (Step 7)
- "we do not take eval scores at face value until someone digs into the details of the eval and reads some transcripts." (Step 7)
- Ownership: "owning and iterating on evaluations should be as routine as maintaining unit tests." (Step 8)
- Offline evals can mislead: automated evals "Can create false confidence if it doesn’t match real usage patterns". Production monitoring is "Reactive; problems reach users before you know about them". A/B testing is "Slow; days or weeks to reach significance". User feedback is "Sparse and self-selected". (Table: approaches for understanding agent performance)
- Combine methods: "automated evals for fast iteration, production monitoring for ground truth, and periodic human review for calibration." (How evals fit with other methods)
- Frameworks matter less than tasks: frameworks are "only as good as the eval tasks you run through them." (Appendix)
- Earlier LLMs: "For earlier LLMs, single-turn, non-agentic evals were the main evaluation method. As AI capabilities have advanced, multi-turn evaluations have become increasingly common." (The structure of an evaluation)
- Outcome vs transcript: "A flight-booking agent might say “Your flight has been booked” at the end of the transcript, but the outcome is whether a reservation exists in the environment’s SQL database." (The structure of an evaluation)
- Bigger sets later: "More mature agents may need larger, more difficult evals to detect smaller effects". (Step 0. Start early)
- New models: "When a new model drops, running the suite quickly reveals which bets paid off." (Step 8)
- Systematic human studies are "Relatively expensive and slow turnaround" and "Hard to run frequently". (Table: approaches for understanding agent performance)
- Real failures make the suite realistic: "Converting user-reported failures into test cases ensures your suite reflects actual usage; prioritizing by user impact helps you invest effort where it counts." (Step 1)
- Production monitoring "Catches issues that synthetic evals miss" but "Lacks ground truth for grading" and its "Signals can be noisy". User feedback "Skews toward severe issues" and "Users rarely explain why something failed". (Table: approaches for understanding agent performance)
- When each applies: "Production monitoring kicks in post-launch to detect distribution drift and unanticipated real-world failures." Also: "triage feedback constantly, sample transcripts to read weekly". (How evals fit with other methods)
- "no single evaluation layer catches every issue." (Swiss Cheese paragraph)
- User feedback "Comes with real examples from actual human users" and "Surfaces problems you didn't anticipate". (Table: approaches for understanding agent performance)
- Transcript. "A transcript (also called a trace or trajectory) is the complete record of a trial, including outputs, tool calls, reasoning, intermediate results, and any other interactions." (The structure of an evaluation)
- Outcome. "The outcome is the final state in the environment at the end of the trial." (The structure of an evaluation)
- Against rigid step checks: "There is a common instinct to check that agents followed very specific steps like a sequence of tool calls in the right order. We've found this approach too rigid and results in overly brittle tests, as agents regularly find valid approaches that eval designers didn't anticipate." (Design the eval harness and graders)
- Partial credit: "A support agent that correctly identifies the problem and verifies the customer but fails to process a refund is meaningfully better than one that fails immediately." (Design the eval harness and graders)
- Coding agents: "Deterministic graders are natural for coding agents because software is generally straightforward to evaluate: does the code run and do the tests pass?" (Evaluating coding agents)
- Conversational agents "often require a second LLM to simulate the user." τ-bench and τ2-bench simulate retail and airline conversations "where one model plays a user persona". (Evaluating conversational agents)
- Code graders can check "Tool calls verification (tools used, parameters)". (Types of graders for agents, code-based graders table)
- SWE-bench Verified "grades solutions by running the test suite"; "LLMs have progressed from 40% to >80% on this eval in just one year." (Evaluating coding agents)
- Loophole: "Opus 4.5 solved a 𝜏2-bench problem about booking a flight by discovering a loophole in the policy. It 'failed' the evaluation as written, but actually came up with a better solution for the user." (The structure of an evaluation)
- Isolation: "Each trial should be 'isolated' by starting from a clean environment." Shared state "can cause correlated failures due to infrastructure flakiness rather than agent performance." (Design the eval harness and graders)

## Visuals worth redrawing

- The anatomy of an eval (task, trials, graders, transcript, outcome, harness) (The structure of an evaluation).
- The pass@k vs pass^k curves as k grows (non-determinism section).
- The three grader tables could be one comparison figure.

## My notes

- Agent-focused, but steps 0 to 3 and 5 to 7 apply to a single-call feature as well.
- Conflicts with Anthropic's own docs page (anthropic-develop-tests), which says "prioritize volume over quality". This post starts from 20 to 50 hand-picked tasks.
