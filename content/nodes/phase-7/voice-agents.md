---
id: voice-agents
title: How do voice assistants work?
depth: short
phase: 7
note: >-
  Speech in, speech out: chaining speech-to-text, an LLM and text-to-speech, or one model that does it all.
needs: [speech-to-text, text-to-speech, time-to-first-token]
leads_to: []
compare_with: []
updated: 2026-09-29
---

# How do voice assistants work?

A voice assistant (or voice agent) listens to someone talk, works out a
reply, and says it out loud, over and over. Most are built as a chain of
three models: [[speech-to-text]], an LLM, and [[text-to-speech]]. The other
option is one model that hears and speaks directly. Either way, the thing
that makes voice harder than chat is time: people expect an answer about
half a second after they stop talking.

## One turn, step by step

A caller says "Can you move my dentist appointment to Friday?" and stops.
Here's what a typical chained agent does with that, and how long each part
takes in one typical setup (numbers from the team behind Pipecat, an open
source voice agent framework):

1. The phone or browser records the audio, encodes it and sends it to the
   cloud. About 114 ms, most of it microphone input and a jitter buffer.
2. Speech-to-text transcribes it and decides the caller has finished
   talking. About 300 ms.
3. The transcript goes into the prompt, and the LLM starts answering. Its
   [[time-to-first-token]] is the biggest single cost: about 650 ms.
4. The first sentence of the reply is collected (20 ms) and sent to
   text-to-speech, which returns its first audio after about 120 ms.
5. The audio travels back and plays. About 89 ms.

![The time from the caller finishing speaking to hearing the first word of the reply, in one typical chained voice agent: about 114 ms to capture and send the audio, 300 ms for transcription and deciding the turn is over, 650 ms for the LLM's first token, 20 ms to collect a sentence, 120 ms for the first text-to-speech audio, and 89 ms to send and play it. Total 1,293 ms. A typical human reply comes after about 500 ms; 1,500 ms is the suggested target for a voice agent.](img/voice-agents-latency-budget.svg)

That adds up to about 1.3 seconds. For comparison, people usually answer
each other within about 500 ms, and 1,500 ms is a reasonable target for a
voice agent. The same team has gone as low as 500 ms by running all three
models in one GPU cluster and tuning them for speed instead of throughput.

The budget counts first token and first audio, not the time to finish.
Every stage is [[streaming|streamed]]: text flows into text-to-speech as
the LLM writes it, and audio plays as soon as the first chunk arrives.

## Knowing when the user is done

Step 2 hides a hard problem. Nothing tells the agent "I'm finished". The
simple approach is voice activity detection (VAD): classify each bit of
audio as speech or not speech, and end the turn after a pause, say 0.8
seconds. Set the pause long and the conversation feels stilted. Set it
short and the agent cuts people off whenever they stop to think.

Newer turn detection models are small classifiers trained on the words,
the intonation and the pronunciation, not only the silence, and the main
speech-to-text providers are building turn detection into their APIs.

Then there's the reverse: the user talks over the agent. To handle that,
every stage has to be cancellable, and the client has to stop playing
audio right away. The conversation history also has to be cut to what the
user actually heard, not everything the pipeline had generated. Word-level
timestamps from the speech services make that possible.

## Chained pipeline or one voice model

A **speech-to-speech** model takes audio in and produces audio out,
skipping the transcription and speech generation steps. As of 2026-09,
OpenAI's Realtime API works this way, and OpenAI, Google and AWS all offer
one.

What you gain:

- More natural-sounding speech. Most listeners rate it above standalone
  text-to-speech.
- Better understanding of how something was said, not only the words.
- The session handles turns, interruptions and tools for you.

What you give up:

- Less reliable instruction following and [[tool-calling]] than a text
  LLM.
- Speed, surprisingly. Audio takes more tokens than text, and bigger
  inputs are slower to process, so in practice these models are slower
  than a well-tuned chain.
- Cost. An agent on OpenAI's Realtime API costs 3 to 5 times as much as
  one built on GPT-4.1.
- Control. With a chain you can store the transcript, run a policy check
  on the text before anything is said, call your own systems, and swap any
  one model for another.

OpenAI's docs (as of 2026-09) add a third shape: a voice model that can
listen and speak at the same time (they call it full duplex) and hands the
thinking and tool calls to your existing text agent in the background, so
the caller can keep talking while work runs.

## Where it gets tricky

**The two sides have a stake.** The chained pipeline's strongest advocates
build a framework for chained pipelines. OpenAI, which sells the
speech-to-speech model, lists it as one choice among three. Both describe
the chain as the option that gives you control. How fast production agents move
to single voice models is an open question.

**Quoted latency is often not voice-to-voice.** Providers usually quote
inference time, because that's what they can measure. It leaves out the
network, the jitter buffer, turn detection and playback. Measure from
the user's side: from when they stop talking to when they hear the reply.

**"Let me check" isn't an answer.** A quick filler phrase makes the agent
feel responsive, but the user is still waiting for the real answer. Time
the two separately.

## What this means when you build

- Write down a latency budget per stage, and measure it at the client.
  Track the median and the 95th percentile ([[tail-latency]]), not only the
  average.
- Start with a chain unless natural-sounding speech matters more than
  control, cost and tool reliability.
- Stream everything, and make every stage cancellable.
- Test the task, not only the talk: for a booking assistant, check the
  booking was saved. Include accents, background noise, names and numbers
  in your test calls.
- Past the audio loop, tools, guardrails and evals work as in a text agent.

## Further reading

- [Voice AI & Voice Agents: An Illustrated Primer](https://voiceaiandvoiceagents.com/),
  Kwindla Hultman Kramer and contributors (Pipecat), 2025. The latency
  budget, turn detection, interruptions, and the case for chained
  pipelines.
- [Voice agents (OpenAI API docs)](https://developers.openai.com/api/docs/guides/voice-agents),
  OpenAI, undated. The three architectures OpenAI offers, when to chain,
  and how to evaluate and time a voice agent.
