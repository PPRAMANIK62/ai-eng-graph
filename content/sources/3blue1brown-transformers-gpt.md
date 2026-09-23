---
id: 3blue1brown-transformers-gpt
title: Transformers, the tech behind LLMs | Deep Learning Chapter 5
author: Grant Sanderson (3Blue1Brown); text adaptation by Justin Sun
url: https://www.3blue1brown.com/lessons/gpt
published: 2024-04-01
accessed: 2026-09-23
kind: talk
primary: false
---

## Summary

A visual walkthrough of a GPT-style transformer from input to output, using GPT-3's real numbers. For next-token prediction the useful parts are the beginning and the end: text becomes tokens and vectors, and at the end the last vector is multiplied by the unembedding matrix to give one score (logit) per vocabulary token, which softmax turns into probabilities. It also shows temperature as a constant inside softmax.

## Key claims

- The generation loop, in one paragraph: predict, sample, append, run again. "have it predict the next word, take a random sample from the distribution it just generated, then run it all again to make a new prediction based on all the text, including what it just added." (What is a GPT model?)
- Tokens, with a worked example: "To date, the cleverest thinker of all time was" splits as To | date | , | the | cle | ve | rest | thinker | of | all | time | was. "An input is first broken into small chunks that are known as tokens." (Tokens)
- GPT-3's vocabulary is 50,257 tokens, and the vectors are 12,288 numbers long. "Using the GPT-3 numbers, the vocabulary size is 50,257, and again, technically this consists not of words, per se, but different little chunks of text called tokens." (Embedding, Dot Product)
- GPT-3 has 175 billion parameters in just under 28,000 matrices. "GPT-3, for example, had an astounding 175 billion parameters." (Premise of Deep Learning)
- Context size: GPT-3 sees at most 2,048 tokens at once. "GPT-3 was trained with a context size of 2048 tokens." (Embedding, Beyond words)
- Only the last vector is used to predict the next token. "all the information necessary to predict the next word needs to be encoded into the last vector of the sequence" (Multilayer Perceptron)
- The unembedding step: one matrix maps the last vector to one score per vocabulary token, then softmax normalizes. "The first is to use another matrix that maps the very last vector in the context to a list of ~50,000 values, one for each token in the vocabulary" (Unembedding)
- Worked example of a good score: context mentions Harry Potter, ends "least favorite Professor", and the network should score "Snape" high. "a well-trained network would presumably assign a high number to the word Snape." (Unembedding)
- The raw scores are called logits. "machine learning people would refer to the components of that raw unnormalized output as the logits for the next word prediction." (Softmax)
- Softmax turns any list of numbers into probabilities: raise e to each number, then divide by the sum. "Softmax turns an arbitrary list of numbers into a valid distribution, in such a way that the largest values end up closest to 1, and the smaller values end up closer to 0." (Softmax)
- Temperature T sits inside softmax: higher T flattens the distribution, lower T sharpens it, and T = 0 always takes the top token. "when T is equal to 0, all the weight goes to the maximum value." (Softmax)
- Training uses every position at once: each vector in the last layer predicts the token right after it. "the training process turns out to be much more efficient if we use each vector in this final layer to simultaneously make a prediction for what comes immediately after it." (Unembedding)
- Similar meanings land close together; this happens before the transformer layers. "If you think of these vectors as giving coordinates in some high-dimensional space, words with similar meanings tend to land on vectors close to each other in that space." (What is a GPT model?)
- The overview of the whole network: vectors go through an attention block, where they "communicate with each other to update their values based on context", then a feed-forward block where "the vectors don't talk to each other; they all go through the same operation in parallel", and the two alternate many times. Example: "model" in "a machine learning model" vs "a fashion model". (What is a GPT model?)
- The embedding matrix is the first weights of the model: one column per token, starting random and learned. "The first matrix of the transformer, known as the embedding matrix , will have one column for each of these words." (Embedding Matrix)
- GPT-3's embedding matrix is 50,257 × 12,288, so 617,558,016 weights. "The embedding dimension is 12,288, giving us 617,558,016 weights in total for this first step." (Dot Product)
- Training settles on embeddings where directions carry meaning; nearest neighbours of "tower" share its "vibe". "it tends to settle on a set of embeddings where directions in this space have meaning." (Direction)
- woman − man is close to queen − king, but only "kind of": in the model he tried, queen was further off than the difference suggests. "the true embedding of queen is a little farther off than the difference would suggest, presumably because the way queen is used in training data is not merely a feminine version of a king." (Direction)
- Another direction: Italy − Germany + Hitler lands near Mussolini. (Direction, no short quote)
- Dot product as alignment: positive when two vectors point the same way, zero when perpendicular, negative when opposite. A "plurality" direction (cats − cat) gives higher dot products for plural nouns, and increasing values for one, two, three, four. "the dot product is positive when the vectors point in a similar direction, zero if they're perpendicular , and negative when they point in opposite directions." (Dot Product)
- The first vector per token is a context-free lookup; the network's job is to let it soak up context (the "king" who lived in Scotland; "quill" as hedgehog quill or pen). "It's effectively a lookup table with no input from the surroundings." (Beyond words)
- The embedding vectors also encode position. "these embeddings will also encode information about the position of the word" (Beyond words)
- The unembedding matrix is the embedding matrix with rows and columns swapped in shape, another ~617M parameters. "It's very similar to the embedding matrix, just with the dimensions of the rows and columns swapped" (Unembedding Matrix)

## Visuals worth redrawing

- The end of the network (Unembedding): last column vector × unembedding matrix W_U → ~50,000 logits → softmax → bar chart of probabilities. This is the main visual for "a probability for every token". Redraw with real sizes labeled: 12,288 in, 50,257 out.
- Softmax with a temperature slider (Softmax): same logits, distribution flattening as T rises and collapsing onto one bar at T = 0. Good candidate for a small interactive widget.
- The tokenized sentence "To| date|,| the| cle|ve|rest| thinker| of| all| time| was" (Tokens). Shows tokens aren't words.
- The overall loop (What is a GPT model?): text → predict distribution → sample → append → repeat.

## My notes

- Numbers are all GPT-3 (2020). Modern vocabularies are bigger (tiktoken names `cl100k_base` and `o200k_base`) and context windows are far longer than 2,048. Present 50,257 and 2,048 as "GPT-3's numbers", not current ones.
- Says "word" and "token" interchangeably after the Embedding section ("For the sake of simplicity, we will pretend that the input is cleanly broken into words").
- The softmax formula is described in words only ("raise e to the power of each number... divide each term by that sum"); the text doesn't show where exactly T goes in the formula beyond "a constant T inserted into all these exponents". The softmax and temperature nodes should use a textbook source (d2l) for the formula.
- T = 0 "all the weight goes to the maximum" is the math. Real APIs may still give varied output at T = 0, and some current Claude models don't accept a temperature setting at all (see `anthropic-sonnet-5-whats-new`). Flag that in the temperature node, not here.
- Agrees with Wolfram on the structure (last vector → ~50,000 values → probabilities).
