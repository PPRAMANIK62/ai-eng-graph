"use client";

// The page's side of the model worker. One worker per tab, started on first use, shared by every
// widget, so the model downloads and loads once however many widgets a page has.

import { useSyncExternalStore } from "react";
import type { Backend, FromWorker, Progress, Reply, Request } from "./protocol";

type Pending = { resolve: (r: Reply) => void; reject: (e: Error) => void; onProgress?: (p: Progress) => void };

let worker: Worker | null = null;
let nextId = 0;
const pending = new Map<number, Pending>();

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL("./llm.worker.ts", import.meta.url), { type: "module" });
  worker.onmessage = (e: MessageEvent<FromWorker>) => {
    const msg = e.data;
    const p = pending.get(msg.id);
    if (!p) return;
    if ("progress" in msg) return p.onProgress?.(msg.progress);
    pending.delete(msg.id);
    if (msg.ok) p.resolve(msg.reply);
    else p.reject(new Error(msg.error));
  };
  worker.onerror = e => {
    for (const p of pending.values()) p.reject(new Error(e.message || "The model worker crashed."));
    pending.clear();
    worker = null;
  };
  return worker;
}

export function ask<K extends Reply["kind"]>(req: Request, onProgress?: (p: Progress) => void): Promise<Extract<Reply, { kind: K }>> {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve: r => resolve(r as Extract<Reply, { kind: K }>), reject, onProgress });
    getWorker().postMessage({ id, req });
  });
}

// The model's state, shared by every widget on the page.
export type ModelState =
  | { phase: "idle" }
  | { phase: "loading"; loaded: number; total: number }
  | { phase: "ready"; backend: Backend }
  | { phase: "error"; error: string };

let state: ModelState = { phase: "idle" };
const listeners = new Set<() => void>();
const set = (s: ModelState) => {
  state = s;
  for (const l of listeners) l();
};

export function loadModel() {
  if (state.phase === "loading" || state.phase === "ready") return;
  const files = new Map<string, [number, number]>();
  set({ phase: "loading", loaded: 0, total: 0 });
  ask<"loaded">({ kind: "load" }, p => {
    if (p.kind !== "download") return;
    files.set(p.file, [p.loaded, p.total]);
    let loaded = 0;
    let total = 0;
    for (const [l, t] of files.values()) {
      loaded += l;
      total += t;
    }
    set({ phase: "loading", loaded, total });
  }).then(
    r => set({ phase: "ready", backend: r.backend }),
    (e: Error) => set({ phase: "error", error: e.message }),
  );
}

export function useModel() {
  return useSyncExternalStore(
    l => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
    () => IDLE,
  );
}
const IDLE: ModelState = { phase: "idle" };
