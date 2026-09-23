---
id: sennrich-subword-units
title: Neural Machine Translation of Rare Words with Subword Units
author: Rico Sennrich, Barry Haddow, Alexandra Birch
url: https://arxiv.org/abs/1508.07909
published: 2016-06-10         # v5, the ACL 2016 version; v1 was 2015-08-31
accessed: 2026-09-23
kind: paper
primary: true
---

## Summary

The paper that took byte pair encoding, a 1994 compression trick, and used it to split words into subword pieces for neural machine translation. You start from single characters, count every pair of neighbouring symbols, merge the most frequent pair into a new symbol, and repeat a fixed number of times. The result is a fixed-size vocabulary that can still spell any word, so rare and unseen words stop being a problem. Read the abstract and the full PDF (section 3.2 and Algorithm 1).

## Key claims

- The problem: models have a fixed vocabulary, but language doesn't. "Neural machine translation (NMT) models typically operate with a fixed vocabulary, but translation is an open-vocabulary problem." (Abstract)
- The fix: write rare and unknown words as sequences of subword units. "making the NMT model capable of open-vocabulary translation by encoding rare and unknown words as sequences of subword units." (Abstract)
- BPE started as data compression (Gage, 1994): repeatedly replace the most frequent pair of bytes with one unused byte. "a simple data compression technique that iteratively replaces the most frequent pair of bytes in a sequence with a single, unused byte." (§3.2)
- The adaptation: merge characters or character sequences instead of bytes. "Instead of merging frequent pairs of bytes, we merge characters or character sequences." (§3.2)
- The loop: start with the character vocabulary, count all symbol pairs, replace the most frequent pair ('A', 'B') with a new symbol 'AB', repeat. "We iteratively count all symbol pairs and replace each occurrence of the most frequent pair (‘A’, ‘B’) with a new symbol ‘AB’." (§3.2)
- Frequent words end up as a single symbol. "Frequent character n-grams (or whole words) are eventually merged into a single symbol" (§3.2)
- Vocabulary size = starting characters + number of merges, and the number of merges is the only setting. "the latter is the only hyperparameter of the algorithm." (§3.2)
- Words carry an end-of-word marker '·' so the original text can be restored, and pairs don't cross word boundaries, so training can run on a word list weighted by frequency. "For efficiency, we do not consider pairs that cross word boundaries." (§3.2)
- Toy example (Figure 1, Algorithm 1): dictionary {low: 5, lower: 2, newest: 6, widest: 3}; the first merges learned are r + · → r·, l + o → lo, lo + w → low, e + r· → er·. (Figure 1)
- At test time, split into characters and apply the learned merges; an unseen word like 'lower' becomes 'low er·'. "In our example, the OOV ‘lower’ would be segmented into ‘low er·’." (§3.2)
- Unlike other compression codes, the pieces stay readable as subwords, so the network can produce words it never saw. "our symbol sequences are still interpretable as subword units" (§3.2)
- Result: subword models beat a back-off dictionary baseline on WMT 15 English-German and English-Russian "by 1.1 and 1.3 BLEU, respectively." (Abstract)
- Their systems used 59,500 merges (separate BPE) and 89,500 (joint BPE). "with 59 500 merge operations, and joint BPE with 89 500 operations." (§4)

## Visuals worth redrawing

- Figure 1 / Algorithm 1: the four-word dictionary and the merge list r·, lo, low, er·. Redraw as a table of the word list after each merge, pairs counted with frequencies.

## My notes

- Published 2015 (v1) to 2016 (ACL). Translation, not LLMs. The GPT-2 byte-level version came later (see `huggingface-bpe-tokenization`, `karpathy-minbpe`).
- The paper's example text in Figure 1 says {'low', 'lowest', 'newer', 'wider'}, but the Algorithm 1 code uses 'low', 'lower', 'newest', 'widest'. A small inconsistency inside the paper; use the code version, whose frequencies are given.
- The '·' end-of-word marker is how this paper handles word boundaries. GPT-style tokenizers instead glue the leading space to the next word (see `karpathy-minbpe`).
