"use client";

import { useCallback, useSyncExternalStore } from "react";
import { zoneHref } from "@/lib/phases";

// The planned trip (destination station id). Lives in the URL (?to=) and in localStorage,
// so it survives going from the map to a station and back.

const KEY = "ai-eng-graph:transit-to";
const EVENT = "transit-trip-change";

function read(): string | null {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("to");
    if (fromUrl) return fromUrl;
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("popstate", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("popstate", onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useTrip() {
  const to = useSyncExternalStore(subscribe, read, () => null);
  const setTo = useCallback((id: string | null) => {
    try {
      if (id) localStorage.setItem(KEY, id);
      else localStorage.removeItem(KEY);
    } catch {}
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("to", id);
    else url.searchParams.delete("to");
    url.searchParams.delete("at");
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(EVENT));
  }, []);
  return { to, setTo };
}

/** Link to a station page, carrying the trip along. */
export function stationHref(id: string, to: string | null) {
  return to ? `/n/${id}?to=${to}` : `/n/${id}`;
}

/** Link to a zone's map, at a given station. */
export function mapHref(phase: number, to: string | null, at?: string) {
  const q = new URLSearchParams();
  if (to) q.set("to", to);
  if (at) q.set("at", at);
  const s = q.toString();
  return s ? `${zoneHref(phase)}?${s}` : zoneHref(phase);
}
