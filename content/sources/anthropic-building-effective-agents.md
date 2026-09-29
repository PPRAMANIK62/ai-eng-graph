---
id: anthropic-building-effective-agents
title: Building effective agents
author: Erik Schluntz and Barry Zhang (Anthropic)
url: https://www.anthropic.com/engineering/building-effective-agents
published: 2024-12-19
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

Anthropic's post on how teams actually build with LLMs. It splits "agentic systems" into workflows (LLM calls wired together by code you wrote) and agents (the model decides its own steps and tool use). It names five workflow patterns: prompt chaining, routing, parallelization (sectioning and voting), orchestrator-workers and evaluator-optimizer, each with when to use it and examples. The advice throughout: start with the simplest thing, often a single call, and add steps only when they measurably help. The page now carries a note that the tooling it mentions has changed since 2024-12, and its routing example names Claude Haiku 4.5 and Sonnet 4.5, so it has been edited since first publication.

## Key claims

- Workflow vs agent. "Workflows are systems where LLMs and tools are orchestrated through predefined code paths." and "Agents, on the other hand, are systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks." (What are agents?)
- Start simple. "we recommend finding the simplest solution possible, and only increasing complexity when needed. This might mean not building agentic systems at all." (When (and when not) to use agents)
- The cost of more steps. "Agentic systems often trade latency and cost for better task performance, and you should consider when this tradeoff makes sense." (same)
- Workflows for well-defined tasks. "workflows offer predictability and consistency for well-defined tasks, whereas agents are the better option when flexibility and model-driven decision-making are needed at scale." Often one call is enough: "optimizing single LLM calls with retrieval and in-context examples is usually enough." (same)
- Frameworks hide prompts. They "often create extra layers of abstraction that can obscure the underlying prompts and responses, making them harder to debug." Start with the API: "many patterns can be implemented in a few lines of code." (When and how to use frameworks)
- The building block is an "augmented LLM": a model with retrieval, tools and memory. (Building block: The augmented LLM)
- Prompt chaining. "Prompt chaining decomposes a task into a sequence of steps, where each LLM call processes the output of the previous one." You can add "programmatic checks (see "gate” in the diagram below) on any intermediate steps". (Workflow: Prompt chaining)
- When to chain: when "the task can be easily and cleanly decomposed into fixed subtasks. The main goal is to trade off latency for higher accuracy, by making each LLM call an easier task." Examples: marketing copy then translation; outline, check the outline against criteria, then write the document. (same)
- Routing. "Routing classifies an input and directs it to a specialized followup task." Without it, "optimizing for one kind of input can hurt performance on other inputs." (Workflow: Routing)
- When to route: "distinct categories that are better handled separately, and where classification can be handled accurately, either by an LLM or a more traditional classification model/algorithm." Examples: customer service queries (general, refunds, technical support) to different processes, prompts and tools; easy questions to Claude Haiku 4.5, hard ones to Claude Sonnet 4.5. (same)
- Parallelization has two forms. "Sectioning: Breaking a task into independent subtasks run in parallel." and "Voting: Running the same task multiple times to get diverse outputs." (Workflow: Parallelization)
- When to parallelize: "when the divided subtasks can be parallelized for speed, or when multiple perspectives or attempts are needed for higher confidence results." Also "LLMs generally perform better when each consideration is handled by a separate LLM call". (same)
- Sectioning examples: a guardrail call screening the query while another answers it, which "tends to perform better than having the same LLM call handle both guardrails and the core response"; evals where each call grades a different aspect. Voting examples: several prompts reviewing code for vulnerabilities; judging whether content is inappropriate "with multiple prompts evaluating different aspects or requiring different vote thresholds to balance false positives and negatives." (same)
- Orchestrator-workers: "a central LLM dynamically breaks down tasks, delegates them to worker LLMs, and synthesizes their results." Differs from parallelization because "subtasks aren't pre-defined, but determined by the orchestrator based on the specific input." (Workflow: Orchestrator-workers)
- When to use orchestrator-workers: "This workflow is well-suited for complex tasks where you can't predict the subtasks needed (in coding, for example, the number of files that need to be changed and the nature of the change in each file likely depend on the task)." It's "topographically similar" to parallelization. Examples: "Coding products that make complex changes to multiple files each time" and "Search tasks that involve gathering and analyzing information from multiple sources." (Workflow: Orchestrator-workers)
- The post is dated, and says so at the top: "Much of the tooling landscape described in this post has changed since December 2024." (page header note)
- Evaluator-optimizer. "one LLM call generates a response while another provides evaluation and feedback in a loop." (Workflow: Evaluator-optimizer)
- When it fits: "when we have clear evaluation criteria, and when iterative refinement provides measurable value." Two signs: "LLM responses can be demonstrably improved when a human articulates their feedback; and second, that the LLM can provide such feedback." Examples: literary translation; complex search where the evaluator decides whether more searches are needed. (same)
- Agents are "typically just LLMs using tools based on environmental feedback in a loop", fit for "open-ended problems where it’s difficult or impossible to predict the required number of steps", and bring "higher costs, and the potential for compounding errors." It's common to add "stopping conditions (such as a maximum number of iterations)". (Agents)
- Patterns combine. "These building blocks aren't prescriptive." and "you should consider adding complexity only when it demonstrably improves outcomes." (Combining and customizing these patterns)
- Tools deserve as much prompt engineering as prompts. "Tool definitions and specifications should be given just as much prompt engineering attention as your overall prompts." (Appendix 2: Prompt engineering your tools)
- Some formats are harder for a model to write: a diff needs the line count in the chunk header before the new code is written. Advice: "Keep the format close to what the model has seen naturally occurring in text on the internet." and avoid formatting "overhead" such as keeping an accurate line count or string-escaping code. (Appendix 2)
- The agent-computer interface. "think about how much effort goes into human-computer interfaces (HCI), and plan to invest just as much effort in creating good agent-computer interfaces (ACI)." (Appendix 2)
- "Put yourself in the model's shoes. Is it obvious how to use this tool, based on the description and parameters, or would you need to think carefully about it?" Write it like "a great docstring for a junior developer on your team". (Appendix 2)
- "Poka-yoke your tools. Change the arguments so that it is harder to make mistakes." (Appendix 2)
- The SWE-bench example. "we actually spent more time optimizing our tools than the overall prompt." The model made mistakes with relative filepaths after moving out of the root directory; "we changed the tool to always require absolute filepaths—and we found that the model used this method flawlessly." (Appendix 2)
- The agent loop: an agent gets "ground truth from the environment at each step (such as tool call results or code execution) to assess its progress", can "pause for human feedback at checkpoints or when encountering blockers", and has "stopping conditions (such as a maximum number of iterations) to maintain control." (Agents)
- When to use agents. "Agents can be used for open-ended problems where it's difficult or impossible to predict the required number of steps, and where you can't hardcode a fixed path." (Agents)
- Risks of agents. "The autonomous nature of agents means higher costs, and the potential for compounding errors. We recommend extensive testing in sandboxed environments, along with the appropriate guardrails." (Agents)
- Agent examples: a coding agent resolving SWE-bench tasks that need edits to many files, and the computer-use reference implementation. (Agents)
- Three principles: keep the agent simple, show its planning steps (transparency), and document and test its tools well. (Summary)

## Visuals worth redrawing

- One diagram per pattern (chaining with a gate, routing, parallelization with an aggregator, orchestrator-workers, evaluator-optimizer loop). Redraw as a single sheet of small flow diagrams.

## My notes

- No numbers anywhere in the post: it's experience from customers, not measurement.
- Dated 2024-12. Anthropic's 2026 prompting docs (`anthropic-prompting-best-practices`) say current models handle most multistep reasoning internally, which weakens the case for chaining on reasoning alone.
