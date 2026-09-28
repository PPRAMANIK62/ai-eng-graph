// Navigation as a ride. Each navigation carries one view transition type; the animations live in app/globals.css.

export const NAV = { forward: ["forward"], back: ["back"], open: ["open"], close: ["close"] };

/** Riding toward a higher zone or a later stop moves the page left; riding back moves it right. */
export const toward = (from: number, to: number) => (to < from ? NAV.back : NAV.forward);

/** How a whole page enters and leaves, per type. Untyped navigations (browser back) just crossfade. */
export const PAGE_VT = { forward: "vt-forward", back: "vt-back", open: "vt-open", close: "vt-close", default: "none" };

/** A station's name, carried between the route card and "you are here" on the station sign. */
export const MORPH_VT = { open: "vt-morph", close: "vt-morph", default: "none" };
