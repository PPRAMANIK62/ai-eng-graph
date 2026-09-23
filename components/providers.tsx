"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "motion/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.8 }}>
        {children}
      </MotionConfig>
    </ThemeProvider>
  );
}
