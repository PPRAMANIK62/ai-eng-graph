---
id: willison-designing-agentic-loops
title: Designing agentic loops
author: Simon Willison
url: https://simonwillison.net/2025/Sep/30/designing-agentic-loops/
published: 2025-09-30
accessed: 2026-09-29
kind: blog
primary: false
---

## Summary

How to set up a coding agent to run on its own: the risks of letting it run commands, sandboxes, scoped credentials, and which problems suit an agentic loop in the first place (clear success criteria, lots of trial and error).

## Key claims

- What fits. "The thing to look out for here are problems with clear success criteria where finding a good solution is likely to involve (potentially slightly tedious) trial and error." (main text)
- Brute force. "If you can reduce your problem to a clear goal and a set of tools that can iterate towards that goal a coding agent can often brute force its way to an effective solution." (main text)
- The signal. "Any time you find yourself thinking 'ugh, I'm going to have to try a lot of variations here' is a strong signal that an agentic loop might be worth trying!" (main text)
- Examples: debugging test failures, performance optimization, upgrading dependencies, reducing container size. (main text)
- Tests amplify agents. "The value you can get from coding agents and other LLM coding tools is massively amplified by a good, cleanly passing test suite." (main text)
- Definition. "My preferred definition of an LLM agent is something that runs tools in a loop to achieve a goal." (intro)
- YOLO mode is "where everything gets approved by default". "This is so dangerous, but it’s also key to getting the most productive results!" (The joy of YOLO mode)
- Three risks: "Bad shell commands deleting or mangling things you care about"; "Exfiltration attacks where something steals files or data visible to the agent"; "Attacks that use your machine as a proxy to attack another target". (The joy of YOLO mode)
- Three options: run in a secure sandbox that restricts files, secrets and network; "Use someone else’s computer"; or "Take a risk!". "Most people choose option 3." (The joy of YOLO mode)
- "Despite the existence of container escapes I think option 1 using Docker or the new Apple container tool is a reasonable risk to accept for most people." He prefers GitHub Codespaces. (The joy of YOLO mode)
- Shell over MCP. "You can bring MCP into the mix at this point, but I find it’s usually more productive to think in terms of shell commands instead. Coding agents are really good at running shell commands!" (Picking the right tools for the loop)
- "Rather than leaning on MCP, I like to create an AGENTS.md (or equivalent) file with details of packages I think they may need to use." One example command in AGENTS.md is "enough for the agent to guess" other uses. (Picking the right tools for the loop)
- Credentials: use test or staging credentials; "If a credential can spend money, set a tight budget limit." He made a Fly.io organization with a $5 budget and an API key limited to it. (Issuing tightly scoped credentials)

## Visuals worth redrawing

None.

## My notes

- Sandboxing and credentials parts are for the sandboxing node.
