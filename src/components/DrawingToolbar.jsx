// Drawing toolbar: tool selector, color picker, line width , larger touch targets on mobile

import { useStore }      from '../store.js';
import { useBreakpoint } from '../hooks/useBreakpoint.js';

const TOOLS = [
  { id:'pen',    label:'Pen',       icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><circle cx="11" cy="11" r="2"/></svg> },
  { id:'eraser', label:'Eraser',    icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20H7L3 16l9-9 8 8-4 4"/><path d="M6.5 13.5l5-5"/></svg> },
  { id:'line',   label:'Line',      icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="19" x2="19" y2="5"/></svg> },
  { id:'rect',   label:'Rect',      icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> },
  { id:'circle', label:'Circle',    icon:<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg> },
];

export default function DrawingToolbar() {
  const drawingTool         = useStore((s) => s.drawingTool);
  const setDrawingTool      = useStore((s) => s.setDrawingTool);
  const drawingColor        = useStore((s) => s.drawingColor);
  const setDrawingColor     = useStore((s) => s.setDrawingColor);
  const drawingLineWidth    = useStore((s) => s.drawingLineWidth);
  const setDrawingLineWidth = useStore((s) => s.setDrawingLineWidth);
  const { isMobile }        = useBreakpoint();

  // larger padding on mobile for touch targets
  const btnPad = isMobile ? '9px' : '6px';

  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'2px',
      background:'var(--bg-panel)', border:'1px solid var(--border)',
      borderRadius:'10px', padding: isMobile ? '6px 10px' : '4px 8px',
      boxShadow:'0 4px 16px rgba(0,0,0,0.2)',
      flexWrap: isMobile ? 'wrap' : 'nowrap',
    }}>
      {TOOLS.map(({ id, label, icon }) => {
        const active = drawingTool === id;
        return (
          <button key={id} onClick={() => setDrawingTool(drawingTool === id ? 'none' : id)} title={label}
            style={{
              padding: btnPad, borderRadius:'6px', border:'none', cursor:'pointer',
              background: active ? 'var(--accent)' : 'transparent',
              color: active ? 'white' : 'var(--text-secondary)',
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.15s',
            }}>
            {icon}
          </button>
        );
      })}

      <div style={{ width:'1px', height:'20px', background:'var(--border)', margin:'0 4px' }} />

      <input type="color" value={drawingColor} onChange={(e) => setDrawingColor(e.target.value)} title="Drawing color"
        style={{ width: isMobile ? '32px' : '24px', height: isMobile ? '32px' : '24px', borderRadius:'6px', cursor:'pointer', border:'1px solid var(--border)', background:'transparent', padding:0 }} />

      <input type="range" min="1" max="10" value={drawingLineWidth} onChange={(e) => setDrawingLineWidth(Number(e.target.value))}
        title={`Line width: ${drawingLineWidth}px`} style={{ width: isMobile ? '80px' : '60px' }} />

      <span style={{ fontSize:'10px', color:'var(--text-muted)', width:'16px', textAlign:'right', fontVariantNumeric:'tabular-nums' }}>{drawingLineWidth}</span>

      <div style={{ width:'1px', height:'20px', background:'var(--border)', margin:'0 4px' }} />

      {drawingTool !== 'none' && (
        <button onClick={() => setDrawingTool('none')} title="Exit drawing mode"
          style={{ padding: btnPad, borderRadius:'6px', border:'none', cursor:'pointer', background:'transparent', color:'#f87171', display:'flex', transition:'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}
          onMouseLeave={e => e.currentTarget.style.background='transparent'}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  );
}
