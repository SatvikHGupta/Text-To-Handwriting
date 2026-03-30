// Font picker modal: browse fonts, upload custom, and handwriting font guide

import { useState }       from 'react';
import { useStore }       from '../../store.js';
import { useFontUpload }  from '../../hooks/useFontUpload.js';
import { deleteCustomFont as idbDeleteFont } from '../../utils/idb.js';

const GUIDE_STEPS = [
  { step:1, emoji:'🌐', title:'Go to Calligraphr.com',   desc:'Visit calligraphr.com and create a free account. The free tier supports up to 75 characters, enough for English.' },
  { step:2, emoji:'📥', title:'Download the template',    desc:'Click Templates, Create Template, select Latin/English, then download the PDF.' },
  { step:3, emoji:'🖊️', title:'Print & write',            desc:'Print the PDF. Use a dark pen and write each character naturally in the boxes.' },
  { step:4, emoji:'📷', title:'Scan or photograph',       desc:'Scan at 300 DPI or photograph clearly. Flat paper, even lighting, sharp focus.' },
  { step:5, emoji:'⬆️', title:'Upload the scan',          desc:'Back on Calligraphr, go to My Fonts → upload your scan. Review auto-detected characters.' },
  { step:6, emoji:'⚙️', title:'Build your font',          desc:'Click Build Font → download the .ttf file to your computer.' },
  { step:7, emoji:'🎉', title:'Upload here!',             desc:'Go to the Upload Font tab, choose your .ttf → your handwriting is ready instantly.' },
];

const tabStyle = (active) => ({
  flex: 1, padding: '10px 14px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
  background: 'none', border: 'none', borderBottom: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
  color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
  transition: 'all 0.15s',
});

function FontBadge({ label, color, bg }) {
  return (
    <span style={{
      fontSize: '9px', padding: '1px 6px', borderRadius: '10px',
      background: bg, color, fontWeight: 600,
    }}>{label}</span>
  );
}

export default function FontPickerModal() {
  const fontPickerOpen    = useStore((s) => s.fontPickerOpen);
  const setFontPickerOpen = useStore((s) => s.setFontPickerOpen);
  const fonts             = useStore((s) => s.fonts);
  const settings          = useStore((s) => s.settings);
  const updateSetting     = useStore((s) => s.updateSetting);
  const removeCustomFont  = useStore((s) => s.removeCustomFont);
  const [tab, setTab]     = useState('browse');

  const { fileInputRef, uploading, error, handleFileChange, openFilePicker } =
    useFontUpload(() => setTab('browse'));

  if (!fontPickerOpen) return null;

  const handleDelete = async (name) => {
    if (!window.confirm(`Remove "${name}"? This cannot be undone.`)) return;
    try { await idbDeleteFont(name); removeCustomFont(name); } catch (e) { console.error(e); }
  };

  return (
    <div className="fade-in" style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.65)', backdropFilter:'blur(8px)' }}>
      <div style={{ background:'var(--bg-panel)', border:'1px solid var(--border)', borderRadius:'16px', boxShadow:'0 24px 80px rgba(0,0,0,0.5)', width:'100%', maxWidth:'600px', maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid var(--border)' }}>
          <h2 style={{ fontSize:'14px', fontWeight:600, color:'var(--text-primary)', margin:0 }}>✍️ Font Picker</h2>
          <button onClick={() => setFontPickerOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:'4px', borderRadius:'6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ display:'flex', borderBottom:'1px solid var(--border)' }}>
          {[['browse','📋 Browse'],['upload','⬆️ Upload'],['guide','📖 Make Your Font']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={tabStyle(tab === id)}>{label}</button>
          ))}
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'16px' }} className="custom-scrollbar">

          {tab === 'browse' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              {fonts.map((font) => {
                const active = settings.fontFamily === font.family;
                return (
                  <div key={font.name} onClick={() => updateSetting('fontFamily', font.family)} style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px',
                    borderRadius:'10px', cursor:'pointer',
                    background: active ? 'var(--accent-subtle)' : 'var(--bg-raised)',
                    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                    transition:'all 0.15s',
                  }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px', flexWrap:'wrap' }}>
                          <span style={{ fontSize:'12px', fontWeight:500, color:'var(--text-primary)' }}>{font.name}</span>

                        {font.category === 'builtin' && (
                          <FontBadge label="by Google" color="#4285f4" bg="rgba(66,133,244,0.12)" />
                        )}
                        {font.category === 'local' && (
                          <FontBadge label="Local" color="#a78bfa" bg="rgba(167,139,250,0.12)" />
                        )}
                        {font.category === 'custom' && (
                          <FontBadge label="Uploaded" color="#f59e0b" bg="rgba(245,158,11,0.15)" />
                        )}
                        {active && (
                          <FontBadge label="Active" color="var(--accent-light)" bg="var(--accent-subtle)" />
                        )}
                      </div>
                      <p style={{ fontSize:'17px', color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', margin:0, fontFamily:`'${font.family}', cursive` }}>
                        The quick brown fox jumps over the lazy dog
                      </p>
                    </div>

                    {font.category === 'custom' && (
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(font.name); }} style={{
                        marginLeft:'12px', padding:'6px', borderRadius:'6px', background:'none',
                        border:'none', cursor:'pointer', color:'var(--text-muted)', transition:'color 0.15s', flexShrink:0,
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'upload' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              <div style={{ textAlign:'center', padding:'32px 0' }}>
                <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:'var(--accent-subtle)', border:'2px dashed var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>
                <h3 style={{ fontSize:'14px', fontWeight:600, color:'var(--text-primary)', marginBottom:'6px' }}>Upload Your Handwriting Font</h3>
                <p style={{ fontSize:'12px', color:'var(--text-secondary)', marginBottom:'4px' }}>Supports .ttf, .otf, .woff, .woff2 files</p>
                <p style={{ fontSize:'11px', color:'var(--text-muted)', marginBottom:'16px' }}>Font will appear in the list using the filename as its name</p>
                <button onClick={openFilePicker} disabled={uploading} className="btn-accent" style={{
                  display:'inline-flex', alignItems:'center', gap:'8px',
                  padding:'8px 20px', borderRadius:'10px', fontSize:'13px', fontWeight:600, cursor:'pointer',
                  opacity: uploading ? 0.6 : 1,
                }}>
                  {uploading ? (
                    <><svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Uploading…</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>Choose Font File</>
                  )}
                </button>
                <input ref={fileInputRef} type="file" accept=".ttf,.otf,.woff,.woff2" onChange={handleFileChange} className="hidden" disabled={uploading} />
                {error && <p style={{ fontSize:'12px', color:'#f87171', marginTop:'10px' }}>{error}</p>}
              </div>
              <div style={{ background:'var(--bg-raised)', borderRadius:'10px', padding:'14px 16px', border:'1px solid var(--border)' }}>
                <h4 style={{ fontSize:'12px', fontWeight:600, color:'var(--text-primary)', marginBottom:'6px' }}>💡 Don't have a font file?</h4>
                <p style={{ fontSize:'12px', color:'var(--text-secondary)', lineHeight:1.6, margin:0 }}>
                  Create one from your handwriting at{' '}
                  <a href="https://www.calligraphr.com" target="_blank" rel="noopener noreferrer" style={{ color:'var(--accent-light)' }}>
                    calligraphr.com
                  </a>{' '}(free). See the "Make Your Font" tab for a step-by-step guide.
                </p>
              </div>
            </div>
          )}

          {tab === 'guide' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
              <div style={{ background:'var(--accent-subtle)', border:'1px solid var(--accent)', borderRadius:'12px', padding:'16px 18px' }}>
                <h3 style={{ fontSize:'14px', fontWeight:700, color:'var(--text-primary)', marginBottom:'4px' }}>✍️ Create Your Own Handwriting Font</h3>
                <p style={{ fontSize:'12px', color:'var(--text-secondary)', margin:0 }}>Turn your real handwriting into a font in ~15 minutes. Free!</p>
              </div>
              {GUIDE_STEPS.map(({ step, emoji, title, desc }) => (
                <div key={step} style={{ display:'flex', gap:'12px' }}>
                  <div style={{ flexShrink:0, width:'36px', height:'36px', borderRadius:'10px', background:'var(--accent-subtle)', border:'1px solid var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px' }}>
                    {emoji}
                  </div>
                  <div>
                    <h4 style={{ fontSize:'13px', fontWeight:600, color:'var(--text-primary)', marginBottom:'3px' }}>Step {step}: {title}</h4>
                    <p style={{ fontSize:'12px', color:'var(--text-secondary)', lineHeight:1.6, margin:0 }}>{desc}</p>
                  </div>
                </div>
              ))}
              <div style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.25)', borderRadius:'10px', padding:'14px 16px' }}>
                <h4 style={{ fontSize:'12px', fontWeight:600, color:'#f59e0b', marginBottom:'8px' }}>💡 Pro Tips</h4>
                <ul style={{ fontSize:'12px', color:'var(--text-secondary)', lineHeight:1.8, margin:0, paddingLeft:'16px' }}>
                  <li>Use a felt-tip pen for thicker, more visible strokes</li>
                  <li>Write at natural speed, imperfections look more real</li>
                  <li>Supported: .ttf, .otf, .woff, .woff2</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding:'12px 20px', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end' }}>
          <button onClick={() => setFontPickerOpen(false)} style={{
            padding:'6px 16px', borderRadius:'8px', fontSize:'12px', fontWeight:600, cursor:'pointer',
            background:'var(--bg-raised)', color:'var(--text-secondary)', border:'1px solid var(--border)',
          }}>Done</button>
        </div>
      </div>
    </div>
  );
}