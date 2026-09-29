---
id: wang-vall-e
title: Neural Codec Language Models are Zero-Shot Text to Speech Synthesizers
author: Chengyi Wang, Sanyuan Chen, Yu Wu, et al. (Microsoft)
url: https://arxiv.org/abs/2301.02111
published: 2023-01-05
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The VALL-E paper. Older text-to-speech predicted a mel spectrogram and
turned it into sound with a vocoder. VALL-E instead turns audio into
discrete codes with a neural audio codec and treats text-to-speech as
language modeling over those codes. Given text and a 3-second recording of
a new speaker, it speaks the text in that voice. Abstract read on arXiv,
the body on the ar5iv HTML version.

## Key claims

- TTS as language modeling. "regard TTS as a conditional language modeling task rather than continuous signal regression as in previous work." (abstract)
- The tokens come from a codec. "we train a neural codec language model (called VALL-E ) using discrete codes derived from an off-the-shelf neural audio codec model" (abstract)
- Training data. "we scale up the TTS training data to 60K hours of English speech which is hundreds of times larger than existing systems." (abstract)
- Voice copying from a short sample. "synthesize high-quality personalized speech with only a 3-second enrolled recording of an unseen speaker as an acoustic prompt." (abstract)
- It copies more than the voice. "VALL-E could preserve the speaker's emotion and acoustic environment of the acoustic prompt in synthesis." (abstract)
- The older approach. Cascaded TTS systems "usually leverage a pipeline with an acoustic model and a vocoder using mel spectrograms as the intermediate representations." (1 Introduction)
- Why raw audio is hard to predict directly. "Since audio is typically stored as a sequence of 16-bit integer values, a generative model is required to output 2^16=65,536 probabilities per timestep to synthesize the raw audio." And "the audio sample rate exceeding ten thousand leads to an extraordinarily long sequence length". (3 Background: Speech Quantization)
- The codec shrinks the sequence. "The encoder produces embeddings at 75 Hz for input waveforms at 24 kHz, which is a 320-fold reduction in the sampling rate." (3)
- Each frame is several codes. "we choose eight hierarchy quantizers with 1024 entries each". "given a 10-second waveform, the discrete representation is a matrix with 750 × 8 entries, where 750 = 24,000×10 / 320 is the downsampled time step and 8 is the number of quantizers." (3)
- The first code matters most. "the first quantizer plays the most important role in reconstruction, and the impact from others gradually decreases." (Figure 2 caption)
- Two models. For the first quantizer's tokens "we train an autoregressive (AR) decoder-only language model"; for the second to last, "we train a non-autoregressive (NAR) language model." (4)
- Known failure. "some words may be unclear, missed, or duplicated in speech synthesis. It is mainly because the phoneme-to-acoustic language part is an autoregressive model, in which disordered attention alignments exist" (Limitations)

## Visuals worth redrawing

- Figure 1 (text and a 3-second prompt into the model, codec codes out, decoder to waveform). Redraw as a simple pipeline.

## My notes

- A 2023 research model, not a product. Good for the mechanism: audio becomes tokens, and a transformer predicts them one after another. None of my sources say whether commercial TTS APIs work exactly this way.
