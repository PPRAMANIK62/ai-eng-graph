---
id: manning-iir-evaluation
title: Evaluation in information retrieval (Introduction to Information Retrieval, chapter 8)
author: Christopher D. Manning, Prabhakar Raghavan, Hinrich Schütze
url: https://nlp.stanford.edu/IR-book/html/htmledition/evaluation-in-information-retrieval-1.html
published: 2008              # Cambridge University Press; online HTML edition dated 2009-04-07
accessed: 2026-09-27
kind: book
primary: false
---

## Summary

The standard textbook chapter on how search systems are measured. You need a
test collection: documents, a set of information needs written as queries,
and a relevant/not-relevant judgment for query-document pairs. Precision and
recall are defined on sets, then extended to ranked lists (precision at k,
R-precision, MAP, NDCG). It also covers where the judgments come from
(pooling), how much human judges agree, and why you shouldn't tune on the
set you report. Read 8.1, 8.3, 8.4 and 8.5 as separate HTML pages under the
chapter URL.

## Key claims

- A test collection has three parts. "we need a test collection consisting of three things: A document collection A test suite of information needs, expressible as queries A set of relevance judgments, standardly a binary assessment of either relevant or nonrelevant for each query-document pair." (8.1, information-retrieval-system-evaluation-1.html)
- The judgment is called the gold standard. "This decision is referred to as the gold standard or ground truth judgment of relevance." (8.1)
- How many test needs. "As a rule of thumb, 50 information needs has usually been found to be a sufficient minimum." (8.1)
- Results vary a lot per query, so average over many. "you need to average performance over fairly large test sets, as results are highly variable over different documents and information needs." (8.1)
- Relevance is judged against what the person wants, not the words typed. "A document is relevant if it addresses the stated information need, not because it just happens to contain all the words in the query." (8.1)
- Don't tune on the test set. "It is wrong to report results on a test collection which were obtained by tuning these parameters to maximize performance on that collection." Tune on a separate development collection instead. (8.1)
- Recall definition. "Recall ( ) is the fraction of relevant documents that are retrieved" (8.3, evaluation-of-unranked-retrieval-sets-1.html, eq. 37)
- Precision definition. "Precision ( ) is the fraction of retrieved documents that are relevant" (8.3, eq. 36)
- Recall can be gamed by returning more. "you can always get a recall of 1 (but very low precision) by retrieving all documents for all queries!" (8.3)
- Recall only goes up as you retrieve more; precision usually goes down. "Recall is a non-decreasing function of the number of documents retrieved. On the other hand, in a good system, precision usually decreases as the number of documents retrieved is increased." (8.3)
- Which one matters depends on the user: web searchers want precision on the first page; "professional searchers such as paralegals and intelligence analysts are very concerned with trying to get as high recall as possible" (8.3)
- Precision, recall and F are set measures; ranked lists need more. "Precision, recall, and the F measure are set-based measures. They are computed using unordered sets of documents." (8.4, evaluation-of-ranked-retrieval-results-1.html)
- Precision at k: good results on the first page. "It has the advantage of not requiring any estimate of the size of the set of relevant documents but the disadvantages that it is the least stable of the commonly used evaluation measures and that it does not average well" (8.4)
- A cutoff can cap the score regardless of quality: "even a perfect system could only achieve a precision at 20 of 0.4 if there were only 8 documents in the collection relevant to an information need." (8.4, R-precision paragraph)
- MAP weights every query equally and has good stability. "Among evaluation measures, MAP has been shown to have especially good discrimination and stability." (8.4)
- Scores differ more across queries than across systems. "there is normally more agreement in MAP for an individual information need across systems than for MAP scores for different information needs for the same system." (8.4)
- NDCG is for graded (not just yes/no) relevance. (8.4, per the section on non-binary relevance)
- Judging is expensive, so large collections judge only a subset. "This is a time-consuming and expensive process involving human beings." (8.5, assessing-relevance-1.html)
- Pooling. "The most standard approach is pooling , where relevance is assessed over a subset of the collection that is formed from the top documents returned by a number of different IR systems" (8.5)
- Test questions should look like real use and ideally come from domain experts. "These information needs are best designed by domain experts." Random combinations of query terms are "generally not a good idea". (8.5)
- Humans don't agree perfectly. With kappa, agreement between judges in TREC and medical collections "normally falls in the range of ``fair'' (0.67-0.8)." (8.5)
- That modest agreement is a reason to keep labels binary. "The fact that human agreement on a binary relevance judgment is quite modest is one reason for not requiring more fine-grained relevance labeling from the test set creator." (8.5)

## Visuals worth redrawing

- Figure 8.2, the saw-tooth precision/recall curve for one ranked list (8.4). Not needed for our articles.
- The contingency table (relevant/nonrelevant × retrieved/not retrieved) in 8.3 is a simple one to redraw for recall.

## My notes

- Written for document search in 2008, before RAG. The ideas carry over directly if "document" means "chunk".
- The book does not cover MRR in chapter 8; for MRR use `voorhees-trec8-qa`.
- Marked `primary: false`: it's a textbook, not the people who first defined these measures. It is the standard reference for the definitions.
