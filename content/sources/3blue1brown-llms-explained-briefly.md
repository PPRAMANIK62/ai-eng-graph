---
id: 3blue1brown-llms-explained-briefly
title: Large Language Models explained briefly
author: Grant Sanderson (3Blue1Brown); text adaptation by Justin Sun
url: https://www.3blue1brown.com/lessons/mini-llm
published: 2024-11-20
accessed: 2026-09-23
kind: talk
primary: false
---

## Summary

A short visual lesson (text version of the video) on what an LLM is: a function that gives a probability for every possible next word, used over and over to write a reply. It shows how a chatbot is built on top of this by completing a script between a user and an AI assistant, explains why the model sometimes picks less likely words, and gives a sense of the training scale.

## Key claims

- The definition: an LLM predicts the next word for any text. "A large language model(LLM) is a sophisticated mathematical function that predicts what word comes next for any piece of text." (What is an LLM?)
- The output is a probability for every possible next word, not a single answer. "Instead of predicting one word with certainty, though, what it does is assign a probability to all possible next words." (What is an LLM?)
- A chatbot is the same loop over a script: lay out a user–assistant dialogue, add the user's message, and have the model predict the assistant's words one at a time. "Finally, you have the model repeatedly predict the next word that this hypothetical AI assistant would say in response, and that is what's presented to the user." (What is an LLM?)
- The model doesn't always pick the top word, because the result reads more naturally. "the output tends to look a lot more natural if you allow it to select less likely words along the way at random." (What is an LLM?)
- So the same prompt gives different answers even though the model itself is fixed. "even though the model itself is deterministic, a given prompt typically gives a different answer each time it's run." (What is an LLM?)
- Training data scale for GPT-3, in human terms. "For a standard human to read the amount of text that was used to train GPT-3, they would need to read non-stop, 24-7, for over 2,600 years." (How does an LLM predict the next word?)
- Size: "large" means hundreds of billions of parameters. "What puts the large in large language model is how they can have hundreds of billions of these parameters." (How does an LLM predict the next word?)
- The training signal is next-word prediction: hide the last word, compare the guess, nudge all parameters. "you pass in all but the last word from that example into the model and compare the prediction that it makes with the true last word from the example." (How does an LLM predict the next word?)
- Doing that for trillions of examples makes predictions good on unseen text too. "When this process is done for many, many trillions of examples, not only does the model start to give more accurate predictions on the training data, but it also starts to make more reasonable predictions on text that it's never seen before." (How does an LLM predict the next word?)
- Compute scale: at a billion operations per second, training the largest models would take over 100 million years. "It will actually take you well over 100,000,000 years." (How does an LLM predict the next word?)
- Pretraining alone gives an autocompleter, not an assistant; RLHF is the second stage. "The goal of auto-completing a random passage of text from the internet is very different from the goal of being a good AI assistant." (How does an LLM predict the next word?)
- The final step runs on the last vector only and turns it into the next-word prediction. "The model's prediction looks like a probability for every possible next word." (Transformers, figure caption)

## Visuals worth redrawing

- The torn-off movie script (intro): a user–AI dialogue where the AI's reply is missing, filled in one predicted word at a time ("used", "to"). Good opening picture for "a chatbot is next-word prediction on a script".
- Bar chart of next-word probabilities where the chosen word is not the top bar (What is an LLM?). Shows sampling in one image.
- The last vector turning into a bar chart over the vocabulary (Transformers section, caption "The model's prediction looks like a probability for every possible next word").

## My notes

- Aimed at beginners. Says "word" throughout instead of "token"; the follow-up lesson (`3blue1brown-transformers-gpt`) corrects this.
- The "2,600 years" and "100,000,000 years" figures are for GPT-3 and "the largest language models" as of 2024, without a stated calculation. Treat as order-of-magnitude illustrations.
- "Deterministic model, random output" is the cleanest one-line statement of where variety comes from; it agrees with Wolfram. Neither mentions that temperature 0 on real serving stacks can still vary (see sampling sources).
- Doesn't mention in-context learning or planning ahead. It does say the behavior is emergent and hard to explain ("This makes it incredibly challenging to understand why the model makes the exact predictions that it does."), which sets up the Anthropic interpretability post.
