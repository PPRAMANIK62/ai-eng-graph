"use client";

import { useMemo, useState } from "react";
import { ask } from "./llm";
import type { Reply } from "./protocol";
import { draw, nucleusSize, ranked, softmax } from "./sampling";
import { ModelGate, Shell, visible } from "./shell";
import w from "./widgets.module.css";

const TOP = 50; // candidates the worker decodes; the list shows the first SHOWN
const SHOWN = 12;

type Step = Extract<Reply, { kind: "stepped" }>;

export function NextTokenExplorer() {
  return (
    <Shell kicker="Try it" title="Next-token explorer">
      <ModelGate>
        <Explorer />
      </ModelGate>
    </Shell>
  );
}

function Explorer() {
  const [prompt, setPrompt] = useState("The best thing about learning to code is");
  const [step, setStep] = useState<Step | null>(null);
  const [promptText, setPromptText] = useState(""); // what the model saw before any picks
  const [history, setHistory] = useState<Step[]>([]); // earlier steps, for undo
  const [temperature, setTemperature] = useState(1);
  const [topP, setTopP] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Temperature and top-p never reorder tokens, so the order is fixed per step; only the numbers move.
  const order = useMemo(() => (step ? ranked(step.logits) : []), [step]);
  const probs = useMemo(() => (step ? softmax(step.logits, temperature) : null), [step, temperature]);
  const keep = probs ? nucleusSize(probs, order, topP) : 0;
  const neutral = useMemo(() => (step ? softmax(step.logits, 1) : null), [step]);

  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      const next = await ask<"stepped">({ kind: "step", top: TOP, prompt });
      setHistory([]);
      setPromptText(next.text);
      setStep(next);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const pick = async (times: number) => {
    if (!step) return;
    let cur = step;
    setBusy(true);
    setError(null);
    try {
      for (let i = 0; i < times; i++) {
        const p = softmax(cur.logits, temperature);
        const o = ranked(cur.logits);
        const id = draw(p, o, nucleusSize(p, o, topP), Math.random());
        const next = await ask<"stepped">({ kind: "step", top: TOP, ids: [...cur.ids, id] });
        setHistory(h => [...h, cur]);
        cur = next;
        setStep(next);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const undo = () => {
    const prev = history.at(-1);
    if (!prev) return;
    setHistory(h => h.slice(0, -1));
    setStep(prev);
  };

  const text = step?.text ?? "";
  const added = text.startsWith(promptText) ? text.slice(promptText.length) : "";
  const byId = new Map(step?.top.map(t => [t.id, t.text]));

  return (
    <div className={w.stack}>
      <form
        className={w.row}
        onSubmit={e => {
          e.preventDefault();
          start();
        }}
      >
        <input className={w.input} value={prompt} onChange={e => setPrompt(e.target.value)} aria-label="Start of the text" maxLength={400} />
        <button type="submit" className={w.primary} disabled={busy || !prompt.trim()}>
          {step ? "Start over" : "Predict"}
        </button>
      </form>

      {step && (
        <>
          <p className={w.sofar} aria-live="polite">
            {promptText}
            <mark>{added}</mark>
            <span className={w.caret} />
          </p>

          <div className={w.controls}>
            <label>
              <span>
                Temperature <b>{temperature === 0 ? "0 (greedy)" : temperature.toFixed(2)}</b>
              </span>
              <input type="range" min={0} max={2} step={0.05} value={temperature} onChange={e => setTemperature(+e.target.value)} />
            </label>
            <label>
              <span>
                Top-p <b>{topP.toFixed(2)}</b> · keeps {keep.toLocaleString()} of {step.logits.length.toLocaleString()} tokens
              </span>
              <input type="range" min={0.05} max={1} step={0.05} value={topP} onChange={e => setTopP(+e.target.value)} />
            </label>
          </div>

          <table className={w.candidates}>
            <thead>
              <tr>
                <th scope="col">Next token</th>
                <th scope="col">Chance</th>
                <th scope="col" className={w.num}>
                  Logprob
                </th>
                <th scope="col" className={w.num}>
                  Logit
                </th>
              </tr>
            </thead>
            <tbody>
              {order.slice(0, SHOWN).map((id, k) => {
                const p = probs![id];
                const cut = k >= keep;
                return (
                  <tr key={id} data-cut={cut || undefined}>
                    <td>
                      <code className={w.token} data-tone={k % 5}>
                        {visible(byId.get(id) ?? "?")}
                      </code>
                    </td>
                    <td className={w.chance}>
                      <span className={w.chanceBar}>
                        <span style={{ width: `${cut ? 0 : 100 * p}%` }} />
                        <span className={w.ghost} style={{ left: `${100 * neutral![id]}%` }} title="at temperature 1" />
                      </span>
                      <span>{cut ? "cut" : pct(p)}</span>
                    </td>
                    <td className={w.num}>{cut || p === 0 ? "−∞" : logprob(p)}</td>
                    <td className={w.num}>{step.logits[id].toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className={w.fine}>
            Chance is after temperature and top-p. The thin mark is the chance at temperature 1. Logprob is the natural log of the
            chance. One pass took {Math.round(step.ms)} ms for {step.ids.length} tokens.
          </p>

          <div className={w.row}>
            <button type="button" className={w.primary} disabled={busy} onClick={() => pick(1)}>
              Pick next token
            </button>
            <button type="button" className={w.secondary} disabled={busy} onClick={() => pick(10)}>
              Pick 10
            </button>
            <button type="button" className={w.secondary} disabled={busy || !history.length} onClick={undo}>
              Undo
            </button>
          </div>
        </>
      )}
      {busy && !step && <p className={w.hint}>Running the model…</p>}
      {error && <p className={w.error}>{error}</p>}
    </div>
  );
}

function pct(p: number) {
  if (p >= 0.995) return "100%";
  if (p >= 0.1) return `${Math.round(p * 100)}%`;
  if (p >= 0.001) return `${(p * 100).toFixed(1)}%`;
  return "<0.1%";
}

function logprob(p: number) {
  const s = Math.log(p).toFixed(2);
  return s === "-0.00" ? "0.00" : s.replace("-", "−");
}
