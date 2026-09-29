---
id: human-in-the-loop
title: When should a human approve an agent's step?
depth: short
phase: 5
note: >-
  Pausing for a person to approve risky actions, and the fatigue that comes with it.
needs: [agent-loop]
leads_to: []
compare_with: [excessive-agency, sandboxing]
updated: 2026-09-29
---

# When should a human approve an agent's step?

Human in the loop means the agent stops before an action and waits for a
person to approve or deny it. It's the obvious safety check for an agent
that can delete files or send messages. The catch is that people approve
almost everything they're shown, so asking about every step protects less
than it seems. The real design question is which steps deserve a person.

## How an approval step works

In an [[agent-loop]], the model asks for a tool call, your code runs it,
and the result goes back to the model. An approval step sits between the
request and the run. Your code shows the person the exact call (which tool,
which arguments), and waits. If they approve, the call runs. If they deny,
you send the denial back to the model as the tool result, ideally with a
reason, so it can try another way.

The [[mcp]] spec (as of 2026-07-28) makes this the default stance: there
should always be a human who can deny tool calls. Apps should show which
tools the model has, show clearly when one runs, ask for confirmation, and
show the tool's inputs before calling the server, so the user can catch
data being sent somewhere it shouldn't go.

## Approval fatigue

Anthropic looked at how people use Claude Code's permission prompts. In a
2026 write-up, it reported that users approved 93% of them. When nearly every prompt is fine,
people stop reading. The prompt that matters looks like the ones before
it and gets the same click.

The actions that do matter are real. Anthropic's internal incident log
includes an agent deleting remote git branches after misreading "clean up
old branches", uploading an engineer's GitHub token to an internal compute
cluster, and trying to run migrations against a production database. In
each case the agent was trying to help and went further than the user
meant.

So the question is less "should a human approve?" and more "which actions
are worth a human's attention?"

## Fewer prompts, better aimed

Anthropic's answer in Claude Code's auto mode is to sort actions by risk
and only escalate the risky ones:

![A funnel of permission checks in Claude Code auto mode. Tier 1: a built-in allowlist of tools that can't change anything (reads, search, code navigation) runs without a check. Tier 2: file edits inside the project directory run without a check, since they can be reviewed in version control. Tier 3: everything else (shell commands, web fetches, external tools, subagents, files outside the project) goes to a two-stage classifier, a fast yes/no filter and then careful reasoning on what it flags. Blocked actions go back to the agent with a reason. After 3 denials in a row or 20 in total, the session stops and a human decides. Measured: 0.4% of harmless actions blocked, 17% of real overeager actions missed.](img/human-in-the-loop-tiers.svg)

- Safe reads (reading files, searching) run without any check.
- Edits inside the project run without a check, because they can be
  reviewed in version control.
- Everything else goes to a classifier model that reads the user's
  messages and the proposed tool call, and decides whether the user
  actually asked for this. It doesn't see the agent's own explanations, so
  the agent can't argue its way past it.
- The human comes back in when the agent keeps hitting walls: after 3
  denials in a row or 20 in a session, the agent stops and a person
  decides.

The measured result: the classifier wrongly blocked 0.4% of 10,000 real
tool calls, and let through 17% of 52 real overeager actions. That 17% is
the honest number. Most misses saw the danger but wrongly decided the
user's words covered it: "clean up the PR" doesn't mean "force-push".

## Where it gets tricky

**The spec and the data point different ways.** The MCP spec says a human
should always be able to deny tool calls. Anthropic's data says a human
asked about everything mostly stops checking, and replaces most prompts
with a classifier. Both can be true: keep a human's power to deny,
but ask rarely, so that asking means something.

**A classifier is not a wall.** Claude Code's own docs say the auto mode
classifier is a check on each action, not an isolation boundary. It can be
wrong, and it misses about one in six overeager actions. What limits the
damage of the ones it misses is [[sandboxing]]. For unattended runs, use
both.

**Compared with what?** Against no checks at all, auto mode is a big gain.
Against a person who carefully reads every prompt, Anthropic calls it
arguably a step back, and says it's no replacement for careful review of
high-stakes infrastructure changes. Where your users sit on that line is
something to measure, not assume.

**One data source.** The 93% figure and the classifier numbers come from
one company's own product. There's no independent study of approval
fatigue in agents yet.

## What this means when you build

- Don't ask about everything. Let reads and easily undone actions run.
- Ask before actions that are irreversible, touch shared systems, spend
  money, or send data outside your trust boundary. Too much access in the
  first place is [[excessive-agency]].
- Show the exact tool and arguments, not a summary written by the model.
- When a person denies, return the reason to the agent so it can adjust.
- Stop and hand over to a person after repeated denials.
- Put a sandbox under the agent, whatever approval scheme you use.
- Log every approval and denial. They make good cases for your evals.

## Further reading

- [How we built Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode),
  John Hughes et al. (Anthropic), 2026. The 93% approval rate, the
  incident log, the tiered classifier and its measured miss rates.
- [Model Context Protocol specification 2026-07-28: Tools](https://modelcontextprotocol.io/specification/2026-07-28/server/tools),
  MCP maintainers, 2026. The "human in the loop" requirement and what
  clients should show the user.
- [Choose a sandbox environment](https://code.claude.com/docs/en/sandbox-environments),
  Claude Code docs. How permission checks and isolation differ, and why
  the classifier is not a boundary.
