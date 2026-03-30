// Builds paper background CSS and parses text into color/font-tagged tokens

export const COLOR_TAG_MAP = {
  b:   '#000000', db:  '#00008B', bl:  '#4169E1',
  r:   '#DC143C', g:   '#2E8B57', gr:  '#696969',
  p:   '#FF69B4', o:   '#FF8C00', pu:  '#6A0DAD',
  y:   '#DAA520', br:  '#8B4513', tl:  '#008080',
};

function parseFontSizeTag(tag) {
  const m = tag.match(/^f(\d+)$/);
  return m ? parseInt(m[1], 10) : null;
}

function parseSegments(lineText) {
  const segments = [];
  const re = /<([a-z0-9]+)>(.*?)<\/\1>/g;
  let last = 0, m;
  while ((m = re.exec(lineText)) !== null) {
    const [full, tag, content] = m;
    const color    = COLOR_TAG_MAP[tag] ?? null;
    const fontSize = color === null ? parseFontSizeTag(tag) : null;
    if (m.index > last) segments.push({ text: lineText.slice(last, m.index), color: null, fontSize: null });
    if (color !== null || fontSize !== null) segments.push({ text: content, color, fontSize });
    else segments.push({ text: content, color: null, fontSize: null });
    last = m.index + full.length;
  }
  if (last < lineText.length) segments.push({ text: lineText.slice(last), color: null, fontSize: null });
  return segments.length > 0 ? segments : [{ text: lineText, color: null, fontSize: null }];
}

export function parseText(text) {
  if (!text || !text.trim()) return [];
  return text.split('\n').map((lineText) => {
    const segs = parseSegments(lineText);
    return {
      lineText,
      segments: segs.map((s) => ({
        ...s,
        words: s.text.split(/(\s+)/).filter((w) => w.length > 0),
      })),
    };
  });
}

// Builds the paper base background: solid color + margin lines as CSS gradients.
// backgroundSize and backgroundRepeat are set explicitly to prevent tiling artifacts.
export function buildPaperBackground(settings) {
  const {
    paperColor,
    paperMarginLeft, paperMarginLeftEnabled,
    paperMarginTop,  paperMarginTopEnabled,
    paperMarginRight, paperMarginRightEnabled,
    pageWidth, marginLineColor,
  } = settings;

  const bg = [];
  if (paperMarginLeftEnabled) {
    const x = paperMarginLeft;
    bg.push(`linear-gradient(to right, transparent ${x}px, ${marginLineColor} ${x}px, ${marginLineColor} ${x + 1}px, transparent ${x + 1}px)`);
  }
  if (paperMarginRightEnabled) {
    const x = pageWidth - paperMarginRight;
    bg.push(`linear-gradient(to right, transparent ${x}px, ${marginLineColor} ${x}px, ${marginLineColor} ${x + 1}px, transparent ${x + 1}px)`);
  }
  if (paperMarginTopEnabled) {
    const y = paperMarginTop;
    bg.push(`linear-gradient(to bottom, transparent ${y}px, ${marginLineColor} ${y}px, ${marginLineColor} ${y + 1}px, transparent ${y + 1}px)`);
  }
  const count = bg.length;
  return {
    backgroundColor:  paperColor,
    backgroundImage:  count > 0 ? bg.join(', ') : 'none',
    backgroundSize:   count > 0 ? Array(count).fill('100% 100%').join(', ') : 'auto',
    backgroundRepeat: count > 0 ? Array(count).fill('no-repeat').join(', ') : 'repeat',
  };
}

// Builds the paper lines layer style (lined or grid).
// This is rendered as a separate absolutely-positioned div, independent of margins.
//
// lined: horizontal lines at lineSpacing intervals, starting after topMargin
// grid:  fixed 18px cells, starting after top+left margin
// blank: returns null (caller skips rendering)
export function buildPaperLinesStyle(settings) {
  const {
    paperType, paperLineColor, lineSpacing,
    paperMarginTopEnabled,  paperMarginTop,
    paperMarginLeftEnabled, paperMarginLeft,
  } = settings;

  if (paperType === 'blank') return null;

  const topOffset  = paperMarginTopEnabled  ? paperMarginTop  : 0;
  const leftOffset = paperMarginLeftEnabled ? paperMarginLeft : 0;

  if (paperType === 'lined') {
    return {
      backgroundImage:    `linear-gradient(to bottom, transparent ${lineSpacing - 1}px, ${paperLineColor} ${lineSpacing - 1}px, ${paperLineColor} ${lineSpacing}px)`,
      backgroundSize:     `100% ${lineSpacing}px`,
      backgroundPosition: `0px ${topOffset}px`,
      backgroundRepeat:   'repeat',
    };
  }

  if (paperType === 'grid') {
    const cell = 102.5; //top to bottom fill
    const pos  = `${leftOffset}px ${topOffset}px`;
    return {
      backgroundImage: [
        `linear-gradient(to bottom, transparent ${cell - 1}px, ${paperLineColor} ${cell - 1}px, ${paperLineColor} ${cell}px)`,
        `linear-gradient(to right,  transparent ${cell - 1}px, ${paperLineColor} ${cell - 1}px, ${paperLineColor} ${cell}px)`,
      ].join(', '),
      backgroundSize:     `${cell}px ${cell}px, ${cell}px ${cell}px`,
      backgroundPosition: `${pos}, ${pos}`,
      backgroundRepeat:   'repeat, repeat',
    };
  }

  return null;
}

export function getContentPadding(settings) {
  return {
    leftPad:  settings.paperMarginLeftEnabled  ? settings.paperMarginLeft  + 8 : 20,
    topPad:   settings.paperMarginTopEnabled   ? settings.paperMarginTop       : 20,
    rightPad: settings.paperMarginRightEnabled ? settings.paperMarginRight + 8 : 20,
  };
}
