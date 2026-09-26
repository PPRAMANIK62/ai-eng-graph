// The sampling math the next-token explorer runs on a real logit row: temperature, softmax,
// top-p, and one weighted draw. Pure functions, so they're tested on their own (sampling.test.ts).

/** Probabilities for every token at this temperature. Temperature 0 is greedy: all of it on the top token. */
export function softmax(logits: ArrayLike<number>, temperature: number): Float64Array {
  const n = logits.length;
  const out = new Float64Array(n);
  let top = 0;
  for (let i = 1; i < n; i++) if (logits[i] > logits[top]) top = i;
  if (temperature <= 0) {
    out[top] = 1;
    return out;
  }
  // Subtracting the max before exp keeps the numbers finite; it doesn't change the result.
  const max = logits[top];
  let sum = 0;
  for (let i = 0; i < n; i++) {
    out[i] = Math.exp((logits[i] - max) / temperature);
    sum += out[i];
  }
  for (let i = 0; i < n; i++) out[i] /= sum;
  return out;
}

/** Token ids sorted from most to least likely. */
export function ranked(probs: ArrayLike<number>): number[] {
  return Array.from({ length: probs.length }, (_, i) => i).sort((a, b) => probs[b] - probs[a]);
}

/**
 * Top-p: the smallest set of most-likely tokens whose probabilities add up to at least p.
 * Returns how many of `order` (from ranked()) stay in.
 */
export function nucleusSize(probs: ArrayLike<number>, order: readonly number[], p: number): number {
  if (p >= 1) return order.length;
  let total = 0;
  for (let k = 0; k < order.length; k++) {
    total += probs[order[k]];
    if (total >= p) return k + 1;
  }
  return order.length;
}

/** One weighted draw among the first `keep` tokens of `order`, renormalized. `r` is uniform in [0, 1). */
export function draw(probs: ArrayLike<number>, order: readonly number[], keep: number, r: number): number {
  let total = 0;
  for (let k = 0; k < keep; k++) total += probs[order[k]];
  let target = r * total;
  for (let k = 0; k < keep; k++) {
    target -= probs[order[k]];
    if (target < 0) return order[k];
  }
  return order[keep - 1];
}
