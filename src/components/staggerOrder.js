/** Deterministic shuffle, so a staggered reveal order is stable across renders. */
export function seededOrder(count, seed = 0x9e3779b9) {
  const order = Array.from({ length: count }, (_, i) => i);
  let state = seed;
  for (let i = count - 1; i > 0; i -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0;
    const j = state % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  // order[i] = the position cell i holds in the reveal sequence.
  const rank = new Array(count);
  order.forEach((cell, position) => {
    rank[cell] = position;
  });
  return rank;
}
