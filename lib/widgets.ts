// Widgets an article can embed with a line of its own: {{widget:name}}.
// scripts/check.ts rejects any other name; components/widgets/widget.tsx renders them.

export const WIDGETS = ["tokenizer", "next-token", "request-timer"] as const;
export type WidgetName = (typeof WIDGETS)[number];

export const WIDGET_LINE = /^\{\{widget:([a-z0-9-]+)\}\}$/;
