"use client";

import type { WidgetName } from "@/lib/widgets";
import { NextTokenExplorer } from "./next-token-explorer";
import { RequestTimer } from "./request-timer";
import { TokenizerPlayground } from "./tokenizer-playground";

export function Widget({ name }: { name: WidgetName }) {
  switch (name) {
    case "tokenizer":
      return <TokenizerPlayground />;
    case "next-token":
      return <NextTokenExplorer />;
    case "request-timer":
      return <RequestTimer />;
  }
}
