---
id: mcp
title: What is MCP?
depth: deep
phase: 5
note: >-
  Model Context Protocol: one standard way to plug tools and data into any model app.
needs: [tool-calling]
leads_to: []
compare_with: [tool-design]
updated: 2026-09-29
---

# What is MCP?

MCP, the Model Context Protocol, is a standard way for an AI application to
connect to outside tools and data. Someone writes an MCP server once for,
say, GitHub or a database, and any app that speaks MCP can use it. As an AI
engineer you'll use MCP servers others wrote, and sometimes write your own.
You also need to know that the protocol changed a lot on 2026-07-28, so
most tutorials describe an older version.

## The problem it solves

Say you're building a coding assistant and want it to read GitHub issues,
look up errors in Sentry and query your Postgres database. With plain
[[tool-calling]], you write each tool yourself: the definition the model
sees, the code that runs it, the auth. The next team building a different
assistant writes the same three integrations again. Every new data source
needs its own custom work, in every app.

Anthropic released MCP as an open standard on 2024-11-25 to fix that. The
idea comes from the Language Server Protocol, which standardized how code
editors add support for programming languages. MCP does the same between AI apps and
the tools and data they use. A service exposes itself once as an MCP
server, and every MCP-aware app can connect to it.

It spread quickly. By 2026-07, the four main official SDKs were at close
to half a billion downloads a month, and the TypeScript and Python SDKs had each
passed a billion downloads in total.

## Hosts, clients and servers

MCP has three roles:

- The **host** is the AI application: Claude Code, Claude Desktop, VS Code,
  or the app you're building. It owns the model and the conversation.
- A **client** is a connector inside the host. The host creates one client
  per server, and each client keeps its own connection.
- A **server** is a program that offers tools and data. It might be a local
  process on your machine or a service on the internet.

So when VS Code connects to the Sentry server and to a local filesystem
server, it runs two clients, one for each.

![An MCP host (an AI application such as VS Code or Claude Code) contains the model and one MCP client per server. Client 1 talks to a local filesystem server over stdio. Client 2 talks to a local database server over stdio. Client 3 talks to a remote Sentry server over Streamable HTTP. Each client has its own connection to exactly one server.](img/mcp-architecture.svg)

Messages are JSON-RPC 2.0: small JSON objects with a method name, an id and
parameters. They travel over one of two transports:

- **stdio**: the host starts the server as a local process and they talk
  through standard input and output. A local server usually serves one
  client.
- **Streamable HTTP**: the client sends HTTP POST requests to a remote
  server, which can stream replies with Server-Sent Events. A remote server
  usually serves many clients. OAuth is the recommended way to get tokens.

## What a server offers

A server can offer three kinds of things:

- **Tools**: functions the model can call, like `create_issue` or
  `run_query`. The model decides when to use them.
- **Resources**: data the app can read into context, like a file or a
  database schema.
- **Prompts**: reusable templates a user can pick, like a few-shot prompt
  for writing SQL against this database.

A database server might offer all three: query tools, the schema as a
resource, and a prompt with worked examples.

Going the other way, a server can ask the client for things. The main one
is **elicitation**: the server asks the user for missing input or a
confirmation mid-call. Two older client features are deprecated as of
2026-07-28: **sampling** (the server borrows the host's model) and
**logging** (the server sends log messages to the client). New servers
should call a model provider directly and log to stderr or OpenTelemetry.

Tools are by far the most used part, and MCP tools are ordinary tools. The
host fetches the tool list from every connected server, merges them into
one list, and hands that to the model as normal tool definitions. When the
model calls one, the host routes the call to the right server and passes
the result back. The model doesn't know or care that MCP is involved.
Everything in [[tool-design]] applies to MCP tools too.

## One tool call, start to finish

Here is what happens on the wire when your assistant uses a weather server
under the 2026-07-28 version.

1. Discover (optional). The client can send `server/discover` to learn
   which protocol versions and features the server supports. Every server
   must answer it, but the client doesn't have to ask.
2. List tools. The client sends `tools/list`. The server returns each
   tool's name, description and input schema, plus two cache hints:
   `ttlMs` (how long the list stays fresh, for example 300,000 ms, five
   minutes) and `cacheScope` (whether shared caches may keep it).
3. The model picks a tool. The host gives the tools to the model, which
   decides to call `weather_current` with `{"location": "San Francisco"}`.
4. Call. The client sends `tools/call` with the name and arguments.
5. Result. The server returns content, such as a text block with the
   forecast, and the host adds it to the conversation for the model.

Every request in steps 1, 2 and 4 carries a `_meta` field with the protocol
version, the client's name and version, and the client's capabilities. That
detail is new, and it's the heart of the 2026 change.

## What changed on 2026-07-28: no more sessions

Before this version, a connection started with a handshake: an
`initialize` request and an `initialized` confirmation. Over HTTP, an
`Mcp-Session-Id` header tied later requests to that session, and what a
server returned could depend on the connection. Server-initiated requests (asking the
client for input, a model completion or a list of folders) needed a
stream held open between them.

The 2026-07-28 spec removed all of that. There's no handshake and no
session ID. Each request describes itself in `_meta`, so the server can
handle it with no memory of earlier requests. The practical win: any
request can go to any server instance behind a plain round-robin load
balancer, without shared storage for session state. The maintainers said
this was one of the most requested changes.

![Two sequence sketches. Left, MCP before 2026-07-28: a handshake (initialize, a reply, initialized) opens a session, and later tools/list and tools/call requests carry an Mcp-Session-Id header tied to state kept for that session. Right, MCP 2026-07-28: there is no handshake; each request (an optional server/discover, then tools/list, then tools/call) carries its protocol version, client info and capabilities in _meta, so a round-robin load balancer can send each one to a different server instance.](img/mcp-stateless.svg)

The other changes follow from that:

- **State moves into the open.** If a server needs to remember something
  across calls, like a shopping cart, a tool returns a handle
  (`bsk_a1b2c3`) and the model passes it back as an argument. The
  maintainers found this works better than state hidden in the transport,
  because the model can see the handle.
- **Multi Round-Trip Requests (MRTR).** When a tool needs something from
  the user mid-call, the server returns `resultType: "input_required"` with
  its questions. The client gets the answers and retries the original call
  with them attached. No stream has to stay open.
- **Routing headers.** HTTP requests must carry `Mcp-Method` and `Mcp-Name`
  headers, so gateways and rate limiters can route on them without reading
  the JSON body.
- **Cacheable, ordered lists.** Tool lists carry cache hints and come back
  in a fixed order, so clients can cache them and model-side
  [[prompt-caching]] stays valid across reconnects.
- **Extensions.** Long-running Tasks moved out of the core into an
  extension, next to MCP Apps (interactive UI inside the chat).
- **Deprecations.** Roots, sampling, logging and the old HTTP+SSE transport
  are deprecated but keep working for at least twelve months.

The official TypeScript, Python, Go and C# SDKs support the new version.
If your code relied on session IDs, you have migration work to do.

## The cost of many servers

Connecting a server means its tool definitions go into the model's
context on every request. An agent wired to thousands of tools can have to
read hundreds of thousands of tokens of definitions before it reads the
user's request. Results
cost too: copying a two-hour meeting transcript from Google Drive into
Salesforce with direct tool calls sends the transcript through the model
twice, about 50,000 extra tokens.

Two fixes exist. One is tool search, covered in [[tool-design]]: load only
the definitions the model asks for. The other, from Anthropic in 2025, is
to stop calling MCP tools directly. Each server's tools become code files
(`./servers/google-drive/getDocument.ts`), and the model writes a short
script that imports what it needs and passes data between tools inside
the script. The transcript goes from Drive to Salesforce without entering
the context. In their example, loading only the tool definitions the
script needed cut token use from 150,000 to 2,000.
Cloudflare arrived at the same idea and calls it Code Mode. The catch is
that you're now running code the model wrote, which needs a real
[[sandboxing|sandbox]] with resource limits and monitoring.

## Where it gets tricky

**Most tutorials are out of date.** Anything written before 2026-07-28
probably teaches the `initialize` handshake and session IDs. They're gone.
Check which spec version a guide targets. Even the 2026-07-28 spec's own
overview page still says extensions are negotiated "during
initialization", a leftover from the old text.

**Connecting a server is running someone else's code.** The spec says
tools represent arbitrary code execution. A tool's description and its
annotations (such as "read-only") are claims made by the server, and the
spec tells clients to treat them as untrusted unless the server is
trusted. A malicious or compromised server can put instructions in a
description, which is [[prompt-injection]], and any tool that can send
data somewhere is a possible route for [[data-exfiltration]]. The spec asks hosts to get user consent before
calling tools, but it admits the protocol can't enforce any of this. That
is the host's job.

**Maybe you don't need MCP at all.** For coding agents, a popular view
(Simon Willison, 2025) is that shell commands work better. Coding agents
are very good at running command-line tools, so instead of an MCP server
you install a CLI and write an example command in an `AGENTS.md` file.
In his screenshot example, one command was enough for the agent to work
out other uses. It
costs almost no context and needs no server. Anthropic's code-execution
approach above points the same way: fewer direct tool definitions, more
code. MCP still earns its place when the agent can't run a shell, when
you want one integration shared across many apps, or when a service needs
OAuth and per-user permissions.

**Discovery is mandatory and optional at once.** Servers must implement
`server/discover`; clients may skip it and just send requests, handling a
version error if one comes back. That's by design, but it confuses people
reading the spec for the first time.

## What this means when you build

- Target the 2026-07-28 spec and a current SDK. Ignore tutorials that start
  with `initialize`.
- If your server needs state across calls, return a handle from a tool and
  put its lifetime in the description.
- Count the tokens your connected servers add to every request. If it's
  large, use tool search or a code-execution setup.
- Treat third-party servers like third-party code: review them, limit
  what they can reach, and ask the user before sensitive calls.
- For a coding agent with shell access, try a CLI and a line in
  `AGENTS.md` before reaching for an MCP server.

## Further reading

- [Model Context Protocol Specification, version 2026-07-28](https://modelcontextprotocol.io/specification/2026-07-28),
  MCP maintainers, 2026. The authoritative text: roles, features,
  extensions, and the security principles.
- [The 2026-07-28 Specification](https://blog.modelcontextprotocol.io/posts/2026-07-28/),
  David Soria Parra and Den Delimarsky, 2026. What changed and why: the
  stateless core, handles, MRTR, headers, caching, deprecations.
- [Architecture overview](https://modelcontextprotocol.io/docs/learn/architecture),
  MCP docs. Hosts, clients and servers, the two transports, and a full
  JSON walkthrough of discovery, listing and calling tools.
- [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol),
  Anthropic, 2024. The original announcement and the problem MCP was
  made to solve. The protocol details are out of date.
- [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp),
  Adam Jones and Conor Kelly (Anthropic), 2025. Why many servers get
  expensive, and presenting tools as code instead.
- [Designing agentic loops](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/),
  Simon Willison, 2025. The case for shell commands and an AGENTS.md file
  over MCP in coding agents.
