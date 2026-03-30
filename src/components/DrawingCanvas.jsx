// Drawing canvas overlay: renders over the page when a drawing tool is active

import { useStore }         from '../store.js';
import { useDrawingCanvas } from '../hooks/useDrawingCanvas.js';

export default function DrawingCanvas({ pageWidth, pageHeight }) {
  const drawingTool = useStore((s) => s.drawingTool);
  const { canvasRef, undoStack, redoStack, undo, redo, clearCanvas, handleStart, handleMove, handleEnd } = useDrawingCanvas(pageWidth, pageHeight);

  if (drawingTool === 'none') return null;

  const btnStyle = (disabled) => ({
    padding:'6px', borderRadius:'6px', background:'none', border:'none', cursor: disabled ? 'not-allowed' : 'pointer',
    color:'var(--text-secondary)', opacity: disabled ? 0.3 : 1, display:'flex', alignItems:'center', justifyContent:'center',
    transition:'background 0.15s, color 0.15s',
  });

  return (
    <>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, zIndex:10, touchAction:'none', cursor: drawingTool === 'eraser' ? 'cell' : 'crosshair', width:'100%', height:'100%' }}
        onMouseDown={handleStart} onMouseMove={handleMove} onMouseUp={handleEnd} onMouseLeave={handleEnd}
        onTouchStart={handleStart} onTouchMove={handleMove} onTouchEnd={handleEnd} />

      <div style={{
        position:'absolute', bottom:'12px', left:'50%', transform:'translateX(-50%)',
        display:'flex', alignItems:'center', gap:'4px', zIndex:20,
        background:'var(--bg-panel)', border:'1px solid var(--border)',
        borderRadius:'10px', padding:'4px 8px',
        boxShadow:'0 4px 16px rgba(0,0,0,0.3)',
      }}>
        <button onClick={undo} disabled={!undoStack.length} title="Undo (Ctrl+Z)" style={btnStyle(!undoStack.length)}
          onMouseEnter={e => { if (undoStack.length) { e.currentTarget.style.background='var(--bg-hover)'; e.currentTarget.style.color='var(--text-primary)'; }}}
          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--text-secondary)'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
        </button>
        <button onClick={redo} disabled={!redoStack.length} title="Redo (Ctrl+Shift+Z)" style={btnStyle(!redoStack.length)}
          onMouseEnter={e => { if (redoStack.length) { e.currentTarget.style.background='var(--bg-hover)'; e.currentTarget.style.color='var(--text-primary)'; }}}
          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--text-secondary)'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
        <div style={{ width:'1px', height:'18px', background:'var(--border)', margin:'0 2px' }} />
        <button onClick={clearCanvas} title="Clear drawing" style={{ ...btnStyle(false) }}
          onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.1)'; e.currentTarget.style.color='#f87171'; }}
          onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='var(--text-secondary)'; }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </>
  );
}
