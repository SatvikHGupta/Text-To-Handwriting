// Seeded PRNG and per-line/word noise computation
function hash32(n) {
  let x = n >>> 0;
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
  x = x ^ (x >>> 16);
  return (x >>> 0) / 0x100000000;
}

export function noise(seed, max) {
  return (hash32(seed) - 0.5) * 2 * max;
}

export function computeLineNoise(lineIndex, pageSeed, opts) {
  // different primes per property to avoid seed collisions
  const s1 = pageSeed ^ (lineIndex * 1000003);
  const s2 = pageSeed ^ (lineIndex * 999983 + 7);
  const s3 = pageSeed ^ (lineIndex * 999979 + 13);
  return {
    slope:         opts.lineSlopeEnabled       ? noise(s1, opts.lineSlopeMax)        : 0,
    spacingExtra:  opts.lineSpacingNoiseEnabled ? noise(s2, opts.lineSpacingNoiseMax) : 0,
    fontSizeExtra: opts.lineFontNoiseEnabled    ? noise(s3, opts.lineFontNoiseMax)    : 0,
  };
}

export function computeWordNoise(lineIndex, wordIndex, pageSeed, opts) {
  const s4 = pageSeed ^ (lineIndex * 998917 + wordIndex * 104729 + 17);
  const s5 = pageSeed ^ (lineIndex * 998903 + wordIndex * 104723 + 31);
  const s6 = pageSeed ^ (lineIndex * 998897 + wordIndex * 104717 + 43);
  const s7 = pageSeed ^ (lineIndex * 998893 + wordIndex * 104711 + 59);
  return {
    baselineY:          opts.wordBaselineEnabled      ? noise(s4, opts.wordBaselineMax)       : 0,
    rotation:           opts.wordRotationEnabled       ? noise(s5, opts.wordRotationMax)        : 0,
    spacingExtra:       opts.wordSpacingNoiseEnabled   ? noise(s6, opts.wordSpacingNoiseMax)    : 0,
    letterSpacingExtra: opts.letterSpacingNoiseEnabled ? noise(s7, opts.letterSpacingNoiseMax)  : 0,
  };
}

export function buildInkFilter(opts) {
  if (opts.inkBlurEnabled && opts.inkBlurAmount > 0) return `blur(${opts.inkBlurAmount}px)`;
  return 'none';
}

export function buildInkShadow(opts) {
  if (!opts.inkShadowEnabled || opts.inkShadowAmount <= 0) return 'none';
  return `0 0 ${opts.inkShadowAmount}px ${opts.fontColor}`;
}
