// Root page component: assembles paper background, margins, ink layer, and drawing overlay

import { useMemo }     from 'react';
import { useStore }    from '../../store.js';
import { buildPaperBackground, buildPaperLinesStyle, parseText, getContentPadding } from '../../utils/paper.js';
import { buildInkFilter, buildInkShadow } from '../../utils/noise.js';
import MarginOverlays from './MarginOverlays.jsx';
import InkLayer       from './InkLayer.jsx';

export default function HandwritingPage() {
  const settings    = useStore((s) => s.settings);
  const noiseSeed   = useStore((s) => s.noiseSeed);
  const currentPage = useStore((s) => s.pages[s.currentPageIndex]);

  const text  = currentPage?.text ?? '';
  const lines = useMemo(() => parseText(text), [text]);

  const inkFilter = useMemo(() => buildInkFilter(settings), [settings.inkBlurEnabled, settings.inkBlurAmount]);
  const inkShadow = useMemo(() => buildInkShadow(settings), [settings.inkShadowEnabled, settings.inkShadowAmount, settings.fontColor]);

  const paperBg = useMemo(() => buildPaperBackground(settings), [
    settings.paperColor,
    settings.paperMarginLeft, settings.paperMarginLeftEnabled,
    settings.paperMarginTop,  settings.paperMarginTopEnabled,
    settings.paperMarginRight, settings.paperMarginRightEnabled,
    settings.marginLineColor, settings.pageWidth,
  ]);

  const paperLinesStyle = useMemo(() => buildPaperLinesStyle(settings), [
    settings.paperType, settings.paperLineColor, settings.lineSpacing,
    settings.paperMarginTopEnabled, settings.paperMarginTop,
    settings.paperMarginLeftEnabled, settings.paperMarginLeft,
  ]);

  const { leftPad, topPad, rightPad } = useMemo(() => getContentPadding(settings), [
    settings.paperMarginLeftEnabled, settings.paperMarginLeft,
    settings.paperMarginTopEnabled,  settings.paperMarginTop,
    settings.paperMarginRightEnabled, settings.paperMarginRight,
  ]);

  const sharedTextStyle = {
    fontFamily: `'${settings.fontFamily}', cursive`,
    color:      settings.fontColor,
    filter:     inkFilter,
    textShadow: inkShadow,
  };

  const pageClasses = ['hw-page', settings.paperTextureEnabled && 'textured', settings.paperShadowEnabled && 'shadowed']
    .filter(Boolean).join(' ');

  return (
    <div
      id="hw-page-capture"
      className={pageClasses}
      style={{
        width:    settings.pageWidth,
        height:   settings.pageHeight,
        position: 'relative',
        overflow: 'hidden',
        ...paperBg,
      }}
    >
      {/* paper lines: absolutely positioned below everything else (zIndex 0) */}
      {paperLinesStyle && (
        <div
          data-paper-lines="true"
          style={{
            position:      'absolute',
            inset:         0,
            zIndex:        0,
            pointerEvents: 'none',
            ...paperLinesStyle,
          }}
        />
      )}

      {/* margin text overlays: zIndex 2 */}
      <MarginOverlays
        settings={settings}
        currentPage={currentPage}
        sharedTextStyle={sharedTextStyle}
      />

      {/* main ink layer: zIndex 1 */}
      <InkLayer
        lines={lines}
        settings={settings}
        noiseSeed={noiseSeed}
        leftPad={leftPad}
        topPad={topPad}
        rightPad={rightPad}
      />

      {/* drawing overlay: rendered from saved dataUrl */}
      {currentPage?.drawingDataUrl && (
        <img
          src={currentPage.drawingDataUrl}
          alt=""
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 5 }}
        />
      )}
    </div>
  );
}
