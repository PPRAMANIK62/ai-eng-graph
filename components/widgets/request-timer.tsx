"use client";

import { useState } from "react";
import { ask } from "./llm";
import { ModelGate, Shell } from "./shell";
import w from "./widgets.module.css";

const QUESTION = "Explain in two sentences why the sky is blue.";

// Filler to make the prompt long, so prefill has real work to do. The content doesn't matter.
const CONTEXT = Array.from(
  { length: 20 },
  (_, i) => `Note ${i + 1}: the shipment left the warehouse on time, the driver checked the load, and the paperwork was filed.`,
).join("\n");

type Run = {
  label: string;
  promptTokens: number;
  outputTokens: number;
  ttft: number; // ms to the first token: prefill plus one decode step
  tpot: number; // ms per token after the first
  total: number;
  ticks: number[]; // ms after start, one per token
};

export function RequestTimer() {
  return (
    <Shell kicker="Try it" title="Request timer">
      <ModelGate>
        <Timer />
      </ModelGate>
    </Shell>
  );
}

function Timer() {
  const [question, setQuestion] = useState(QUESTION);
  const [long, setLong] = useState(false);
  const [maxTokens, setMaxTokens] = useState(64);
  const [live, setLive] = useState<{ text: string; ticks: number[] } | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    setBusy(true);
    setError(null);
    setLive({ text: "", ticks: [] });
    const prompt = long ? `${CONTEXT}\n\n${question}` : question;
    try {
      const res = await ask<"generated">({ kind: "generate", prompt, maxTokens }, p => {
        if (p.kind === "token") setLive(l => ({ text: (l?.text ?? "") + p.text, ticks: [...(l?.ticks ?? []), p.t - p.start] }));
      });
      const ticks = res.tokens.map(t => t.t - res.start);
      if (!ticks.length) throw new Error("The model returned no tokens.");
      const run: Run = {
        label: long ? "long prompt" : "short prompt",
        promptTokens: res.promptTokens,
        outputTokens: ticks.length,
        ttft: ticks[0],
        tpot: ticks.length > 1 ? (ticks.at(-1)! - ticks[0]) / (ticks.length - 1) : 0,
        total: res.end - res.start,
        ticks,
      };
      setRuns(r => [run, ...r].slice(0, 5));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const last = runs[0];
  const scale = Math.max(1, ...runs.map(r => r.total));

  return (
    <div className={w.stack}>
      <form
        className={w.stack}
        onSubmit={e => {
          e.preventDefault();
          send();
        }}
      >
        <textarea className={w.input} rows={2} value={question} onChange={e => setQuestion(e.target.value)} aria-label="Question" maxLength={600} />
        <div className={w.row}>
          <label className={w.toggle}>
            <input type="checkbox" checked={long} onChange={e => setLong(e.target.checked)} /> Add a long context first
          </label>
          <label className={w.toggle}>
            Up to
            <select value={maxTokens} onChange={e => setMaxTokens(+e.target.value)}>
              {[16, 64, 128, 256].map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            output tokens
          </label>
          <button type="submit" className={w.primary} disabled={busy || !question.trim()}>
            {busy ? "Running…" : "Send"}
          </button>
        </div>
      </form>

      {live && (
        <p className={w.sofar} aria-live="polite">
          {live.text || (busy ? "Reading the prompt…" : "")}
          {busy && <span className={w.caret} />}
        </p>
      )}
      {error && <p className={w.error}>{error}</p>}

      {last && !busy && (
        <dl className={w.metrics}>
          <div>
            <dt>Time to first token</dt>
            <dd>{fmt(last.ttft)}</dd>
          </div>
          <div>
            <dt>Time per output token</dt>
            <dd>{fmt(last.tpot)}</dd>
          </div>
          <div>
            <dt>Tokens in / out</dt>
            <dd>
              {last.promptTokens.toLocaleString()} / {last.outputTokens}
            </dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{fmt(last.total)}</dd>
          </div>
        </dl>
      )}

      {runs.length > 0 && (
        <div className={w.timelines} aria-label="Timeline of each run">
          {runs.map((r, i) => (
            <div key={runs.length - i} className={w.timeline}>
              <span className={w.timelineLabel}>
                {r.label}, {r.promptTokens.toLocaleString()} in
              </span>
              <div className={w.track}>
                <span className={w.prefill} style={{ width: `${(100 * r.ttft) / scale}%` }} title={`first token after ${fmt(r.ttft)}`} />
                {r.ticks.slice(1).map((t, k) => (
                  <span key={k} className={w.tick} style={{ left: `${(100 * t) / scale}%` }} />
                ))}
              </div>
            </div>
          ))}
          <p className={w.fine}>
            The solid block is the wait for the first token: prefill reads the whole prompt at once. Each tick after it is one
            decode step, one token. Run it with and without the long context and compare the block with the gaps.
          </p>
        </div>
      )}
    </div>
  );
}

function fmt(ms: number) {
  return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`;
}
