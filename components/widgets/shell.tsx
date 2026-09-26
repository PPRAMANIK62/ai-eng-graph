"use client";

import { MODEL } from "./models";
import { loadModel, useModel } from "./llm";
import w from "./widgets.module.css";

/** The frame every widget sits in: a small signage header, then the widget. */
export function Shell({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className={w.widget} aria-label={title}>
      <header className={w.head}>
        <span className={w.kicker}>{kicker}</span>
        <span className={w.title}>{title}</span>
      </header>
      {children}
    </section>
  );
}

const mb = (bytes: number) => `${Math.round(bytes / 1e6)} MB`;

/** Shows the load button and download progress until the shared model is ready, then the widget. */
export function ModelGate({ children }: { children: React.ReactNode }) {
  const model = useModel();
  if (model.phase === "ready")
    return (
      <>
        {children}
        <p className={w.fine}>
          {MODEL.name}, running in your browser on {model.backend.device === "webgpu" ? "your GPU (WebGPU)" : "your CPU (WebAssembly)"},{" "}
          {model.backend.dtype} weights.
        </p>
      </>
    );
  return (
    <div className={w.gate}>
      <p>
        This runs a real open model, {MODEL.name}, in your browser. Nothing is sent to a server. It downloads once (about{" "}
        {MODEL.mb.q4f16}–{MODEL.mb.q4} MB), then your browser keeps it.
      </p>
      {model.phase === "loading" ? (
        <div className={w.progress} role="status">
          <div className={w.bar}>
            <span style={{ width: `${model.total ? (100 * model.loaded) / model.total : 0}%` }} />
          </div>
          <span>
            {model.total && model.loaded >= model.total
              ? "Getting it ready…"
              : model.total
                ? `Downloading ${mb(model.loaded)} of ${mb(model.total)}`
                : "Starting…"}
          </span>
        </div>
      ) : (
        <button type="button" className={w.primary} onClick={loadModel}>
          {model.phase === "error" ? "Try again" : "Load the model"}
        </button>
      )}
      {model.phase === "error" && <p className={w.error}>Couldn&apos;t load it: {model.error}</p>}
    </div>
  );
}

/** Shows spaces and line breaks inside a token, which are part of it. */
export function visible(text: string) {
  return text.replace(/ /g, "·").replace(/\n/g, "↵").replace(/\t/g, "→") || "∅";
}
