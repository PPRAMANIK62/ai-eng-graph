"use client";

import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useHydrated } from "@/lib/progress";
import s from "@/components/transit/transit.module.css";

const OPTIONS = [
  { id: "light", label: "Day", Icon: Sun },
  { id: "dark", label: "Night", Icon: Moon },
  { id: "system", label: "Match system", Icon: Monitor },
] as const;

/** Day, night or system, sized for the signage bar. The page crossfades between themes where supported. */
export function ThemeSwitch({ id }: { id: string }) {
  const { theme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const current = hydrated ? theme : undefined; // the stored choice isn't known on the server

  const choose = (next: string) => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) return setTheme(next);
    document.startViewTransition(() => flushSync(() => setTheme(next)));
  };

  return (
    <div role="radiogroup" aria-label="Theme" className={s.themeSwitch}>
      {OPTIONS.map(({ id: value, label, Icon }) => (
        <button
          key={value}
          role="radio"
          aria-checked={current === value}
          aria-label={label}
          title={label}
          onClick={() => choose(value)}
          className={s.themeOption}
        >
          {current === value && (
            <motion.span layoutId={`theme-pill-${id}`} className={s.themePill} transition={{ type: "spring", duration: 0.4, bounce: 0 }} />
          )}
          <Icon className={s.themeIcon} strokeWidth={2.2} />
        </button>
      ))}
    </div>
  );
}
