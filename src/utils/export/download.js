// PNG and PDF download functions for single and multi-page export

import jsPDF                        from 'jspdf';
import { captureElement, delay }    from './capture.js';
import { buildFileName }            from './filename.js';

// Converts a canvas to a jsPDF object, preserving aspect ratio at A4 width
function canvasToPdf(canvas) {
  const pdfWidth  = 210;
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  const pdf = new jsPDF({
    orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
    unit:        'mm',
    format:      [pdfWidth, pdfHeight],
  });
  pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, pdfWidth, pdfHeight);
  return pdf;
}

function triggerDownload(dataUrl, filename) {
  const a    = document.createElement('a');
  a.download = filename;
  a.href     = dataUrl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function exportPageAsPng(element, fontFamily, pageNumber) {
  const canvas = await captureElement(element);
  triggerDownload(canvas.toDataURL('image/png', 1.0), buildFileName(fontFamily, pageNumber, 'png'));
}

export async function exportPageAsPdf(element, fontFamily, pageNumber) {
  const canvas = await captureElement(element);
  canvasToPdf(canvas).save(buildFileName(fontFamily, pageNumber, 'pdf'));
}

// Sequential loop - only one page is visible in the DOM at a time
export async function exportMultiPagePdf(getPageElement, pageIndices, onProgress, fontFamily) {
  const total = pageIndices.length;
  let pdf     = null;

  for (let i = 0; i < total; i++) {
    const el = await getPageElement(pageIndices[i]);
    onProgress(i + 1, total, `Rendering page ${pageIndices[i] + 1}...`);
    if (!el) continue;
    await delay(150);
    const canvas = await captureElement(el);
    if (i === 0) {
      pdf = canvasToPdf(canvas);
    } else {
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, 0, w, h);
    }
  }

  if (pdf) {
    onProgress(total, total, 'Saving PDF...');
    await delay(200);
    pdf.save(buildFileName(fontFamily, null, 'pdf'));
  }
}

// Gap between PNG downloads prevents the browser from silently dropping them
export async function exportMultiPagePng(getPageElement, pageIndices, onProgress, fontFamily) {
  const total = pageIndices.length;
  for (let i = 0; i < total; i++) {
    const el = await getPageElement(pageIndices[i]);
    onProgress(i + 1, total, `Exporting page ${pageIndices[i] + 1}...`);
    if (!el) continue;
    await delay(150);
    const canvas = await captureElement(el);
    triggerDownload(
      canvas.toDataURL('image/png', 1.0),
      buildFileName(fontFamily, pageIndices[i] + 1, 'png')
    );
    await delay(400);
  }
}
