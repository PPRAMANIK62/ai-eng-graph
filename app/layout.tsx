import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/providers";
import { transitFonts } from "@/components/transit/fonts";
import s from "@/components/transit/transit.module.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AI engineering map", template: "%s · AI engineering map" },
  description:
    "AI engineering as a metro map. One researched article per concept, linked by what you need to read first. Pick a destination and ride the route to it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${transitFonts} h-full`} suppressHydrationWarning>
      <body className={s.root}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
