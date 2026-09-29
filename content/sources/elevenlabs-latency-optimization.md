---
id: elevenlabs-latency-optimization
title: Latency optimization (ElevenLabs docs)
author: ElevenLabs
url: https://elevenlabs.io/docs/best-practices/latency-optimization
published: undated
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

ElevenLabs' checklist for cutting text-to-speech latency: use the fast
Flash models, stream the audio back, use a websocket when the text itself
arrives in pieces (from an LLM), pick voices that are faster to render, and
use a nearby region. It gives time-to-first-byte numbers by region. The page
has no date.

## Key claims

- Fast models trade some quality for speed. "Flash models deliver ~75ms inference speeds, making them ideal for real-time applications. The trade-off is a slight reduction in audio quality compared to Multilingual v2 ." (Use Flash models)
- The 75 ms is only the model. "75ms refers to model inference time only. Actual end-to-end latency will vary with factors such as your location & endpoint type used." (Use Flash models)
- Three endpoint types: "Regular endpoint : Returns a complete audio file in a single response." "Streaming endpoint : Returns audio chunks progressively using Server-sent events ." "Websockets endpoint : Enables bidirectional streaming for real-time audio generation." (Leverage streaming)
- Streaming cuts the wait. "Streaming endpoints progressively return audio as it is being generated in real-time, reducing the time-to-first-byte. This endpoint is recommended for cases where the input text is available up-front." (Streaming)
- Websockets fit LLM output. "The text-to-speech websocket endpoint supports bidirectional streaming making it perfect for applications with real-time text input (e.g. LLM outputs)." (Websockets)
- Waiting for text adds delay. "If auto_mode is disabled, the model will wait for enough text to match the chunk schedule before starting to generate audio." (Websockets)
- Voices differ in speed. Fastest to slowest: default voices, synthetic voices and Instant Voice Clones, then Professional Voice Clones. "Higher audio quality output formats can increase latency." (Choose appropriate voices)
- Distance matters. With Flash models over websockets, TTFB is 100-150ms in North America, Europe and South East Asia, and 150-200ms in South Asia and North East Asia. "Currently used regions include: USA, Netherlands and Singapore." (Consider geographic proximity)

## Visuals worth redrawing

- The TTFB-by-region table.

## My notes

- Vendor docs about their own product. The numbers are their claims, not independent measurements.
