// Renders a single input line with word-wrap and per-word noise applied

import { computeWordNoise } from '../../utils/noise.js';

// Renders words in a segment as inline spans
function SegmentWords({ words, color, fontSize, defaultColor, baseFontSize, lineIdx, segIdx, wordOffset, noiseSeed, settings }) {
  return words.map((word, i) => {
    const wordIdx = wordOffset + i;

    // whitespace token: fixed-width spacer
    if (/^\s+$/.test(word)) {
      return (
        <span key={`s-${segIdx}-${i}`} style={{
          display:    'inline-block',
          width:      `${word.length * settings.wordSpacing}px`,
          flexShrink: 0,
        }}>{'\u00a0'}</span>
      );
    }

    const wn = computeWordNoise(lineIdx, wordIdx, noiseSeed, settings);
    const transform = [
      wn.baselineY !== 0 && `translateY(${wn.baselineY}px)`,
      wn.rotation  !== 0 && `rotate(${wn.rotation}deg)`,
    ].filter(Boolean).join(' ') || undefined;

    const effectiveFontSize = fontSize ?? baseFontSize;

    return (
      <span key={`w-${segIdx}-${i}`} style={{
        display:       'inline-block',
        flexShrink:    0,
        marginRight:   `${settings.wordSpacing + wn.spacingExtra}px`,
        transform,
        fontSize:      `${effectiveFontSize}px`,
        letterSpacing: `${settings.letterSpacing + wn.letterSpacingExtra}px`,
        color:         color ?? defaultColor,
        lineHeight:    'inherit',
      }}>
        {word}
      </span>
    );
  });
}

// Renders one input line as a flex container with word-wrap. Wrapped rows become additional visual lines at the same line spacing.
export default function LineRenderer({ line, lineIdx, lineNoise, noiseSeed, settings, maxWidth }) {
  const { lineSpacing, fontFamily } = settings;
  const baseFontSize = settings.fontSize + lineNoise.fontSizeExtra;
  const slopeAngle   = lineNoise.slope;

  return (
    <div
      style={{
        minHeight:       `${lineSpacing + lineNoise.spacingExtra}px`,
        transform:       slopeAngle !== 0 ? `rotate(${slopeAngle}deg)` : undefined,
        transformOrigin: 'left center',
        display:         'flex',
        flexWrap:        'wrap',
        alignItems:      'baseline',
        maxWidth:        maxWidth != null ? `${maxWidth}px` : undefined,
        width:           maxWidth != null ? `${maxWidth}px` : undefined,
        fontFamily:      `'${fontFamily}', cursive`,
        fontSize:        `${baseFontSize}px`,
        lineHeight:      `${lineSpacing + lineNoise.spacingExtra}px`,
        overflow:        'visible',
      }}
    >
      {line.segments.map((seg, segIdx) => {
        const wordOffset = line.segments
          .slice(0, segIdx)
          .reduce((acc, s) => acc + s.words.length, 0);

        return (
          <SegmentWords
            key={segIdx}
            words={seg.words}
            color={seg.color}
            fontSize={seg.fontSize}
            defaultColor={settings.fontColor}
            baseFontSize={baseFontSize}
            lineIdx={lineIdx}
            segIdx={segIdx}
            wordOffset={wordOffset}
            noiseSeed={noiseSeed}
            settings={settings}
          />
        );
      })}
    </div>
  );
}
