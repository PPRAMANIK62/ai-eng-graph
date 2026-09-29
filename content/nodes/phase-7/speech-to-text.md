---
id: speech-to-text
title: How does speech-to-text work?
depth: short
phase: 7
note: >-
  Turning audio into a transcript, and what goes wrong.
needs: []
leads_to: [voice-agents]
compare_with: []
updated: 2026-09-29
---

# How does speech-to-text work?

Speech-to-text takes a recording and gives you back the words in it.
Models like OpenAI's Whisper do this with the same kind of [[transformer]]
that writes text: the
audio goes in, and the model writes the transcript one token at a time. That
means it can also fail like a text model, including writing words nobody
said.

## Audio becomes a picture, then text

Take a 90-second voice memo. Here's how Whisper, the open model OpenAI
described in 2022, turns it into text.

First the audio is resampled to 16,000 samples a second and cut into
30-second windows. The model always works on one 30-second window at a
time, because that's the length it was trained on.

Each window is turned into a **log-Mel spectrogram**: a grid that shows how
much energy there is at each pitch band (80 bands) in each short slice of
time (25 ms windows, moved 10 ms at a time). It's a picture of the sound, and
that picture is what the model reads.

![How Whisper turns audio into text. Audio is resampled to 16,000 samples a second and cut into 30-second windows. Each window becomes a log-Mel spectrogram (80 pitch bands, 25 ms slices). An encoder reads the spectrogram. A decoder then writes tokens one at a time: first a language token, then a task token (transcribe or translate), then whether to add timestamps, then the text. Silence gets its own no-speech token. Long audio is done one window after another, moving the window forward by the timestamps the model predicted.](img/speech-to-text-whisper.svg)

An **encoder** reads the whole spectrogram. A **decoder** then writes the
output one token at a time, the same way an LLM does
([[next-token-prediction]]), except it looks at the encoded audio while it
writes.

The first few tokens it writes aren't words. They're instructions: which
language is being spoken, whether to transcribe or translate into English,
and whether to include timestamps. If the window has no speech, the model
writes a special "no speech" token instead. One model covers all those tasks
because the task is just another token in the sequence.

For our 90-second memo, the model transcribes the first 30 seconds, moves
the window forward according to the timestamps it predicted, and repeats
until it reaches the end.

## Why it works on audio it never heard

Whisper's big idea was the data. It was trained on 680,000 hours of audio
from the internet, paired with transcripts that already existed there. The
labels are noisy, but there are a lot of them. Tested on other speech
datasets it never trained on, it made 55.2% fewer errors on average than a
model trained on the clean LibriSpeech set, even though both scored about
the same on LibriSpeech itself.

The same data explains its weak spot. About 438,000 of those hours were
English, and most other languages had less than 1,000 hours. Accuracy per
language tracks training data closely: roughly, errors halve for every 16
times more data. So "supports 98 languages" doesn't mean it's good at all
of them.

## Using it through an API

As of 2026-09, OpenAI's API recommends a newer model, `gpt-transcribe`, for
ordinary transcription, and keeps `whisper-1` for word timestamps,
subtitles and translation. The practical limits a builder runs into:

- **File size.** Uploads can be up to 25 MB. Longer recordings have to be
  compressed or split, and splitting in the middle of a sentence loses
  context and hurts accuracy.
- **Finished file vs live audio.** A finished file can
  [[streaming|stream]] partial text back while it's being processed. Audio
  still arriving from a microphone or a call uses a separate realtime
  transcription path.
- **Who said what.** Labeling speakers (diarization) is a separate model.
- **Jargon.** You can pass a prompt with context, a list of keywords you
  expect, and the expected languages. `whisper-1` only takes a 224-token
  prompt, so a long list of product names is better fixed afterwards by
  sending the transcript to a text model.

## Where it gets tricky

**It can hallucinate.** Because the decoder is a language model, it can
keep writing plausible text that isn't in the audio. The Whisper paper lists
getting stuck in repeat loops, dropping the first or last words of a window,
and, worst, writing a transcript unrelated to the audio at all. This is the
same [[hallucination]] problem text models have. Whisper's decoding works
around some of it by starting at [[temperature]] 0 and raising it step by step when
the output looks repetitive or the model is unsure.

**Keyword hints can backfire.** A keyword list makes the model more likely
to write those words, including when they weren't said. Only list terms you
expect to hear, and check that the list actually helps.

**Word error rate is a blunt measure.** The standard score, WER, counts
every difference from a reference transcript. "Ten percent" vs "10%" counts
as an error, so two good transcripts can score very differently. The Whisper
paper reports its scores after running both texts through a normalizer.
Do the same (case, punctuation, numbers) before comparing, or
you'll be measuring formatting.

## What this means when you build

- Test on your own audio: your accents, your microphones, your product
  names. General benchmark scores don't transfer well, especially outside
  English.
- Split long files at pauses, not at a fixed byte count.
- Treat the transcript as a guess. If a wrong word matters (names, numbers,
  medical terms), add a correction step or a human check.
- For live conversation, file transcription is the wrong tool. That's the
  job of the realtime path inside [[voice-agents]].

## Further reading

- [Robust Speech Recognition via Large-Scale Weak Supervision](https://arxiv.org/abs/2212.04356),
  Radford et al. (OpenAI), 2022. The Whisper paper: the spectrogram, the
  task tokens, the training data, and the failure modes on long audio.
- [Speech to text (OpenAI API docs)](https://developers.openai.com/api/docs/guides/speech-to-text),
  OpenAI, undated. The current models, file limits, streaming, speaker
  labels, and how to handle domain terms.
