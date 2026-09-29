import { arrow, box, line, rect, text, svg, type Figure } from "../../lib/svg.ts";

// sources/radford-whisper.md: 16,000 Hz, 30-second segments, 80-channel log-Mel
// spectrogram on 25 ms windows, encoder-decoder transformer, language / task /
// timestamp tokens, <|nospeech|>, window shifted by predicted timestamps.
// The spectrogram cells are a drawing of the idea, not real data.
const whisper: Figure = {
  slug: "whisper",
  alt: "How Whisper turns audio into text. Audio is resampled to 16,000 samples a second and cut into 30-second windows. Each window becomes a log-Mel spectrogram (80 pitch bands, 25 ms slices). An encoder reads the spectrogram. A decoder then writes tokens one at a time: first a language token, then a task token (transcribe or translate), then whether to add timestamps, then the text. Silence gets its own no-speech token. Long audio is done one window after another, moving the window forward by the timestamps the model predicted.",
  render() {
    let b = "";
    // Step 1: waveform cut into windows
    b += text(20, 10, "1. Cut the audio into 30-second windows", { size: 13.5, weight: 600 });
    b += text(20, 30, "resampled to 16,000 samples a second", { size: 12.5, tone: "muted" });
    const wx = 20, wy = 70, ww = 420;
    let d = `M${wx},${wy}`;
    for (let i = 0; i <= 140; i++) {
      const x = wx + (i * ww) / 140;
      const amp = 16 * Math.abs(Math.sin(i * 0.37) * Math.cos(i * 0.11)) + 2;
      d += ` L${x.toFixed(1)},${(wy + (i % 2 ? amp : -amp)).toFixed(1)}`;
    }
    b += `<path d="${d}" class="s-grey" fill="none" stroke-width="1.2"/>`;
    const win = ww / 3;
    ["window 1", "window 2", "window 3"].forEach((l, i) => {
      b += rect(wx + i * win + 2, wy - 26, win - 4, 52, { tone: i === 0 ? "blue" : "grey", fill: "none", dash: i !== 0, sw: i === 0 ? 2 : 1.2 });
      b += text(wx + i * win + win / 2, wy + 44, `${l} (30 s)`, { anchor: "middle", size: 12, tone: i === 0 ? "blue" : "muted" });
    });

    // Step 2: spectrogram
    const sx = 500;
    b += line(sx - 24, 0, sx - 24, 130, { tone: "grid", sw: 1 });
    b += text(sx, 10, "2. Turn one window into a spectrogram", { size: 13.5, weight: 600 });
    b += text(sx, 30, "80 pitch bands × 25 ms slices", { size: 12.5, tone: "muted" });
    const cols = 26, rows = 8, cw = 13, ch = 8;
    for (let c = 0; c < cols; c++)
      for (let r = 0; r < rows; r++) {
        const v = Math.abs(Math.sin(c * 0.9 + r * 1.7) * Math.cos(c * 0.3 - r * 0.5));
        b += `<rect x="${sx + c * cw}" y="${46 + r * ch}" width="${cw - 1}" height="${ch - 1}" class="f-blue" opacity="${(0.12 + 0.8 * v).toFixed(2)}"/>`;
      }
    b += text(sx + cols * cw + 10, 50, "high", { size: 12, tone: "muted" });
    b += text(sx + cols * cw + 10, 46 + rows * ch, "low", { size: 12, tone: "muted" });
    b += text(sx + (cols * cw) / 2, 46 + rows * ch + 20, "time →", { anchor: "middle", size: 12, tone: "muted" });

    // Step 3: encoder-decoder
    const y3 = 170;
    b += line(20, y3 - 14, 900, y3 - 14, { tone: "grid", sw: 1 });
    b += text(20, y3 + 6, "3. The encoder reads it, the decoder writes tokens one at a time", { size: 13.5, weight: 600 });
    b += box(20, y3 + 36, 120, 44, "spectrogram", { tone: "blue", size: 13 });
    b += arrow(142, y3 + 58, 172, y3 + 58, { tone: "muted" });
    b += box(174, y3 + 36, 100, 44, "encoder", { tone: "blue", size: 13, weight: 600, sw: 2 });
    b += arrow(276, y3 + 58, 306, y3 + 58, { tone: "muted" });
    b += box(308, y3 + 36, 100, 44, "decoder", { tone: "orange", size: 13, weight: 600 });
    b += arrow(410, y3 + 58, 440, y3 + 58, { tone: "muted" });
    const toks: { t: string; tone: "purple" | "ink" }[] = [
      { t: "language", tone: "purple" },
      { t: "transcribe", tone: "purple" },
      { t: "timestamps?", tone: "purple" },
      { t: "“Hi,", tone: "ink" },
      { t: "it's", tone: "ink" },
      { t: "Sam…”", tone: "ink" },
    ];
    let tx = 444;
    for (const k of toks) {
      const w = k.t.length * 7.4 + 18;
      b += box(tx, y3 + 42, w, 32, k.t, { tone: k.tone === "purple" ? "purple" : "grey", size: 12.5, mono: k.tone === "ink" });
      tx += w + 6;
    }
    b += text(444, y3 + 96, "instruction tokens first, then the words", { size: 12, tone: "purple" });
    b += text(444, y3 + 114, "silent window? it writes a “no speech” token instead", { size: 12, tone: "muted" });

    // Step 4: slide
    const y4 = y3 + 150;
    b += line(20, y4 - 14, 900, y4 - 14, { tone: "grid", sw: 1 });
    b += text(20, y4 + 6, "4. Long audio: move the window forward by the timestamps it predicted, and repeat", { size: 13.5, weight: 600 });
    return svg(
      {
        width: 920,
        height: y4 + 20,
        title: "How Whisper turns speech into text",
        credit: "Mechanism from Radford et al., “Robust Speech Recognition via Large-Scale Weak Supervision” (OpenAI, 2022). Spectrogram drawn for illustration, not data.",
        desc: whisper.alt,
      },
      b,
    );
  },
};

export default [whisper];
