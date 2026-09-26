import { describe, expect, test } from "bun:test";
import { draw, nucleusSize, ranked, softmax } from "./sampling";

// The worked example in the softmax article: logits 3, 2, 1 give 0.665, 0.245, 0.090.
const LOGITS = [3, 2, 1];

describe("softmax", () => {
  test("matches the softmax article's worked example", () => {
    const p = softmax(LOGITS, 1);
    expect(p[0]).toBeCloseTo(0.665, 3);
    expect(p[1]).toBeCloseTo(0.245, 3);
    expect(p[2]).toBeCloseTo(0.09, 3);
  });

  test("sums to 1 and survives huge logits", () => {
    const p = softmax([1000, 999, -1000], 1);
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(1, 10);
    expect(Number.isFinite(p[0])).toBe(true);
  });

  test("low temperature sharpens, high temperature flattens, order stays", () => {
    const cold = softmax(LOGITS, 0.5);
    const hot = softmax(LOGITS, 2);
    expect(cold[0]).toBeGreaterThan(0.665);
    expect(hot[0]).toBeLessThan(0.665);
    expect(ranked(cold)).toEqual([0, 1, 2]);
    expect(ranked(hot)).toEqual([0, 1, 2]);
  });

  test("temperature 0 is greedy", () => {
    expect([...softmax([1, 5, 2], 0)]).toEqual([0, 1, 0]);
  });
});

describe("top-p", () => {
  const p = softmax(LOGITS, 1);
  const order = ranked(p);

  test("keeps the smallest set that reaches p", () => {
    expect(nucleusSize(p, order, 0.5)).toBe(1); // 0.665 alone covers 0.5
    expect(nucleusSize(p, order, 0.9)).toBe(2); // 0.665 + 0.245 = 0.91
    expect(nucleusSize(p, order, 0.95)).toBe(3);
    expect(nucleusSize(p, order, 1)).toBe(3);
  });
});

describe("draw", () => {
  const p = softmax(LOGITS, 1);
  const order = ranked(p);

  test("only picks tokens inside the cut", () => {
    for (const r of [0, 0.3, 0.7, 0.999]) expect(draw(p, order, 1, r)).toBe(0);
  });

  test("picks in proportion to probability", () => {
    expect(draw(p, order, 3, 0.1)).toBe(0);
    expect(draw(p, order, 3, 0.7)).toBe(1); // past 0.665
    expect(draw(p, order, 3, 0.95)).toBe(2); // past 0.91
  });
});
