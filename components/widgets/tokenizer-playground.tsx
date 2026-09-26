"use client";

import { useEffect, useState } from "react";
import { ask } from "./llm";
import { TOKENIZERS, type TokenizerId } from "./models";
import type { TokenPiece } from "./protocol";
import { Shell, visible } from "./shell";
import w from "./widgets.module.css";

const SAMPLES: { label: string; text: string }[] = [
  { label: "English", text: "The cat sat on the mat and looked out the window." },
  { label: "Spanish", text: "El gato se sentó en la alfombra y miró por la ventana." },
  { label: "Hindi", text: "बिल्ली चटाई पर बैठी और खिड़की से बाहर देखने लगी।" },
  { label: "Japanese", text: "猫はマットの上に座って、窓の外を見た。" },
  { label: "Code", text: "def add(a, b):\n    return a + b" },
  { label: "Numbers", text: "12345 + 67890 = 80235" },
];

type Result = { state: "loading" } | { state: "done"; tokens: TokenPiece[] } | { state: "error"; error: string };

export function TokenizerPlayground() {
  const [text, setText] = useState(SAMPLES[0].text);
  const [picked, setPicked] = useState<TokenizerId | null>(null);
  const [results, setResults] = useState<Partial<Record<TokenizerId, Result>>>({});
  const [showIds, setShowIds] = useState(false);
  const [loaded, setLoaded] = useState<TokenizerId[]>([]); // tokenizers the reader asked for, in order

  // Re-split with every loaded tokenizer when the text changes (debounced) or a new one is picked.
  useEffect(() => {
    if (!loaded.length) return;
    let live = true;
    const timer = setTimeout(() => {
      for (const id of loaded) {
        setResults(r => (r[id]?.state === "done" ? r : { ...r, [id]: { state: "loading" } }));
        ask<"tokenized">({ kind: "tokenize", tokenizer: id, text }).then(
          res => live && setResults(r => ({ ...r, [id]: { state: "done", tokens: res.tokens } })),
          (e: Error) => live && setResults(r => ({ ...r, [id]: { state: "error", error: e.message } })),
        );
      }
    }, 200);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [text, loaded]);

  const pick = (id: TokenizerId) => {
    setPicked(id);
    setLoaded(l => (l.includes(id) ? l : [...l, id]));
  };
  const compareAll = () => {
    setLoaded(TOKENIZERS.map(t => t.id));
    setPicked(p => p ?? TOKENIZERS[0].id);
  };

  const current = picked ? results[picked] : undefined;
  const counts = loaded
    .map(id => ({ id, r: results[id] }))
    .filter((x): x is { id: TokenizerId; r: { state: "done"; tokens: TokenPiece[] } } => x.r?.state === "done");
  const most = Math.max(1, ...counts.map(c => c.r.tokens.length));
  const allMb = TOKENIZERS.filter(t => !loaded.includes(t.id)).reduce((a, t) => a + t.mb, 0);

  return (
    <Shell kicker="Try it" title="Tokenizer playground">
      <div className={w.samples} role="group" aria-label="Sample texts">
        {SAMPLES.map(s => (
          <button key={s.label} type="button" className={w.chip} aria-pressed={text === s.text} onClick={() => setText(s.text)}>
            {s.label}
          </button>
        ))}
      </div>
      <textarea
        className={w.input}
        value={text}
        onChange={e => setText(e.target.value.slice(0, 4000))}
        rows={3}
        aria-label="Text to split into tokens"
        spellCheck={false}
      />

      <div className={w.tabs} role="group" aria-label="Tokenizer">
        {TOKENIZERS.map(t => (
          <button key={t.id} type="button" className={w.tab} aria-pressed={picked === t.id} onClick={() => pick(t.id)} title={t.repo}>
            {t.name}
            {!loaded.includes(t.id) && <small>{t.mb} MB</small>}
          </button>
        ))}
        {allMb > 0 && (
          <button type="button" className={w.link} onClick={compareAll}>
            Compare all ({Math.round(allMb)} MB)
          </button>
        )}
      </div>

      {!picked && <p className={w.hint}>Pick a tokenizer to split the text. Each downloads once from Hugging Face and then stays in your browser.</p>}
      {current?.state === "loading" && <p className={w.hint}>Loading the tokenizer…</p>}
      {current?.state === "error" && <p className={w.error}>Something went wrong: {current.error}</p>}
      {current?.state === "done" && (
        <>
          <p className={w.stats}>
            <b>{current.tokens.length}</b> tokens · {[...text].length} characters ·{" "}
            {current.tokens.length ? ([...text].length / current.tokens.length).toFixed(1) : "0"} characters per token
            <label className={w.toggle}>
              <input type="checkbox" checked={showIds} onChange={e => setShowIds(e.target.checked)} /> Show ids
            </label>
          </p>
          <div className={w.tokens}>
            {current.tokens.map((t, i) => (
              <span key={i} className={w.token} data-tone={i % 5} title={`id ${t.id}`}>
                {showIds ? t.id : visible(t.text)}
              </span>
            ))}
          </div>
        </>
      )}

      {counts.length > 1 && (
        <table className={w.compare}>
          <caption>Same text, different tokenizers</caption>
          <tbody>
            {counts.map(({ id, r }) => (
              <tr key={id} aria-current={id === picked}>
                <th scope="row">{TOKENIZERS.find(t => t.id === id)!.name}</th>
                <td>
                  <span className={w.countBar} style={{ width: `${(100 * r.tokens.length) / most}%` }} />
                </td>
                <td>{r.tokens.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Shell>
  );
}
