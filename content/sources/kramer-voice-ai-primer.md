---
id: kramer-voice-ai-primer
title: "Voice AI & Voice Agents: An Illustrated Primer"
author: Kwindla Hultman Kramer and contributors (Pipecat)
url: https://voiceaiandvoiceagents.com/
published: 2025-02
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

A long guide to building voice agents, from the team behind Pipecat, an
open source voice agent framework. First written for the AI Engineering
Summit in February 2025, revised in June 2026. It explains the standard
loop (speech-to-text, LLM, text-to-speech), gives a stage-by-stage latency
budget, and covers turn detection, interruptions, and why most production
agents still chain three models instead of using one speech-to-speech
model. Primary in the sense that the authors build and run these systems;
it also argues for their own framework.

## Key claims

- Provider latency numbers are usually inference only. "You will often see AI platforms quote latencies that are not true "voice-to-voice" measurements." "From the provider side of things, the easy way to measure latency is to measure inference time." (1)
- Turn detection models use more than silence. "Small, specialized classification models can be trained on language, intonation, and pronunciation patterns." (5.8.4)
- Listeners prefer speech-to-speech voices. "In tests, most users rate output from the best speech-to-speech models as more natural than output from standalone text-to-speech models." (5.2.3)
- Latency is what's different about voice. "The big difference is latency. Humans expect fast responses in normal conversation. A response time of 500ms is typical." (1 Conversational Voice AI in 2026)
- Target. "If you are building conversational AI applications, 1,500 ms voice-to-voice latency is an important target to aim for." (5.1 Latency)
- Measure from the user's side. "It's worth learning how to accurately measure latency — from the end user's perspective — if you are building voice AI agents." (1)
- A typical round trip, mic to speaker, in ms: mic input 40, opus encoding 21, network 10, packet handling 2, jitter buffer 40, opus decoding 1, transcription and endpointing 300, llm ttfb 650, sentence aggregation 20, tts ttfb 120, opus encoding 21, packet handling 2, network 10, jitter buffer 40, opus decoding 1, speaker output 15. "Total ms 1293" (5.1 Latency, table)
- Faster is possible with effort. "We have demonstrated Pipecat agents that achieve voice-to-voice latency as low as 500 ms, by hosting all models within the same GPU-enabled cluster, and optimizing all models for latency instead of throughput." (5.1)
- The standard loop. "Input speech is transcribed, to create text input for the LLM. Text is assembled into a context — a prompt — and inference is performed by an LLM." Then "Output text is sent to a text-to-speech model to create audio output." (4 The basic conversational AI loop)
- Speech-to-speech models skip two stages. "A speech-to-speech LLM can be prompted with audio, rather than text, and can produce audio output directly. This eliminates the speech-to-text and text-to-speech parts of the voice agent orchestration loop." (5.2.3 What about speech-to-speech models?)
- Their weaknesses. "Speech-to-speech models do not follow instructions or call tools as reliably as text-mode LLMs. They are also slower, more expensive, less configurable, and harder to integrate into real-world agent systems." (5.2.3)
- Why they're slower in practice. "Lower latency is possible in theory, for speech-to-speech models, but audio uses more tokens than text. Larger token contexts are slower for the LLM to process." (5.2.3)
- Their strengths. "Better natural voice output is clearly perceptible, today." And better understanding "does seem to be a real benefit of these models." (5.2.3)
- Cost. "An agent built with the OpenAI Real-time API is 3 to 5 times more expensive than an agent built with GPT-4.1." (5.2.3)
- Open question. "how quickly production voice AI applications will move from the multi-model approach to using speech-to-speech APIs is still an open question." (5.2.3)
- Pause-based turn detection is a trade-off. "Setting a long pause interval creates stilted conversations — a very bad user experience. But with a short pause interval, the voice agent will frequently interrupt the user — also a bad user experience." (5.8.2 Push-to-talk)
- Their example VAD config stops after 0.8 s of silence: "VAD_STOP_SECS = 0.8". (5.8.1 Voice activity detection)
- Better turn detection. Pipecat Smart Turn "is a completely open source, native audio, turn detection model that supports 23 languages." "the leading STT model providers are all integrating turn detection into their STT APIs." (5.8.5)
- Interruptions. "To implement interruption handling, you need every part of your pipeline to be cancellable. You also need to be able to stop audio playout on the client very quickly." (5.9 Interruption handling)
- After an interruption, keep the context honest. "Usually, you want the conversation context to match what the user actually heard (rather than what your pipeline generated faster than realtime)." Word-level timestamps from the speech service help with this. (5.9.2)
- Echo. "Echo cancellation is very sensitive to latency, so echo cancellation has to run on the device (not in the cloud)." (5.6.2 Echo cancellation)

## Visuals worth redrawing

- The latency table (5.1) as a stacked bar: which stages eat the time.

## My notes

- The prose says the typical total is "about 1,200 ms" while the table sums to 1,293 ms. Use the table.
- Pipecat is their product, so the pro-cascade view has a stake in it. OpenAI's own docs (openai-voice-agents) present the single-model option as a first choice, so the disagreement is real.
