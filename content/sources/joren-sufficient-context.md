---
id: joren-sufficient-context
title: "Sufficient Context: A New Lens on Retrieval Augmented Generation Systems"
author: Hailey Joren, Jianyi Zhang, Chun-Sung Ferng, Da-Cheng Juan, Ankur Taly, Cyrus Rashtchian (Google)
url: https://arxiv.org/abs/2411.06037
published: 2024-11-09          # v3 2025-04-23, ICLR 2025
accessed: 2026-09-27
kind: paper
primary: true
---

## Summary

When a RAG system gets a question wrong, is it because the retrieved text didn't hold the answer, or because the model misused it? The paper labels each example as "sufficient context" or not with an LLM autorater, then looks at what models do in each case. Big models answer well when the context is enough, but when it isn't they often answer wrong instead of abstaining, and adding retrieved text makes them abstain less than with no context. They combine the sufficiency label with the model's own confidence to decide when to answer, which improves accuracy on the questions the model does answer.

## Key claims

- Main finding. Larger models "excel at answering queries when the context is sufficient, but often output incorrect answers instead of abstaining when the context is not." Smaller models (Mistral 3, Gemma 2) "hallucinate or abstain often, even with sufficient context." (abstract)
- The ideal. "the ideal behavior for a language generation model is to answer questions correctly when possible and to otherwise abstain." (§4.2)
- RAG reduces abstention. "Without RAG, Claude 3.5 Sonnet abstains on 84.1% questions, while with RAG, the fraction of abstentions drops to 52%." GPT-4o: 34.4% to 31.2%; Gemini 1.5 Pro: 100% to 18.6%. (§4.2, "Models Abstain Less with RAG"; the dataset isn't named in that paragraph, but the Figure 5 caption gives the same 100% for Gemini 1.5 Pro on FreshQA, so it's most likely FreshQA)
- Suggested cause: "the model’s increased confidence in the presence of any contextual information". (§4.2)
- Insufficient context doesn't mean wrong. "SOTA LLMs output correct responses 35–62% of the time with insufficient context." Table 2 lists why: yes/no or limited-choice questions (a guess can be right), multi-hop questions where the context has a fragment and the model fills the gap from its own knowledge, ambiguous queries, rater errors, and questions answerable closed-book. (§1, §4.3, Table 2)
- So a hard filter hurts. Abstaining whenever context is insufficient "can lower overall performance, since all models answer some questions correctly even with insufficient context". (§5.1)
- Selective generation: combine the binary sufficient-context label with the model's self-rated confidence (P(True) for open models, sampling 20 answers and asking 5 times; P(Correct) for proprietary ones) in a logistic regression, then "abstaining when the score is below a chosen threshold". "coverage" = share of questions answered. (§5.1)
- Result: "can reduce hallucinations by 2–10% on queries that the model answers" (§6); better accuracy–coverage trade-off than confidence alone, e.g. "gains of over 10% for Gemma 27B on HotpotQA in the highest accuracy regions". (§5.1)
- The threshold is a dial: it "allows for different operating settings in differing applications, such as strict accuracy compliance in medical domains or maximal coverage on creative generation tasks." (§5.1)
- Fine-tuning with "I don't know" answers makes models abstain more, but they "still hallucinate quite often and more than they abstain." (§5.2)
- Human-labeled check (appendix Table 4, "a curated set of challenging context-dependent questions"): with insufficient context (45.2% of cases), models abstained 50–73% of the time and hallucinated 15–40%; even with sufficient context, top models had a 14–16% error rate. (Appendix, Table 4a/b)
- Autorater: prompted Gemini 1.5 Pro labels sufficiency; the companion Google Research blog reports at least 93% accuracy. (§3; blog not used as a separate source)

## Visuals worth redrawing

- The selective accuracy vs coverage curve (Figure 8 in the blog, §5 in the paper): as you answer more questions, accuracy on the answered ones falls. Illustrative shape is enough; don't copy their numbers onto it.

## My notes

- Models are 2024 (Gemini 1.5, GPT-4o, Claude 3.5, Gemma 2). The pattern (RAG makes models answer more, including wrongly) is the lasting part.
- The 93% autorater figure is from the Google Research blog (2025-05-14), which I opened but haven't made a note for. Don't cite it from here.
- Read from arXiv HTML v3.
