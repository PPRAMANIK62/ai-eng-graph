---
id: openai-speech-to-text
title: Speech to text (OpenAI API docs)
author: OpenAI
url: https://developers.openai.com/api/docs/guides/speech-to-text
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

OpenAI's guide to transcribing audio files. As of 2026-09 the recommended
model is `gpt-transcribe`; a separate model labels speakers, and `whisper-1`
is kept for timestamps, subtitles and translation. It covers the 25 MB file
limit, splitting long audio, streaming partial text, and giving the model
context and expected terms. The page has no date.

## Key claims

- The default model. "Start with gpt-transcribe . This is the recommended model for transcribing recorded speech in its original language." (intro)
- File limit and formats. "Files can be up to 25 MB. Supported input formats are mp3 , mp4 , mpeg , mpga , m4a , wav , and webm ." (intro)
- Live audio goes elsewhere. "For audio that is still arriving from a microphone, call, or media stream, use Realtime transcription ." (intro)
- Long recordings. "For larger recordings, use a compressed audio format or split the file into chunks of 25 MB or less. Avoid splitting in the middle of a sentence, which can remove context and reduce accuracy." (Longer inputs)
- Streaming a finished file. "File transcription can stream partial text while the model processes a completed recording." Events are `transcript.text.delta`, then `transcript.text.done`. (Streaming transcriptions)
- Speaker labels. "Use gpt-4o-transcribe-diarize only when you need to identify who speaks during different parts of a recording." (Speaker diarization)
- Context for domain terms. "Use prompt , keywords , and languages with gpt-transcribe to improve transcription of domain terms and multilingual audio" (Add transcription context)
- Keywords can backfire. "Keywords are hints, not required output. Include only relevant terms, and evaluate whether they improve accuracy without causing unspoken terms to appear." (Add transcription context)
- Timestamps come from the older model. "Use whisper-1 when you need word or segment timestamps." (Timestamps)
- Language coverage is uneven. "Whisper supports 98 languages, but accuracy varies by language." (Supported languages)
- Whisper's prompt is small. "For whisper-1 , prompts have a 224-token limit and provide less control than the recommended transcription model." (Prompting)
- Fixing a transcript afterwards. "A text model can correct misspellings and handle longer terminology lists than Whisper's 224-token prompt window. Evaluate corrections against the original audio to avoid changing what the speaker said." (Improving reliability)

## Visuals worth redrawing

- None.

## My notes

- Model names change often. Date any model name used in an article.
- The page doesn't use the word "legacy" for whisper-1, but it steers new work to `gpt-transcribe`.
