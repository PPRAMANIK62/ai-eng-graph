---
id: embeddings
title: What are embeddings?
depth: deep
phase: 1
note: >-
  A token or piece of text turned into a list of numbers, where similar meanings sit close together.
needs: [tokenization]
leads_to: [attention, cosine-similarity, embedding-models]
compare_with: []
updated: 2026-09-23
---

# What are embeddings?

An embedding is a list of numbers that stands in for a piece of text: one
token, a sentence, or a whole document. The numbers are chosen so that
things with similar meanings get similar numbers. You meet them in two
places: inside every LLM, where each token becomes an embedding before
anything else happens, and in embedding APIs, which you'll use to search
your own documents by meaning.

## A list of numbers is a position

Start with a toy. Say you want to place foods on a scale from "not a
sandwich" to "very much a sandwich". A hot dog scores high, a salad low,
soup lower still. Each food is now one number, a point on a line.

One number can't tell apple strudel from a hot dog, so add a second scale:
how much of a dessert it is. Now every food is two numbers, a point on a
flat map. Strudel sits up in the dessert corner, and the hot dog and
shawarma end up next to each other. Add a third scale, how liquid it is, and
borscht moves away from everything else.

![Three views of the same foods. First, one line for sandwichness, from borscht, salad and pizza up to hot dog and shawarma. Second, a flat map that adds dessertness: hot dog at (0.2, –0.5) sits near shawarma, and apple strudel at (0.5, 0.3) is up in the dessert corner. Third, a cube that adds liquidness, where borscht moves away from everything else.](img/embeddings-food-space.svg)

That list of numbers is a **vector**, and the list for one item is its
embedding. Two ideas carry over from this toy to the real thing:

- **Each item is a fixed-length list of numbers.** Every food gets exactly
  three numbers here. Every text gets exactly 1,536 from one of OpenAI's
  embedding models.
- **Distance means similarity.** You can measure how far apart two points
  are, and a short distance means the two things are alike.

Real embeddings differ in two ways. They have far more numbers: classic word
embeddings often use 256, 512 or 1,024, and GPT-3 used 12,288 per token.
And nobody picks the axes. They're learned, and a single axis almost never
means anything a person could name, like "dessertness".

## Why not just number the words?

A computer already has a way to turn words into numbers: give each word an
id. [[tokenization|Tokenization]] does exactly that for tokens. The trouble
is that an id says nothing about meaning. Token 318 isn't "closer" to token
319 in any useful sense.

The other classic trick, a **one-hot vector**, doesn't help either. For a
menu of 5,000 dishes, each dish becomes a list of 5,000 zeros with a single
1 in its own slot. Those lists are huge, and every dish is exactly as far
from every other dish. A hot dog is as different from a shawarma as it is
from a salad.

An embedding is short and dense instead: a few hundred or a few thousand
numbers, all of them doing work, arranged so that distance carries meaning.

## How the numbers get learned

Nobody writes embeddings by hand. They start as random numbers and get
adjusted during training, a little at a time, so that items that behave
alike end up near each other.

For words, "behave alike" means "show up in similar places". If your
training text has *they rode a horse down into the canyon* and *they rode a
burro down into the Grand Canyon*, a model that learns to predict
surrounding words will give "horse" and "burro" similar vectors.

This idea took off with **word2vec** in 2013. Its authors at Google showed
you could learn good word vectors from 1.6 billion words in under a day. They
also found something odd: directions in the space carried meaning. Take the
vector for Paris, subtract France, add Italy, and the nearest word is Rome.
Take "biggest", subtract "big", add "small", and you land near "smallest".

![Sketch, not real data. Arrows from France to Paris and from Italy to Rome point the same way, and so do the arrows from big to biggest and from small to smallest. In real models these arrows are only roughly parallel.](img/embeddings-analogy-sketch.svg)

These analogies work often, not always. The word2vec authors' own example
table would score only about 60% if you demanded exact matches, and it
includes misses like small → "larger" where "smaller" was expected. The
famous king − man + woman ≈ queen example is similar: in one model
3Blue1Brown tried, queen landed near the spot, but a little off it.

## Inside an LLM: every token becomes a row of a table

An LLM keeps a big table with one row per token in its vocabulary. After
tokenization turns your text into ids, each id picks its row, and that row
of numbers is what the network actually works with. From here on, the model
never sees the id again.

For GPT-3 (2020) the sizes were:

| | GPT-3 |
|---|---|
| Tokens in the vocabulary (rows) | 50,257 |
| Numbers per token (columns) | 12,288 |
| Numbers in the table | 617,558,016 |

That table is the first set of learned weights in the model. It starts
random, and training slowly arranges it so that tokens with similar meanings
sit close together. The model also mixes in information about each token's
position in the text, so it can tell "dog bites man" from "man bites dog".

At the far end of the model, a second table of the same size runs the other
way: it turns the final vector back into one score per vocabulary token,
which becomes the probability list in [[next-token-prediction]].

### A lookup has no context

Here's the catch. The table lookup ignores the surrounding text. The word
"orange" gets the same starting vector in both of these:

- She wore an **orange** scarf.
- He squeezed an **orange** for juice.

One point in space has to stand for a colour and a fruit. This kind of
one-vector-per-word embedding is called **static**, and it's how word2vec
works. In word2vec's vectors, "orange" always sits closer to other colours
than to "juice", whatever sentence it came from.

The layers after the lookup fix this. They pass information between tokens,
nudging "orange" toward the meaning its neighbours suggest. By the end, each
token's vector reflects the whole sentence, not just the word. These are
called **contextual** embeddings, and the mechanism that moves the
information is [[attention]].

![Sketch, not real data. The looked-up vector for orange sits among colours like red, blue and yellow. In 'She wore an orange scarf' the layers after the lookup keep it among the colours. In 'He squeezed an orange for juice' they move it over near juice, lemon and apple.](img/embeddings-orange-in-context.svg)

## Outside the model: text embeddings from an API

The second kind of embedding is the one you'll call yourself. An **embedding
model** takes a whole piece of text, a sentence or a page, and returns one
vector for all of it. It's a separate model from the chat model, with its own
endpoint and its own pricing. OpenAI bills it per input token.

As of 2026-09:

| Provider | Model | Numbers per text |
|---|---|---|
| OpenAI | `text-embedding-3-small` | 1,536 |
| OpenAI | `text-embedding-3-large` | 3,072 |
| Voyage AI | `voyage-4` family | 1,024 by default (256, 512 or 2,048 on request) |

Anthropic doesn't make an embedding model. It points Claude users to Voyage
AI, and suggests comparing vendors. So a Claude app that needs embeddings
uses a second provider.

Here's what you get from it. Take six short documents: one about the
Mediterranean diet, one about photosynthesis, one about rivers, one about
Shakespeare, one about 20th-century inventions, and one saying Apple's
quarterly earnings call is on Thursday, November 2, 2023. Embed all six.
Now embed the question "When is Apple's conference call scheduled?" and find
the document vector closest to it. You get the Apple sentence back. The
wording doesn't match, but the meaning does.

That's the core of semantic search, and the same trick drives clustering,
recommendations and classification: turn text into vectors, then compare
distances. How you measure the distance (usually cosine similarity), how you
pick an embedding model, and how you search millions of vectors quickly are
phase 2 topics.

### Two kinds of embedding, side by side

| | Token embeddings | Text embeddings |
|---|---|---|
| What gets a vector | One token | A whole text |
| Where it lives | Inside the LLM, as its first layer | A separate embedding model behind an API |
| Context | None at lookup; added by later layers | The whole text is read before the vector is made |
| Who uses it | The model itself | You: search, clustering, recommendations |
| Example size | 12,288 numbers (GPT-3) | 1,536 numbers (`text-embedding-3-small`) |

## Where it gets tricky

**"Embedding" means three things.** People use the word for the token
table, for the vectors flowing through the model's layers (which have
absorbed context and aren't really a single token's meaning anymore), and
for the output of an embedding API. When someone says "the embedding", ask
which one.

**The axes don't mean anything you can read.** The sandwichness picture is
a teaching toy. In a real model, training picks the axes, and a single
axis rarely lines up with a human idea.

**Vector arithmetic is a demo, not a feature.** Paris − France + Italy =
Rome is real, but it was picked because it works. The word2vec paper's
own showcase table would fail about 40% of the time on an exact-match
test. Don't build on analogies.

**Close means related, not correct or equal.** Embeddings capture what the
training rewarded. In a model trained to suggest dishes by time of day,
cereal and breakfast sausage sit close together. In a model that sorts
vegetarian from non-vegetarian, they're far apart. The same two texts can
be neighbours in one embedding model and strangers in another.

**Embedding models have a knowledge cutoff too.** OpenAI's
`text-embedding-3` models don't know about events after September 2021. For
new product names or jargon, their vectors may not place things well.

## What this means when you build

- **Embed queries and documents with the same model.** Vectors from
  different models live in different spaces and can't be compared. If you
  switch models, re-embed everything.
- **Size is a cost.** Every stored vector is a thousand or more numbers,
  and bigger vectors cost more to store and search. OpenAI
  lets you ask for shorter vectors (3,072 down to 1,024, for example) at a
  small cost in accuracy. Voyage vectors can be cut from 1,024 to 256 and
  stored as 8-bit or 1-bit numbers, 4× or 32× smaller.
- **Mark queries and documents when the API asks.** Voyage's `input_type`
  adds a short instruction in front of your text ("Represent the query for
  retrieving supporting documents: "). For retrieval, always set it.
- **On Claude, plan for a second vendor.** There's no Claude embedding model
  as of 2026-09.
- Inside the model, the step after the lookup is [[attention]], where token
  vectors start to take on context.

## Further reading

- [Embeddings (Machine Learning Crash Course)](https://developers.google.com/machine-learning/crash-course/embeddings),
  Google, 2025. The gentlest intro: the food example, one-hot vs
  embeddings, and static vs contextual embeddings.
- [Efficient Estimation of Word Representations in Vector Space](https://arxiv.org/abs/1301.3781),
  Mikolov et al. (Google), 2013. The word2vec paper, with the analogy
  results and their limits.
- [Transformers, the tech behind LLMs](https://www.3blue1brown.com/lessons/gpt),
  3Blue1Brown, 2024. The token embedding table inside GPT-3, with visuals of
  directions that carry meaning.
- [minbpe: LLM Tokenization lecture](https://github.com/karpathy/minbpe/blob/master/lecture.md),
  Andrej Karpathy, 2024. Where the token id meets the embedding table.
- [Vector embeddings](https://developers.openai.com/api/docs/guides/embeddings),
  OpenAI docs. The API view: model sizes, shortening vectors, and worked
  search and classification examples.
- [Embeddings](https://platform.claude.com/docs/en/build-with-claude/embeddings),
  Anthropic docs. Why Claude apps use Voyage AI, the six-document search
  example, and query vs document inputs.
