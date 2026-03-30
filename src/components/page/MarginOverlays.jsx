// Renders text in the top, left, and right margin areas and Supports color and font size tags, same as the main ink layer

import { COLOR_TAG_MAP } from '../../utils/paper.js';

function parseMarginSegments(text) {
  if (!text) return [{ text: '', color: null, fontSize: null }];
  const segments = [];
  const tagRegex = /<([a-z0-9]+)>(.*?)<\/\1>/g;
  let lastIndex  = 0;
  let match;
  while ((match = tagRegex.exec(text)) !== null) {
    const [fullMatch, tag, content] = match;
    const color    = COLOR_TAG_MAP[tag] ?? null;
    const fontSize = color === null ? (tag.match(/^f(\d+)$/) ? parseInt(tag.slice(1), 10) : null) : null;
    if (match.index > lastIndex) segments.push({ text: text.slice(lastIndex, match.index), color: null, fontSize: null });
    if (color !== null || fontSize !== null) segments.push({ text: content, color, fontSize });
    else segments.push({ text: content, color: null, fontSize: null });
    lastIndex = match.index + fullMatch.length;
  }
  if (lastIndex < text.length) segments.push({ text: text.slice(lastIndex), color: null, fontSize: null });
  return segments.length > 0 ? segments : [{ text, color: null, fontSize: null }];
}

function TaggedText({ text, defaultColor, baseSize }) {
  if (!text) return null;
  const segments = parseMarginSegments(text);
  return (
    <>
      {segments.map((seg, i) => (
        <span key={i} style={{
          color:      seg.color    ?? defaultColor,
          fontSize:   seg.fontSize ?? baseSize,
          whiteSpace: 'pre-wrap',
        }}>
          {seg.text}
        </span>
      ))}
    </>
  );
}

export default function MarginOverlays({ settings, currentPage, sharedTextStyle }) {
  const {
    paperMarginLeftEnabled,  paperMarginLeft,
    paperMarginRightEnabled, paperMarginRight,
    paperMarginTopEnabled,   paperMarginTop,
    pageWidth, fontSize,
  } = settings;

  const leftWidth  = Math.max(paperMarginLeft  - 8, 8);
  const rightWidth = Math.max(paperMarginRight - 8, 8);

  return (
    <>
      {paperMarginTopEnabled && (
        <div style={{
          position:   'absolute',
          top:        0,
          left:       paperMarginLeftEnabled  ? paperMarginLeft  + 4 : 12,
          right:      paperMarginRightEnabled ? paperMarginRight + 4 : 12,
          height:     Math.max(paperMarginTop - 2, 16),
          display:    'flex',
          alignItems: 'flex-start',
          paddingTop: 4,
          fontSize:   fontSize * 0.8,
          zIndex:     2,
          overflow:   'hidden',
          wordBreak:  'break-word',
          ...sharedTextStyle,
          color: undefined,
        }}>
          <TaggedText
            text={currentPage?.topMarginText || ''}
            defaultColor={sharedTextStyle.color}
            baseSize={fontSize * 0.8}
          />
        </div>
      )}

      {paperMarginLeftEnabled && (
        <div style={{
          position:   'absolute',
          top:        paperMarginTopEnabled ? paperMarginTop + 4 : 12,
          left:       4,
          width:      leftWidth,
          bottom:     12,
          fontSize:   fontSize * 0.6,
          lineHeight: 1.5,
          overflow:   'hidden',
          wordBreak:  'break-word',
          opacity:    0.9,
          zIndex:     2,
          ...sharedTextStyle,
          color: undefined,
        }}>
          <TaggedText
            text={currentPage?.leftMarginText || ''}
            defaultColor={sharedTextStyle.color}
            baseSize={fontSize * 0.6}
          />
        </div>
      )}

      {paperMarginRightEnabled && (
        <div style={{
          position:   'absolute',
          top:        paperMarginTopEnabled ? paperMarginTop + 4 : 12,
          left:       pageWidth - paperMarginRight + 4,
          width:      rightWidth,
          bottom:     12,
          fontSize:   fontSize * 0.6,
          lineHeight: 1.5,
          overflow:   'hidden',
          wordBreak:  'break-word',
          opacity:    0.9,
          zIndex:     2,
          ...sharedTextStyle,
          color: undefined,
        }}>
          <TaggedText
            text={currentPage?.rightMarginText || ''}
            defaultColor={sharedTextStyle.color}
            baseSize={fontSize * 0.6}
          />
        </div>
      )}
    </>
  );
}
