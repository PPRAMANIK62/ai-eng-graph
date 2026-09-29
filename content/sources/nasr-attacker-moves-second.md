---
id: nasr-attacker-moves-second
title: "The Attacker Moves Second: Stronger Adaptive Attacks Bypass Defenses Against LLM Jailbreaks and Prompt Injections"
author: Milad Nasr, Nicholas Carlini, Chawin Sitawarin, Sander V. Schulhoff, Jamie Hayes, Michael Ilie, Juliette Pluto, Shuang Song, Harsh Chaudhari, Ilia Shumailov, Abhradeep Thakurta, Kai Yuanqing Xiao, Andreas Terzis, Florian Tramèr
url: https://arxiv.org/abs/2510.09023
published: 2025-10-10
accessed: 2026-09-29
kind: paper
primary: true
---

## Summary

A paper arguing that defenses against jailbreaks and prompt injection are tested the wrong way. Most are checked against a fixed list of known attack strings, or weak optimizers not aimed at the defense. When the authors ran adaptive attacks (gradient descent, reinforcement learning, random search, human red-teamers) built to beat each defense, they got past 12 recent defenses, most at over 90% attack success, even though most had reported near-zero rates.

## Key claims

- The two attacks, by goal: defenses against jailbreaks and prompt injections "aim to prevent an attacker from eliciting harmful knowledge or remotely triggering malicious actions, respectively". (Abstract)
- How defenses are usually tested: "against a static set of harmful attack strings, or against computationally weak optimization methods that were not designed with the defense in mind. We argue that this evaluation process is flawed." (Abstract)
- What to test against instead: "adaptive attackers who explicitly modify their attack strategy to counter a defense's design while spending considerable resources to optimize their objective." (Abstract)
- The result. "we bypass 12 recent defenses (based on a diverse set of techniques) with attack success rate above 90% for most; importantly, the majority of defenses originally reported near-zero attack success rates." (Abstract)

## Visuals worth redrawing

- None used; only the abstract was read. Willison's review (`willison-rule-of-two-attacker-moves-second`) has the human red-team detail.

## My notes

- Authors include people from OpenAI, Anthropic and Google DeepMind (per Willison's review).
