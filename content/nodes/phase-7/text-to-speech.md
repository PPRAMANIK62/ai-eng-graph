---
id: text-to-speech
title: How does text-to-speech work?
depth: short
phase: 7
note: >-
  Generating speech from text, often by predicting audio as tokens, and why latency is the hard part.
needs: [streaming]
leads_to: [voice-agents]
compare_with: []
updated: 2026-09-29
---

# How does text-to-speech work?

Text-to-speech (TTS) takes a sentence and gives you back audio of a voice
saying it. A newer family of models predicts audio the way LLMs predict
text, one token at a time. For a builder the hard part is time: in a live
conversation, every millisecond before the first sound comes out is dead
air.

## Audio is too long to predict one sample at a time

Say you want ten seconds of speech. At 24,000 samples a second, that's
240,000 numbers, each one of 65,536 possible values (16-bit audio). Asking a
model to predict that one value at a time is a very long, very fine-grained
sequence.

Older TTS systems avoided this with two steps. One model turned text into a
mel spectrogram (a picture of how much energy is at each pitch over time),
and a second model, the vocoder, turned that picture into sound.

A newer approach, shown by Microsoft's VALL-E in 2023, turns audio into
tokens instead. A **neural audio codec** is a model trained to squeeze audio
into a short list of discrete codes and rebuild the audio from them. The
codec VALL-E used takes 24 kHz audio and produces 75 frames a second, 320
times fewer steps. Each frame is 8 codes, each picked from 1,024 options.
Our ten seconds of speech becomes a grid of 750 × 8 codes.

![How codec-based text-to-speech works. Top: the text and a 3-second sample of the target voice go into a language model that predicts the first code of each audio frame one after another. A second model fills in the other 7 codes of each frame. The codec decoder turns the codes back into a waveform. Bottom: ten seconds of 24 kHz audio is 240,000 samples, but only 750 codec frames of 8 codes each, 6,000 codes in total.](img/text-to-speech-codec.svg)

Once audio is tokens, TTS looks like the text generation you already know:
a [[transformer]] predicts the next audio token given the text and the
tokens so far ([[next-token-prediction]]). In VALL-E, one model predicts
the first code of each frame, one after another. The first code matters
most for rebuilding the sound. A second model then fills in the other
seven codes, without going one frame at a time. The codec's decoder turns
the finished grid back into a waveform.

This setup has a side effect. Give the model a 3-second recording of
someone as the start of the sequence and it continues in that voice, with
the same emotion and even the same room sound. VALL-E was trained on 60,000
hours of English speech to get there.

## Why latency is the hard part

In a voice app, the user doesn't care when the audio file is finished.
They care when they first hear something. That's the audio version of
[[time-to-first-token]], which TTS providers call time to first byte
(TTFB).

The fixes are the same ideas as [[streaming]] text:

- **Stream the audio out.** A regular endpoint returns the whole file in
  one response. A streaming endpoint sends audio chunks as they're made,
  over server-sent events, so playback starts early.
- **Stream the text in.** When the text comes from an LLM, it arrives a few
  tokens at a time too. A websocket connection lets you send text in and
  get audio out at the same time, so speech can start before the LLM has
  finished its answer.
- **Use a fast model.** ElevenLabs' Flash models take about 75 ms of model
  time as of 2026-09, with slightly lower audio quality than their larger
  model.
- **Pick a fast voice and format.** Stock voices render faster than
  professionally cloned ones, and higher-quality audio formats add delay.
- **Be close to the servers.** With Flash models over websockets,
  ElevenLabs quotes 100 to 150 ms to the first byte in North America,
  Europe and South East Asia, and 150 to 200 ms in South and North East
  Asia.

## Where it gets tricky

**Model speed isn't what the user hears.** A "75 ms" model means 75 ms of
compute. Network, region, the endpoint type and your own audio pipeline all
come on top. Measure time to first audio from the client.

**Buffering text is a hidden delay.** When text streams in, the TTS model
has to decide when it has enough to start. If you set it to wait for a fixed amount of text
before generating, it will sit idle while the LLM trickles tokens in.
Check how your provider decides when to start generating; ElevenLabs,
for one, has a mode that handles this for you.

**Token-based TTS can skip or repeat words.** The same kind of model that
can loop or lose its place in text can do it in audio. VALL-E's authors
saw words come out unclear, missing or duplicated, and traced it to the
model's attention losing its alignment with the text.

**Three seconds is enough to copy a voice.** That makes voice cloning cheap,
which is useful and also easy to misuse.

**You can't see inside commercial TTS.** VALL-E is a published research
model. Providers don't document whether their APIs work the same way, so
treat the mechanism above as how this family of models works, not as a
description of any one product.

## What this means when you build

- Measure time to first audio at the client, not model latency.
- Stream both ways: LLM text into TTS as it arrives, audio out to the
  player as it's made.
- Choose the fastest model and voice that still sound acceptable to your
  users, and listen to the output. Fast models trade some quality.
- The full budget, and what happens when the user interrupts, is covered
  in [[voice-agents]].

## Further reading

- [Latency optimization (ElevenLabs docs)](https://elevenlabs.io/docs/best-practices/latency-optimization),
  ElevenLabs, undated. Where TTS latency comes from, with numbers:
  model speed, streaming vs websockets, voices, and region.
- [Neural Codec Language Models are Zero-Shot Text to Speech Synthesizers](https://arxiv.org/abs/2301.02111),
  Wang et al. (Microsoft), 2023. The VALL-E paper: audio as codec tokens,
  and TTS as language modeling over them.
