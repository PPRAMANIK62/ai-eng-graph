---
id: radford-whisper
title: Robust Speech Recognition via Large-Scale Weak Supervision
author: Alec Radford, Jong Wook Kim, Tao Xu, Greg Brockman, Christine McLeavey, Ilya Sutskever (OpenAI)
url: https://arxiv.org/abs/2212.04356
published: 2022-12-06
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

The Whisper paper. OpenAI trained an off-the-shelf encoder-decoder
transformer on 680,000 hours of internet audio paired with its transcripts,
and got a model that transcribes well on test sets it never trained on. One
model does language detection, transcription, translation to English and
timestamps, chosen by special tokens. It also lists what still goes wrong on
long audio: repeat loops and made-up transcripts. Abstract read on arXiv,
the body on the ar5iv HTML version of the same paper.

## Key claims

- Trained on transcripts of internet audio at scale. "When scaled to 680,000 hours of multilingual and multitask supervision, the resulting models generalize well to standard benchmarks and are often competitive with prior fully supervised results but in a zero-shot transfer setting without the need for any fine-tuning." (abstract)
- Open weights. "We are releasing models and inference code to serve as a foundation for further work on robust speech processing." (abstract)
- Scores are reported after a text normalizer: "Results reported in word error rate (WER) for both models after applying our text normalizer." (robustness figure caption, section 3)
- The data mix. "Of those 680,000 hours of audio, 117,000 hours cover 96 other languages." Plus 125,000 hours of translation into English; the rest is English. (1 Introduction)
- The English share. Training data chart: "65% English Speech Recognition (438,218 hours)". (Figure 11, Training dataset statistics)
- Training examples are 30 seconds long. "We break audio files into 30-second segments paired with the subset of the transcript that occurs within that time segment." (2.1 Data Processing)
- A standard architecture on purpose. "We chose an encoder-decoder Transformer" (2.2 Model)
- Audio becomes a spectrogram first. "All audio is re-sampled to 16,000 Hz, and an 80-channel log-magnitude Mel spectrogram representation is computed on 25-millisecond windows with a stride of 10 milliseconds." (2.2 Model)
- Silence has its own token. "In the case where there is no speech in an audio segment, the model is trained to predict a <|nospeech|> token indicating this." (2.3 Multitask Format)
- The task is picked by a token. "The next token specifies the task (either transcription or translation) with an <|transcribe|> or <|translate|> token." Then a token says whether to predict timestamps. (2.3 Multitask Format)
- WER punishes harmless style differences. WER "penalizes all differences between the model's output and the reference transcript including innocuous differences in transcript style." (3.x, text normalization)
- Robustness. "the zero-shot Whisper model achieves an average relative error reduction of 55.2% when evaluated on other speech recognition datasets." Compared with a supervised LibriSpeech model that scores about the same on LibriSpeech. (3.x, robustness)
- More data per language, fewer errors. "We find a strong squared correlation coefficient of 0.83 between the log of the word error rate and the log of the amount of training data per language." The fit says "WER halves for every 16× increase in training data". (3.x, multilingual)
- English-heavy data. "our pre-training dataset is currently very English-heavy" and "most languages have less than 1000 hours of training data." (3.x, multilingual)
- Long audio is done window by window: "consecutively transcribing 30-second segments of audio and shifting the window according to the timestamps predicted by the model." (4.5 Strategies for Reliable Long-form Transcription)
- Decoding fallback: "We start with temperature 0, i.e. always selecting the tokens with the highest probability, and increase the temperature by 0.2 up to 1.0" when the average log probability is too low or the text compresses too well (repetition). (4.5)
- What still goes wrong: "getting stuck in repeat loops, not transcribing the first or last few words of an audio segment, or complete hallucination where the model will output a transcript entirely unrelated to the actual audio." (6 Limitations and Future Work)

## Visuals worth redrawing

- Figure 1 (overview): audio as a log-Mel spectrogram into the encoder, the decoder predicting special tokens then text. Redraw as a simple pipeline.

## My notes

- From 2022. OpenAI's API now recommends `gpt-transcribe` over `whisper-1` (see openai-speech-to-text). The paper is still the clearest public description of how a speech-to-text transformer is built.
- The arXiv PDF came back as binary through WebFetch; the quotes are from ar5iv.
