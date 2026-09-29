---
id: vision-models
title: How do models see images?
depth: deep
phase: 7
note: >-
  Images cut into patches and turned into tokens the model reads next to text.
needs: [tokenization, transformer]
leads_to: [pdf-input]
compare_with: []
updated: 2026-09-29
---

# How do models see images?

A model that reads images cuts each image into a grid of small squares,
called patches, and turns every patch into a vector the language model can
read, the same way it reads text tokens. So an image is just more tokens
in the prompt. That tells you what it costs, why big images get shrunk, and
why models still miss fine details like small text or two lines crossing.

## A photo becomes a grid of patches

Take a 1000×1000 photo and send it to Claude. The API covers it with
28×28-pixel squares. That's 36 squares across and 36 down, so 1,296
patches. Each patch counts as one visual token, and you pay for 1,296
input tokens, the same as 1,296 tokens of text.

The idea comes from the Vision Transformer (ViT), published in 2020. Text
models already worked on a sequence of [[tokenization|tokens]]. ViT asked:
what if an image were a sequence too? It works in four steps:

1. Cut the image into fixed-size square patches. The paper's best-known
   variant, ViT-L/16, uses 16×16-pixel patches.
2. Flatten each patch into one long list of pixel values.
3. Pass that list through a learned linear layer, which turns it into a
   vector of the size the model uses internally. This is the patch
   embedding, the image version of a token [[embeddings|embedding]].
4. Add a position embedding to each vector, so the model knows where in the
   image the patch came from, then feed the whole sequence into a standard
   [[transformer]].

The number of patches is the image area divided by the patch area. That's
why cost grows with pixels: double the width and height and you get four
times the patches.

In 2020 this was about image classification, and it only matched
convolutional networks when trained on large amounts of data. But the
shape stuck: patches in, vectors out.

## Teaching image vectors to mean something

A ViT on its own learns whatever its training task rewards. To be useful
next to a language model, its vectors need to line up with the meaning of
words. CLIP (OpenAI, 2021) did that.

CLIP trained an image encoder and a text encoder together on 400 million
image-caption pairs from the internet. Each training step takes a batch of
N images and their N captions. The two encoders turn them into vectors,
and training pushes each image's vector close to its own caption's vector
(by [[cosine-similarity]]) and away from the other N−1 captions. The task
is just: which caption goes with which image?

The result is an image encoder whose output already sits in a space shaped
by language. With no extra training, CLIP matched the accuracy of a
standard ImageNet classifier (ResNet-50) that had been trained on 1.28
million labeled examples. One of CLIP's encoders was a ViT with 14-pixel
patches, ViT-L/14.

## Plugging the encoder into an LLM

LLaVA (2023) showed the simplest way to give an LLM eyes. It has three
parts:

- **A vision encoder.** CLIP's ViT-L/14, used as is.
- **A projection.** One trainable matrix that turns each image vector into
  a vector the same size as the LLM's word embeddings.
- **The LLM.** Vicuna.

After the projection, the image vectors are "visual tokens". The LLM reads
them in the same sequence as the text tokens of your question and predicts
the answer one token at a time, as usual.

![The path from an image to an answer. A photo is cut into a grid of square patches. Each patch goes through the vision encoder, a transformer, and comes out as a vector. A projection maps each vector to the size of the LLM's word embeddings, making it a visual token. The visual tokens sit in one sequence with the text tokens of the question, and the LLM reads them all together to write the answer. Example: a 1000×1000 image in 28-pixel patches is 36×36 = 1,296 visual tokens.](img/vision-models-pipeline.svg)

Training came in two stages. First, with both the encoder and the LLM
frozen, only the projection learned, on 595,000 image-caption pairs. That
teaches the projection to translate between the two. Then the encoder
stayed frozen while the projection and the LLM were fine-tuned together on
instruction data (questions and answers about images) generated with
text-only GPT-4.

LLaVA is one design among several. Other models use more complex
connectors, like Flamingo's gated cross-attention or BLIP-2's Q-Former.
The common thread is the same: a vision encoder, something that
maps its output into the LLM's space, and an LLM that reads the result.

## What an image costs depends on the provider

Every provider turns images into tokens. They don't count them the same
way. As of 2026-09:

**Claude** counts 28×28-pixel patches: `⌈width/28⌉ × ⌈height/28⌉` tokens.
Each model has a size cap. Claude 4.7 and later models allow a long edge
up to 2,576 px and 4,784 visual tokens. Older models cap at 1,568 px and
1,568 tokens. A bigger image is shrunk, keeping its shape, until it fits.
So a 1920×1080 screenshot is 2,691 tokens on a newer model and 1,560 on an
older one, which first shrinks it to 1456×819.

**Newer OpenAI models** (gpt-6-astra, the gpt-5.6 family, gpt-5.5 and
others) count 32×32-pixel patches, then multiply by a per-model factor:
1.2 for most current models, 1.62 for gpt-4.1-mini. A `detail` setting
picks the budget. On gpt-5.5, `high` allows up to 2,500 patches and a
2,048-px long edge, `low` shrinks the image to fit in 512×512, and
`original` allows up to 10,000 patches. Any request that still needs more
than 30,000 patches is rejected.

**Older OpenAI models** (gpt-4o, gpt-4.1, gpt-4o-mini, gpt-5.1) use tiles
instead. The image is scaled to fit in 2048×2048, then its short side is
cut to 768 px, and the result is covered with 512×512 tiles. On gpt-4o,
each tile costs 170 tokens plus a flat 85. With `detail: low`, you pay
only the 85.

Here are the same two images under each scheme. The Claude numbers are
from Anthropic's table. The OpenAI numbers are worked out by hand from
OpenAI's formulas:

![Grouped bar chart of the input tokens for two images under four counting schemes. A 1000×1000 image: Claude, both tiers, 1,296 tokens; gpt-5.5 at detail high, 1,229; gpt-4o at detail high, 765. A 1920×1080 screenshot: Claude standard tier (shrunk to 1456×819), 1,560; Claude high-resolution tier, 2,691; gpt-5.5 high, 2,448; gpt-4o high, 1,105.](img/vision-models-costs.svg)

The spread is wide. The same screenshot costs anywhere from about 1,100 to
2,700 tokens. The cheaper counts are cheaper because the image was shrunk
more, so the model saw less detail. Tokens are also priced differently per
model (see [[token-pricing]]). Anthropic's own example: a 1000×1000 image
costs about $1.30 per thousand images on Claude Haiku 4.5, and about $6.48
per thousand on Claude Opus 5.

## Where it gets tricky

**Nobody publishes their production encoder.** The Anthropic and OpenAI
docs explain how images are billed, not how their vision encoders are
built, and we found no primary source from Anthropic, OpenAI or Google
that describes one. A 28-px or 32-px patch in the pricing formula is a billing unit.
It may match the encoder's real patch size, but no provider says so. The
ViT, CLIP and LLaVA story above is the public research that these systems
grew from, and it's the best public model of what's going on, not a
description of any product.

**Counts don't transfer.** A token count you measured on one provider
tells you nothing exact about another, or even about another model from
the same provider. Claude's two tiers differ by up to about three times
for the same image. OpenAI runs two different counting schemes at once.
Re-measure when you switch models, and date the numbers you write down.

**Shrinking eats small text.** When an image goes over the cap, it's
scaled down before the model sees it. Text that was readable in the
original can become a blur. Both providers list small text, rotated
images and very small images (Claude: under 200 px) as known weak spots.
Crop to the part you care about rather than sending a huge image and
hoping.

**The model can "see" something and still get it wrong.** In a 2024 test
called BlindTest, four leading vision models answered simple questions
like "do these two circles overlap?" and "how many times do these lines
cross?". They averaged 58% correct. The best, Claude 3.5 Sonnet, got 78%.
They did far better when the shapes were spread apart. The telling part:
probes showed the vision encoder's output did hold enough information to
answer. The failure was in the language model turning that into words.
Those were 2024 models, but the weak spots the test found
(overlap, counting, exact positions) are the same ones today's provider
docs still list. Counts and coordinates from a vision model are
estimates.

**Bigger isn't always better.** Higher resolution means more tokens, more
cost and more latency. It helps for dense documents, screenshots and
small text. For "what's in this photo?", a smaller image is often just as
good.

## What this means when you build

- Treat images as tokens. Count them with the provider's formula or its
  token-counting endpoint before you estimate cost or fill the
  [[context-window]].
- Resize and crop on your side. You control what's lost, and you don't
  pay for pixels the model will throw away anyway.
- Pick the detail level on purpose: low for rough questions, high or
  original for text-heavy images.
- On Claude, put the image before the question in the message.
- Don't trust exact counts, positions or tiny text without checking.
  Build a small [[evals|eval set]] of your own images for the task.
- For PDFs, the same machinery runs on every page. See [[pdf-input]].

## Further reading

- [An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale](https://arxiv.org/abs/2010.11929),
  Alexey Dosovitskiy et al. (Google), 2020. The Vision Transformer: images
  as sequences of patches, and the patch-embedding steps.
- [Learning Transferable Visual Models From Natural Language Supervision](https://arxiv.org/abs/2103.00020),
  Alec Radford et al. (OpenAI), 2021. CLIP: training an image encoder
  against captions so its vectors line up with text.
- [Visual Instruction Tuning](https://arxiv.org/abs/2304.08485),
  Haotian Liu, Chunyuan Li, Qingyang Wu and Yong Jae Lee, 2023. LLaVA:
  the plainest design for joining a vision encoder to an LLM, with its
  two-stage training.
- [Vision](https://platform.claude.com/docs/en/build-with-claude/vision),
  Anthropic docs. Claude's 28-pixel patch formula, resolution tiers, a
  size-to-tokens table and known limits.
- [Images and vision](https://developers.openai.com/api/docs/guides/images-vision),
  OpenAI docs. Both of OpenAI's counting schemes (32-pixel patches and
  512-pixel tiles), the `detail` setting and known limits.
- [Vision language models are blind](https://arxiv.org/abs/2407.06581),
  Pooyan Rahmanzadehgervi et al., 2024. Simple geometry tests that vision
  models fail, and evidence that the language side is where it breaks.
