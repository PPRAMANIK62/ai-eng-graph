---
id: google-mlcc-embeddings
title: "Embeddings (Machine Learning Crash Course module: Introduction; Embedding space and static embeddings; Obtaining embeddings)"
author: Google for Developers
url: https://developers.google.com/machine-learning/crash-course/embeddings
published: 2025-08-25          # "Last updated 2025-08-25 UTC" on all three pages
accessed: 2026-09-23
kind: docs
primary: true
---

## Summary

Google's course module on embeddings, read across its three text pages: the intro (/embeddings), "Embedding space and static embeddings" (/embeddings/embedding-space) and "Obtaining embeddings" (/embeddings/obtaining-embeddings). It builds the idea from a food-recommendation example: one-hot vectors are huge and say nothing about similarity; an embedding places each item as a short list of numbers where distance means similarity. It then separates static embeddings (one vector per word, like word2vec) from contextual embeddings (a different vector per sentence, as in transformers).

## Key claims

- Starting point: one-hot vectors, one slot per item. For a 5,000-meal dataset each vector has 5,000 entries. "Each one-hot encoding vector has a length of 5,000 (one entry for each menu item in the dataset)." (Introduction)
- One-hot vectors are big and carry no notion of similarity; the summary's example: hot dogs are more like shawarmas than salads, but one-hot vectors can't show it. (Introduction, page summary, no quotable body sentence)
- What an embedding is. "An embedding is a vector representation of data in embedding space" (Embedding space)
- The order of the foods on the one-dimensional "sandwichness" line (Figure 3), with apple strudel placed between hot dog and shawarma. "Along an axis of sandwichness, from least to most: borscht, salad, pizza, hot dog, shawarma." (Embedding space, at Figure 3; re-opened 2026-09-23)
- In the 2D plot (Figure 4) only two foods get coordinates, and the text names their quadrants. "In Figure 4, “apple strudel” is in the upper-right quadrant of the graph and could be assigned the point (0.5, 0.3)" (Embedding space, below Figure 4; re-opened 2026-09-23)
- The food toy example: one made-up dimension, "sandwichness", then "dessertness" and "liquidness". Apple strudel might be (0.5, 0.3) and hot dog (0.2, –0.5) in 2D. (Embedding space, Figures 3–6)
- Each item is n numbers. "An embedding represents each item in n -dimensional space with n floating-point numbers (typically in the range –1 to 1 or 0 to 1)." (Embedding space)
- Distance means similarity. "In an embedding, the distance between any two items can be calculated mathematically, and can be interpreted as a measure of relative similarity between those two items." (Embedding space)
- Real spaces have many dimensions: for word embeddings often 256, 512 or 1024. "(For word embeddings, d is often 256, 512, or 1024." (Real-world embedding spaces)
- Real dimensions rarely have human meanings. "The individual dimensions are rarely as understandable as "dessertness" or "liquidness."" (Real-world embedding spaces)
- Embeddings depend on the task they were trained for: "cereal" and "breakfast sausage" would be close for a time-of-day model and far apart for a vegetarian classifier. "Embeddings will usually be specific to the task, and differ from each other when the task differs." (Real-world embedding spaces)
- Word embeddings come from predicting context: words in similar contexts are related ("horse" and "burro" in the Grand Canyon sentences). "Models trained to predict the context of a word assume that words appearing in similar contexts are semantically related." (Static embeddings)
- Static embedding: one vector per word, word2vec being the classic (and now largely superseded) example. "When each word or data point has a single embedding vector, this is called a static embedding ." (Static embeddings)
- Embeddings are learned as a layer of a network; training pulls similar items together. "In the course of training, the weights of the embedding layer will be optimized so that the embedding vectors for similar examples are closer to each other." (Obtaining embeddings, Training an embedding as part of a neural network)
- The limit of static embeddings: one point per word despite many meanings. "Orange" is a colour and a fruit; with word2vec it always sits nearer colours than juice. "with static embeddings, each word is represented by a single point in vector space, even though it may have a variety of meanings." (Contextual embeddings)
- Contextual embeddings fix that: a different vector per sentence. "Orange would have a different embedding for every unique sentence containing the word in the dataset." (Contextual embeddings)
- In transformers, self-attention does this, and a position embedding is added to each token embedding. "Transformer models use a self-attention layer to weight the relevance of the other words in a sequence to each individual word." (Contextual embeddings, expandable details)

## Visuals worth redrawing

- Figures 3–6 (Embedding space): foods on a "sandwichness" line, then a 2D plane with "dessertness", then 3D with "liquidness", with tangyuan added. The best gentle intro to "a vector is a position". Redraw with our own items.
- Figure 12 (Obtaining embeddings): a one-hot "hot dog" going into a network whose embedding layer turns it into [2.98, -0.75, 0].

## My notes

- The url is the module intro; claims name the sub-page they come from. All three pages were opened on 2026-09-23 and show the same "Last updated" date.
- The "dimensions of meaning" story (sandwichness) is explicitly a toy. The course itself says real dimensions are rarely interpretable. Say so in the article.
- The "d is often 256, 512, or 1024" figure is footnoted to Chollet's 2017 book; it describes classic word embeddings, not LLM hidden sizes (GPT-3's is 12,288).
- Covers distance as similarity but leaves the specific measures (cosine etc.) to another page, which fits our split with the `cosine-similarity` node.
- For the redrawn food figure (embeddings-food-space): only hot dog and apple strudel have coordinates in the course. The other foods' positions in our figure are placed by us to match the course's order and are drawn hollow and labelled illustrative.
