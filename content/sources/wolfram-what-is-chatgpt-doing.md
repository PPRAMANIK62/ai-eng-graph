---
id: wolfram-what-is-chatgpt-doing
title: What Is ChatGPT Doing … and Why Does It Work?
author: Stephen Wolfram
url: https://writings.stephenwolfram.com/2023/02/what-is-chatgpt-doing-and-why-does-it-work/
published: 2023-02-14
accessed: 2026-09-23
kind: blog
primary: false
---

## Summary

A long explainer that builds up ChatGPT from the outside in: it produces a "reasonable continuation" of the text so far, one token at a time, by picking from a ranked list of next-word probabilities. It shows with runnable GPT-2 examples why always taking the top word gives flat, repetitive text and why a bit of randomness (temperature 0.8) reads better, then walks through where the probabilities come from and what's inside the network.

## Key claims

- The one thing the model does: continue the text in a reasonable way. "what ChatGPT is always fundamentally trying to do is to produce a “reasonable continuation” of whatever text it’s got so far" (It's Just Adding One Word at a Time)
- At each step it produces a ranked list of possible next words with probabilities. Worked example (a table image, GPT-2): after "The best thing about AI is its ability to" the top five are learn 4.5%, predict 3.5%, make 3.2%, understand 3.1%, do 2.9%. "it produces a ranked list of words that might follow, together with “probabilities”" (It's Just Adding One Word at a Time)
- The loop: ask for the next word, add it, repeat. "it’s essentially doing is just asking over and over again “given the text so far, what should the next word be?”—and each time adding a word." (It's Just Adding One Word at a Time)
- The unit is a token, which can be part of a word. "it’s adding a “token”, which could be just a part of a word, which is why it can sometimes “make up new words”." (It's Just Adding One Word at a Time)
- Always taking the top word gives flat text that can repeat itself. "if we always pick the highest-ranked word, we’ll typically get a very “flat” essay, that never seems to “show any creativity” (and even sometimes repeats word for word)." (It's Just Adding One Word at a Time)
- Picking lower-ranked words sometimes, at random, reads better. "if sometimes (at random) we pick lower-ranked words, we get a “more interesting” essay." (It's Just Adding One Word at a Time)
- Temperature controls how often lower-ranked words get used; 0.8 works well for essays, found by trial, not theory. "for essay generation, it turns out that a “temperature” of 0.8 seems best." (It's Just Adding One Word at a Time)
- Why you need a model instead of counting: with 40,000 common words there are 1.6 billion possible pairs and 60 trillion triples, far more than all written text can cover. "even the number of possible 2-grams is already 1.6 billion—and the number of possible 3-grams is 60 trillion." (Where Do the Probabilities Come From?)
- The end of the network: the last vector becomes about 50,000 scores, turned into probabilities for each possible next token; only about 3,000 tokens are whole words. "generates from it an array of about 50,000 values that turn into probabilities for different possible next tokens." (Inside ChatGPT)
- Every new token reads the whole text so far, including what the model wrote itself; that is the only loop. "when ChatGPT is going to generate a new token, it always “reads” (i.e. takes as input) the whole sequence of tokens that come before it, including tokens that ChatGPT itself has “written” previously." (Inside ChatGPT)
- Cost per token: GPT-3 has 175 billion weights and all of them are used for every token. "for each token that’s produced, there still have to be 175 billion calculations done" (Inside ChatGPT)
- Within one token, nothing loops; data flows forward once. "There’s no looping or “going back”. Everything just “feeds forward” through the network." (Inside ChatGPT)

## Visuals worth redrawing

- The five-row probability table for "The best thing about AI is its ability to" (learn 4.5%, predict 3.5%, make 3.2%, understand 3.1%, do 2.9%), first image in "It's Just Adding One Word at a Time". The cleanest example for the article's opening. Redraw as a bar chart.
- Greedy vs temperature 0.8 text samples (same section). The zero-temperature GPT-2 output falls into a loop, repeating "It's a very good example of how to use AI to improve your life." Redraw as two text boxes side by side with the repeated sentence highlighted.
- Log-log plot of next-word probabilities at temperature 0.8 (same section): probabilities drop off as a straight line, a power law. Shows the long tail of plausible next words.
- 2-gram letter probability grid (Where Do the Probabilities Come From?): the "q" column is empty except the "u" row. Nice intuition for "probabilities depend on what came before".

## My notes

- Dated: Feb 2023, describes ChatGPT as "a version of the so-called GPT-3 network with 175 billion weights". Current model sizes aren't public, so keep 175B tied to GPT-3.
- All the hands-on examples use GPT-2 (2019), not ChatGPT. The probability numbers above are GPT-2's.
- The table numbers are in an image, not the text, so they can be cited but not quoted.
- Wolfram calls temperature "voodoo" and says no theory explains why top-word text is flat. Holtzman et al. (sampling node) study this directly; the article should point there rather than leave it as a mystery.
- He switches between "word" and "token" freely. 3Blue1Brown does the same. The article should be strict: the model predicts tokens.
- "About 50,000" matches GPT-2/GPT-3's 50,257 (see `3blue1brown-transformers-gpt`). Modern tokenizers are bigger (tiktoken: `cl100k_base`, `o200k_base`).
- His description of the forward pass as having "no looping" is about computation within one token. It doesn't contradict Anthropic's finding that the model plans ahead: planning can be encoded in the internal state for the current token without any loop.
