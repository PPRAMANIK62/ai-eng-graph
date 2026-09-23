"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import type { TLine, TStation } from "./model";
import type { StationState } from "./transit-map";
import s from "./transit.module.css";

/** "Where to?" A combobox over station names and article titles. */
export function SearchBox({
  stations,
  lines,
  stateOf,
  onPick,
}: {
  stations: TStation[];
  lines: TLine[];
  stateOf: (id: string) => StationState;
  onPick: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const listId = useId();
  const color = new Map(lines.map(l => [l.id, l.color]));

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    const all = [...stations].sort((a, b) => a.name.localeCompare(b.name));
    if (!t) return all.slice(0, 8);
    const starts = all.filter(x => x.name.toLowerCase().startsWith(t));
    const rest = all.filter(x => !starts.includes(x) && (x.name.toLowerCase().includes(t) || x.title.toLowerCase().includes(t)));
    return [...starts, ...rest].slice(0, 8);
  }, [q, stations]);

  const pick = (id: string) => {
    onPick(id);
    setQ("");
    setOpen(false);
    input.current?.blur();
  };

  return (
    <div className={s.search}>
      <Search size={16} className={s.searchIcon} aria-hidden />
      <input
        ref={input}
        type="text"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={listId}
        aria-activedescendant={open && results[active] ? `${listId}-${results[active].id}` : undefined}
        aria-label="Where to? Search stations"
        placeholder="Where to?"
        value={q}
        onChange={e => {
          setQ(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={e => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive(a => Math.min(results.length - 1, a + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive(a => Math.max(0, a - 1));
          } else if (e.key === "Enter" && results[active]) {
            e.preventDefault();
            pick(results[active].id);
          } else if (e.key === "Escape") {
            setOpen(false);
            input.current?.blur();
          }
        }}
      />
      {open && results.length > 0 && (
        <ul id={listId} role="listbox" className={s.results}>
          {results.map((r, i) => (
            <li
              key={r.id}
              id={`${listId}-${r.id}`}
              role="option"
              aria-selected={i === active}
              data-active={i === active}
              onPointerDown={e => e.preventDefault()}
              onPointerEnter={() => setActive(i)}
              onClick={() => pick(r.id)}
            >
              <span className={s.resLines}>
                {r.lines.map(l => (
                  <i key={l} style={{ background: color.get(l) }} />
                ))}
              </span>
              <span className={s.resName}>{r.name}</span>
              <span className={s.resState} data-state={stateOf(r.id)}>
                {stateOf(r.id) === "done" ? "visited" : stateOf(r.id) === "ready" ? "ready" : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
