// Hook: manages undo/redo stack, mouse/touch events, and canvas persistence

import { useRef, useState, useEffect, useCallback } from 'react';
import { useStore } from '../store.js';
import {
  configureContext, getEventPos, getEndEventPos,
  drawLine, drawRect, drawCircle, isCanvasEmpty, restoreSnapshot
} from '../utils/canvasOps.js';

const MAX_UNDO = 30;

export function useDrawingCanvas(pageWidth, pageHeight) {
  const canvasRef  = useRef(null);
  const startPos   = useRef(null);
  const isDrawing  = useRef(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const drawingTool       = useStore((s) => s.drawingTool);
  const drawingColor      = useStore((s) => s.drawingColor);
  const drawingLineWidth  = useStore((s) => s.drawingLineWidth);
  const updatePageDrawing = useStore((s) => s.updatePageDrawing);
  const currentPage       = useStore((s) => s.pages[s.currentPageIndex]);

  // reset canvas size and restore drawing on page switch or resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = pageWidth;
    canvas.height = pageHeight;
    if (currentPage?.drawingDataUrl) restoreSnapshot(canvas, currentPage.drawingDataUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageWidth, pageHeight, currentPage?.id]);

  // save to IDB , store null when empty to avoid persisting blank canvases
  const persist = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    updatePageDrawing(isCanvasEmpty(canvas) ? null : canvas.toDataURL('image/png'));
  }, [updatePageDrawing]);

  const saveSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setUndoStack((prev) => [...prev.slice(-MAX_UNDO), canvas.toDataURL('image/png')]);
    setRedoStack([]);
  }, []);

  const undo = useCallback(() => {
    if (!undoStack.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setRedoStack((prev) => [...prev, canvas.toDataURL('image/png')]);
    const snap = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1));
    restoreSnapshot(canvas, snap).then(persist);
  }, [undoStack, persist]);

  const redo = useCallback(() => {
    if (!redoStack.length) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setUndoStack((prev) => [...prev, canvas.toDataURL('image/png')]);
    const snap = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    restoreSnapshot(canvas, snap).then(persist);
  }, [redoStack, persist]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveSnapshot();
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    persist();
  }, [saveSnapshot, persist]);

  const handleStart = useCallback((e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    saveSnapshot();
    const pos = getEventPos(e, canvas);
    startPos.current  = pos;
    isDrawing.current = true;
    if (drawingTool === 'pen' || drawingTool === 'eraser') {
      const ctx = canvas.getContext('2d');
      configureContext(ctx, { tool: drawingTool, color: drawingColor, lineWidth: drawingLineWidth });
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  }, [saveSnapshot, drawingTool, drawingColor, drawingLineWidth]);

  const handleMove = useCallback((e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || !(drawingTool === 'pen' || drawingTool === 'eraser')) return;
    const ctx = canvas.getContext('2d');
    configureContext(ctx, { tool: drawingTool, color: drawingColor, lineWidth: drawingLineWidth });
    const pos = getEventPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [drawingTool, drawingColor, drawingLineWidth]);

  const handleEnd = useCallback((e) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getEndEventPos(e, canvas);
    const ctx = canvas.getContext('2d');
    configureContext(ctx, { tool: drawingTool, color: drawingColor, lineWidth: drawingLineWidth });
    if (drawingTool === 'line'   && startPos.current) drawLine(ctx,   startPos.current, pos);
    if (drawingTool === 'rect'   && startPos.current) drawRect(ctx,   startPos.current, pos);
    if (drawingTool === 'circle' && startPos.current) drawCircle(ctx, startPos.current, pos);
    isDrawing.current = false;
    startPos.current  = null;
    persist();
  }, [drawingTool, drawingColor, drawingLineWidth, persist]);

  // Ctrl+Z / Ctrl+Shift+Z , only active in drawing mode
  useEffect(() => {
    if (drawingTool === 'none') return;
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [drawingTool, undo, redo]);

  return { canvasRef, undoStack, redoStack, undo, redo, clearCanvas, handleStart, handleMove, handleEnd };
}
