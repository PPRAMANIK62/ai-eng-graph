---
id: presidio
title: Presidio
author: Data Privacy Stack (formerly Microsoft)
url: https://presidio.dataprivacystack.org/
published: undated           # repo now at github.com/data-privacy-stack/presidio; microsoft.github.io/presidio redirects here
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

An open-source toolkit for finding and removing personal data in text and images. An analyzer finds entities (names, card numbers, locations, ID numbers) with named-entity recognition, regexes, rules and checksums; an anonymizer then replaces, redacts, masks, hashes or encrypts them. Microsoft started it; it has moved to community ownership under the Data Privacy Stack. It warns that automated detection will miss things.

## Key claims

- What it does: "It provides fast identification and anonymization modules for private entities in text and images", e.g. credit card numbers, names, locations, social security numbers. (Overview)
- Detection methods: "Named Entity Recognition, regular expressions, rule based logic and checksum with relevant context in multiple languages." (Overview)
- The anonymizer de-identifies what was found with operators such as replace, redact, mask, hash and encrypt. (Overview)
- The limit: "there is no guarantee that Presidio will find all sensitive information. Consequently, additional systems and protections should be employed." (Overview; same sentence in the repo README)
- New home: the GitHub README says "Presidio has moved to a new home!" and the project is community-owned under the Data Privacy Stack; repo at github.com/data-privacy-stack/presidio. (repo README)
- Modules: Analyzer, Anonymizer, Image Redactor, Structured. (repo README)
- LLM samples include masking PII in LLM calls through a LiteLLM proxy. (Samples)

## Visuals worth redrawing

- Text in, analyzer finds spans with entity types, anonymizer swaps them for placeholders.

## My notes

- I couldn't see a latest version number on the docs or README.
