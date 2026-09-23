---
id: bahdanau-align-translate
title: Neural Machine Translation by Jointly Learning to Align and Translate
author: Dzmitry Bahdanau, Kyunghyun Cho, Yoshua Bengio
url: https://arxiv.org/abs/1409.0473
published: 2014-09-01         # v1; ICLR 2015 oral; v7 revised 2016-05-19
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The paper usually credited with bringing attention into neural translation, three years before the transformer. Translation models of the time squeezed the whole source sentence into one fixed-length vector before writing the translation. The authors argue that vector is a bottleneck and let the model instead search back over the source words that matter for each word it writes.

## Key claims

- The setup being fixed: an encoder turns the source sentence into one fixed-length vector, and a decoder writes the translation from it. "consists of an encoder that encodes a source sentence into a fixed-length vector from which a decoder generates a translation." (Abstract)
- The problem: that single vector limits quality. "we conjecture that the use of a fixed-length vector is a bottleneck in improving the performance of this basic encoder-decoder architecture" (Abstract)
- The fix, which is attention in all but name: for each word it writes, the model searches the source for relevant parts. "allowing a model to automatically (soft-)search for parts of a source sentence that are relevant to predicting a target word" (Abstract)
- "Soft" means weighted, not a hard pick: no fixed segments are cut out. "without having to form these parts as a hard segment explicitly." (Abstract)
- Result: translation quality on par with the best phrase-based system for English–French. "we achieve a translation performance comparable to the existing state-of-the-art phrase-based system on the task of English-to-French translation." (Abstract)
- The learned alignments look sensible to people. "qualitative analysis reveals that the (soft-)alignments found by the model agree well with our intuition." (Abstract)

## Visuals worth redrawing

- Not checked; only the abstract page was read.

## My notes

- Only the arXiv abstract page was opened. Use this source for the history (why attention was invented, the fixed-length bottleneck), nothing deeper.
- Here attention sits on top of a recurrent network. The 2017 transformer paper (`vaswani-attention-is-all-you-need`) drops the recurrence and keeps only attention.
