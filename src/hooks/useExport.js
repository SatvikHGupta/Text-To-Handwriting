// Hook: manages export format, page scope, progress, and download
import { useState, useCallback } from 'react';
import { useStore }              from '../store.js';
import { exportPageAsPng, exportPageAsPdf, exportMultiPagePdf, exportMultiPagePng } from '../utils/export/download.js';

export function useExport() {
  const pages            = useStore((s) => s.pages);
  const currentPageIndex = useStore((s) => s.currentPageIndex);
  const setCurrentPage   = useStore((s) => s.setCurrentPage);
  const setOpen          = useStore((s) => s.setExportModalOpen);
  const fontFamily       = useStore((s) => s.settings.fontFamily);

  const [format,        setFormat]        = useState('png');
  const [scope,         setScope]         = useState('current');
  const [selectedPages, setSelectedPages] = useState([]);
  const [exporting,     setExporting]     = useState(false);
  const [progress,      setProgress]      = useState({ current: 0, total: 0, message: '' });

  const handleClose = useCallback(() => {
    if (exporting) return;
    setOpen(false);
    setProgress({ current: 0, total: 0, message: '' });
    setSelectedPages([]);
    setScope('current');
  }, [exporting, setOpen]);

  const togglePage = (idx) =>
    setSelectedPages((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx].sort((a, b) => a - b)
    );

  const toggleAllPages = () =>
    setSelectedPages(selectedPages.length === pages.length ? [] : pages.map((_, i) => i));

  const getPageIndices = useCallback(() => {
    if (scope === 'current') return [currentPageIndex];
    if (scope === 'all')     return pages.map((_, i) => i);
    if (scope === 'select')  return selectedPages;
    return [currentPageIndex];
  }, [scope, currentPageIndex, pages, selectedPages]);

  // switch to page, wait for DOM to settle, then return element
  const getPageElement = useCallback(async (pageIndex) => {
    setCurrentPage(pageIndex);
    await new Promise((r) => setTimeout(r, 400));
    return document.getElementById('hw-page-capture');
  }, [setCurrentPage]);

  const handleExport = useCallback(async () => {
    const indices = getPageIndices();
    if (!indices.length) return;
    setExporting(true);
    setProgress({ current: 0, total: indices.length, message: 'Starting...' });
    const orig = currentPageIndex;
    try {
      const onProgress = (current, total, message) => setProgress({ current, total, message });
      if (indices.length === 1) {
        setProgress({ current: 1, total: 1, message: 'Rendering...' });
        if (indices[0] !== currentPageIndex) {
          setCurrentPage(indices[0]);
          await new Promise((r) => setTimeout(r, 500));
        }
        const el = document.getElementById('hw-page-capture');
        if (!el) throw new Error('Page element not found');
        const pageNum = indices[0] + 1;
        if (format === 'png') await exportPageAsPng(el, fontFamily, pageNum);
        else                  await exportPageAsPdf(el, fontFamily, pageNum);
        setProgress({ current: 1, total: 1, message: 'Done!' });
      } else {
        if (format === 'pdf') await exportMultiPagePdf(getPageElement, indices, onProgress, fontFamily);
        else                  await exportMultiPagePng(getPageElement, indices, onProgress, fontFamily);
        setProgress((p) => ({ ...p, message: 'Done!' }));
      }
      setCurrentPage(orig);
      setTimeout(() => { setExporting(false); handleClose(); }, 1200);
    } catch (err) {
      console.error('Export failed:', err);
      setProgress({ current: 0, total: 0, message: `Error: ${err.message}` });
      setCurrentPage(orig);
      setExporting(false);
    }
  }, [format, fontFamily, getPageIndices, getPageElement, currentPageIndex, setCurrentPage, handleClose]);

  const progressPercent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return {
    pages, currentPageIndex,
    format, setFormat,
    scope, setScope,
    selectedPages,
    exporting, progress, progressPercent,
    togglePage, toggleAllPages,
    getPageIndices,
    handleClose, handleExport,
  };
}
