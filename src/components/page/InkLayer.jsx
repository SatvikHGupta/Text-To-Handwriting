// Main ink layer: renders all text lines with noise and ink effects

import { computeLineNoise, buildInkFilter, buildInkShadow } from '../../utils/noise.js';
import LineRenderer from './LineRenderer.jsx';

export default function InkLayer({ lines, settings, noiseSeed, leftPad, topPad, rightPad }) {
  const inkFilter = buildInkFilter(settings);
  const inkShadow = buildInkShadow(settings);

  const contentWidth = settings.pageWidth - leftPad - rightPad;

  return (
    <div
      className="ink-layer absolute inset-0"
      style={{
        '--ink-filter':  inkFilter,
        '--ink-shadow':  inkShadow,
        paddingLeft:     `${leftPad}px`,
        paddingTop:      `${topPad}px`,
        paddingRight:    `${rightPad}px`,
        paddingBottom:   '20px',
        fontFamily:      `'${settings.fontFamily}', cursive`,
        fontSize:        `${settings.fontSize}px`,
        color:           settings.fontColor,
        letterSpacing:   `${settings.letterSpacing}px`,
        lineHeight:      `${settings.lineSpacing}px`,
        zIndex:          1,
        overflow:        'visible',
        boxSizing:       'border-box',
      }}
    >
      {lines.length === 0 ? (
        <p
          data-export-placeholder="true"
          className="select-none pointer-events-none italic"
          style={{ fontFamily: `'${settings.fontFamily}', cursive`, color: 'black', opacity: 1 }}
        >
          Start typing in the editor →
        </p>
      ) : (
        lines.map((line, lineIdx) => {
          const lineNoise = computeLineNoise(lineIdx, noiseSeed, settings);
          return (
            <LineRenderer
              key={lineIdx}
              line={line}
              lineIdx={lineIdx}
              lineNoise={lineNoise}
              noiseSeed={noiseSeed}
              settings={settings}
              maxWidth={contentWidth}
            />
          );
        })
      )}
    </div>
  );
}
