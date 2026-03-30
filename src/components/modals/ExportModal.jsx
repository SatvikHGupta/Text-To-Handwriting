// Export modal: format selection, page scope, and progress tracking

import { useStore }  from '../../store.js';
import { useExport } from '../../hooks/useExport.js';

const S = {
  overlay: { position:'fixed', inset:0, zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)' },
  modal:   { position:'relative', background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:'16px', boxShadow:'0 24px 80px rgba(0,0,0,0.5)', width:'100%', maxWidth:'480px', margin:'0 16px', overflow:'hidden', display:'flex', flexDirection:'column' },
  header:  { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid var(--border)' },
  body:    { padding:'20px', display:'flex', flexDirection:'column', gap:'18px' },
  footer:  { padding:'12px 20px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' },
  label:   { fontSize:'11px', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'8px', display:'block' },
  iconBox: { display:'flex', alignItems:'center', gap:'10px' },
};

function CloseBtn({ onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:'4px', borderRadius:'6px', opacity: disabled ? 0.3 : 1 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  );
}

export default function ExportModal() {
  const open = useStore((s) => s.exportModalOpen);
  const { pages, currentPageIndex, format, setFormat, scope, setScope, selectedPages, exporting, progress, progressPercent, togglePage, toggleAllPages, getPageIndices, handleClose, handleExport } = useExport();

  if (!open) return null;
  const indices   = getPageIndices();
  const canExport = indices.length > 0 && !exporting;

  const fmtBtn = (id, emoji, label, sub) => {
    const active = format === id;
    return (
      <button key={id} onClick={() => setFormat(id)} disabled={exporting} style={{
        display:'flex', alignItems:'center', gap:'10px', padding:'12px 14px', borderRadius:'10px', cursor:'pointer',
        background: active ? 'var(--accent-subtle)' : 'var(--bg-raised)',
        border: `2px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
        transition:'all 0.15s', flex:1,
      }}>
        <span style={{ fontSize:'20px' }}>{emoji}</span>
        <div style={{ textAlign:'left' }}>
          <div style={{ fontSize:'13px', fontWeight:600, color:'var(--text-primary)' }}>{label}</div>
          <div style={{ fontSize:'10px', color:'var(--text-secondary)' }}>{sub}</div>
        </div>
      </button>
    );
  };

  const scopeOpts = [
    { id:'current', label:`Current page (Page ${currentPageIndex + 1})`, show:true },
    { id:'all',     label:`All pages (${pages.length})${format==='pdf' ? ' (merged PDF)' : ''}`, show:pages.length > 1 },
    { id:'select',  label:'Select specific pages', show:pages.length > 1 },
  ];

  return (
    <div className="fade-in" style={S.overlay}>
      <div style={S.modal}>
        <div style={S.header}>
          <div style={S.iconBox}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg,#10b981,#0d9488)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize:'14px', fontWeight:600, color:'var(--text-primary)' }}>Export Pages</div>
              <div style={{ fontSize:'11px', color:'var(--text-secondary)' }}>{pages.length} page{pages.length > 1 ? 's' : ''} in notebook</div>
            </div>
          </div>
          <CloseBtn onClick={handleClose} disabled={exporting} />
        </div>

        <div style={S.body}>
          <div>
            <span style={S.label}>Format</span>
            <div style={{ display:'flex', gap:'8px' }}>
              {fmtBtn('png','📷','PNG','High quality image')}
              {fmtBtn('pdf','📄','PDF', pages.length > 1 ? 'All pages in 1 file' : 'Document format')}
            </div>
          </div>

          <div>
            <span style={S.label}>Pages to export</span>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              {scopeOpts.filter(o => o.show).map(({ id, label }) => {
                const active = scope === id;
                return (
                  <label key={id} style={{
                    display:'flex', alignItems:'center', gap:'10px', padding:'8px 12px', borderRadius:'8px', cursor:'pointer',
                    background: active ? 'var(--bg-active)' : 'var(--bg-raised)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    transition:'all 0.15s',
                  }}>
                    <input type="radio" name="scope" value={id} checked={active} onChange={() => setScope(id)} disabled={exporting}
                      style={{ accentColor:'var(--accent)' }} />
                    <span style={{ fontSize:'13px', color:'var(--text-primary)' }}>{label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {scope === 'select' && pages.length > 1 && (
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px' }}>
                <span style={{ fontSize:'11px', color:'var(--text-secondary)' }}>{selectedPages.length} of {pages.length} selected</span>
                <button onClick={toggleAllPages} style={{ fontSize:'11px', color:'var(--accent-light)', background:'none', border:'none', cursor:'pointer' }}>
                  {selectedPages.length === pages.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(10,1fr)', gap:'4px', maxHeight:'120px', overflowY:'auto' }} className="custom-scrollbar">
                {pages.map((_, idx) => {
                  const sel = selectedPages.includes(idx);
                  return (
                    <button key={idx} onClick={() => togglePage(idx)} style={{
                      aspectRatio:'1', borderRadius:'6px', fontSize:'11px', fontWeight:500, cursor:'pointer',
                      background: sel ? 'var(--accent)' : 'var(--bg-raised)',
                      color: sel ? 'white' : 'var(--text-secondary)',
                      border: `1px solid ${sel ? 'var(--accent)' : 'var(--border)'}`,
                      boxShadow: sel ? '0 0 6px var(--accent-glow)' : 'none',
                    }}>{idx + 1}</button>
                  );
                })}
              </div>
            </div>
          )}

          {exporting && (
            <div className="animate-pulse-subtle" style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'12px' }}>
                <span style={{ color:'var(--text-primary)', fontWeight:500 }}>{progress.message}</span>
                <span style={{ color:'var(--accent-light)', fontVariantNumeric:'tabular-nums' }}>{progressPercent}%</span>
              </div>
              <div style={{ height:'6px', borderRadius:'3px', background:'var(--bg-raised)', overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:'3px', background:'linear-gradient(90deg,var(--accent),#10b981)', width:`${progressPercent}%`, transition:'width 0.3s ease-out' }} />
              </div>
              <span style={{ fontSize:'10px', color:'var(--text-muted)' }}>Page {progress.current} of {progress.total}</span>
            </div>
          )}
        </div>

        <div style={S.footer}>
          <span style={{ fontSize:'10px', color:'var(--text-muted)' }}>
            {format==='pdf' && indices.length > 1 ? 'Pages combined into one PDF'
              : format==='png' && indices.length > 1 ? `${indices.length} PNGs downloaded sequentially`
              : `1 ${format.toUpperCase()} file`}
          </span>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={handleClose} disabled={exporting} style={{
              padding:'6px 14px', borderRadius:'8px', fontSize:'12px', fontWeight:500, cursor:'pointer',
              background:'var(--bg-raised)', color:'var(--text-secondary)', border:'1px solid var(--border)',
              opacity: exporting ? 0.3 : 1,
            }}>Cancel</button>
            <button onClick={handleExport} disabled={!canExport} className="btn-accent" style={{
              display:'flex', alignItems:'center', gap:'6px',
              padding:'6px 16px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer',
              opacity: !canExport ? 0.4 : 1,
            }}>
              {exporting ? (
                <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Exporting…</>
              ) : (
                <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>Export {indices.length > 1 ? `${indices.length} pages` : 'page'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
