// Captures a DOM element to a high-resolution canvas for export

import html2canvas from 'html2canvas';

async function waitForFonts() {
  try { await document.fonts.ready; } catch (_) {}
  await delay(200);
}

export async function captureElement(element, scale = 3) {
  await waitForFonts();

  const placeholders = element.querySelectorAll('[data-export-placeholder]');
  placeholders.forEach((el) => { el.style.visibility = 'hidden'; });

  // force scale=1 so export is always full resolution regardless of zoom level
  const outer     = element.closest('.scaled-page-outer');
  const origScale = outer ? outer.style.getPropertyValue('--scale') : null;
  if (outer) outer.style.setProperty('--scale', '1');

  await delay(60);

  const w = element.offsetWidth;
  const h = element.offsetHeight;

  let canvas;
  try {
    canvas = await html2canvas(element, {
      scale,
      useCORS:         true,
      allowTaint:      true,
      backgroundColor: null,
      logging:         false,
      imageTimeout:    0,
      removeContainer: true,
      width:           w,
      height:          h,
      x:               0,
      y:               0,
      scrollX:         0,
      scrollY:         0,
      windowWidth:     w,
      windowHeight:    h,
    });
  } finally {
    if (outer && origScale !== null) {
      if (origScale === '') outer.style.removeProperty('--scale');
      else outer.style.setProperty('--scale', origScale);
    }
    placeholders.forEach((el) => { el.style.visibility = ''; });
  }

  return canvas;
}

export const delay = (ms) => new Promise((r) => setTimeout(r, ms));
