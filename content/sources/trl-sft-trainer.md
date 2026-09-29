---
id: trl-sft-trainer
title: SFT Trainer (TRL documentation)
author: Hugging Face
url: https://huggingface.co/docs/trl/sft_trainer
published: 2026              # TRL v1.14.0 docs at the time of reading
accessed: 2026-09-29
kind: docs
primary: true
---

## Summary

The docs for TRL's supervised fine-tuning trainer, the usual open-source way to fine-tune an open model. It takes plain-text, prompt-completion or chat-format data, trains with next-token cross-entropy, by default only on the completion, and trains LoRA adapters when given a `peft_config`. Examples use Qwen3-0.6B.

## Key claims

- Version read: TRL v1.14.0. (links throughout the page)
- The usual method. "Supervised Fine-Tuning (SFT) is the simplest and most commonly used method to adapt a language model to a target dataset." (Looking deeper into the SFT method)
- What SFT is. "The model is trained in a fully supervised fashion using pairs of input and output sequences. The goal is to minimize the negative log-likelihood (NLL) of the target sequence, conditioning on the input." (Looking deeper into the SFT method)
- The loss is ordinary next-token prediction. "The loss used in SFT is the **token-level cross-entropy loss**" (Computing the loss)
- Data formats: plain text, `messages` conversations, and `prompt`/`completion` pairs, standard or conversational. "SFT supports both language modeling and prompt-completion datasets." (Expected dataset type and format)
- Loss only on the answer by default for prompt-completion data. "By default, the trainer computes the loss on the completion tokens only, ignoring the prompt tokens." (Train on completion only)
- Chat data can be trained on assistant turns only with `assistant_only_loss=True`. "This setting ensures that loss is computed **only** on the assistant responses, ignoring user or system messages." (Train on assistant messages only)
- LoRA through PEFT: pass `peft_config=LoraConfig()` to `SFTTrainer`. "allowing any user to conveniently train adapters and share them on the Hub, rather than training the entire model." (Train adapters with PEFT)
- Adapters want a higher learning rate. "When training adapters, you typically use a higher learning rate (≈1e‑4) since only new parameters are being learned." (Train adapters with PEFT, tip) The SFTConfig default learning rate is 2e-5. (SFTConfig note)
- QLoRA: `quantization_config` "Combine with `peft_config` for QLoRA training." (SFTTrainer parameters)
- Quick start trains Qwen/Qwen3-0.6B on the trl-lib/Capybara dataset. (Quick start)

## Visuals worth redrawing

- The prompt/completion split with loss only on the completion tokens.

## My notes

- Docs change with each TRL release; re-check the version when citing parameter names.
