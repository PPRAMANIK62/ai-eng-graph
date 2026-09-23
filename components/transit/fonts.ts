import { Overpass, Public_Sans } from "next/font/google";

// Overpass descends from Highway Gothic, the US road-sign face: built to be read at a glance, at an angle.
// Public Sans (from the US Web Design System) is plain and steady for long reading, and shares that civic lineage.
export const transitSign = Overpass({ variable: "--transit-sign", subsets: ["latin"] });
export const transitText = Public_Sans({ variable: "--transit-text", subsets: ["latin"] });

export const transitFonts = `${transitSign.variable} ${transitText.variable}`;
