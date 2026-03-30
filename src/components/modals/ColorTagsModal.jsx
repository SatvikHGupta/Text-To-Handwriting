// Color tags modal: reference for all color and font-size inline tags

import { useStore }      from '../../store.js';
import { COLOR_TAG_MAP } from '../../utils/paper.js';

const COLOR_LABELS = {
  b:  { name: 'Black',     usage: 'Question text' },
  db: { name: 'Dark Blue', usage: 'Headings ya important points' },
  bl: { name: 'Blue',      usage: 'Answer text' },
  r:  { name: 'Red',       usage: 'Corrections ya critical notes' },
  g:  { name: 'Green',     usage: 'Definitions ya key terms' },
  gr: { name: 'Gray',      usage: 'Side notes ya less important text' },
  p:  { name: 'Pink',      usage: 'Highlights ya special points' },
  o:  { name: 'Orange',    usage: 'Warnings ya caution points' },
  pu: { name: 'Purple',    usage: 'Formulas ya equations' },
  y:  { name: 'Yellow',    usage: 'Background highlights (goldenrod color)' },
  br: { name: 'Brown',     usage: 'Historical dates ya references' },
  tl: { name: 'Teal',      usage: 'Examples ya illustrations' },
};

const FONT_SIZE_EXAMPLES = [8, 10, 12, 14, 16, 20, 24, 28, 32];

export default function ColorTagsModal() {
  const colorTagsOpen    = useStore((s) => s.colorTagsOpen);
  const setColorTagsOpen = useStore((s) => s.setColorTagsOpen);

  if (!colorTagsOpen) return null;

  return (
    <div className="fade-in" style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: 'var(--bg-panel)', border: '1px solid var(--border)',
        borderRadius: '16px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        width: '100%', maxWidth: '540px', maxHeight: '88vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            🎨 Color & Font Tags
          </h2>
          <button onClick={() => setColorTagsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', background: 'var(--accent-subtle)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accent-light)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            How to use
          </p>
          <code style={{ fontSize: '12px', color: 'var(--text-primary)', background: 'var(--bg-raised)', padding: '5px 10px', borderRadius: '6px', display: 'block', lineHeight: 1.9 }}>
            {'<b>Black text</b>  <bl>Blue text</bl>  <r>Red text</r>'}<br/>
            {'<f10>Small text</f10>  <f24>Big text</f24>'}
          </code>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '6px 0 0' }}>
            Tags are stripped from the output, only the color or size changes.
          </p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }} className="custom-scrollbar">

          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Color Tags
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px' }}>
            {Object.entries(COLOR_LABELS).map(([tag, { name, usage }]) => {
              const hex = COLOR_TAG_MAP[tag];
              return (
                <div key={tag} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '8px 12px', borderRadius: '10px',
                  background: 'var(--bg-raised)', border: '1px solid var(--border)',
                }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '7px', background: hex, flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1px' }}>
                      <code style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-light)', background: 'var(--accent-subtle)', padding: '1px 6px', borderRadius: '4px' }}>
                        {`<${tag}>`}
                      </code>
                      <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>{name}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{usage}</p>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'monospace', flexShrink: 0 }}>{hex}</span>
                </div>
              );
            })}
          </div>

          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
            Font Size Tags
          </p>
          <div style={{ background: 'var(--bg-raised)', borderRadius: '10px', padding: '12px 14px', border: '1px solid var(--border)', marginBottom: '8px' }}>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 10px' }}>
              Any size works: <code style={{ color: 'var(--accent-light)' }}>&lt;f8&gt;</code> se <code style={{ color: 'var(--accent-light)' }}>&lt;f72&gt;</code>
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {FONT_SIZE_EXAMPLES.map((size) => (
                <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '6px', background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
                  <code style={{ fontSize: '11px', color: 'var(--accent-light)' }}>{`<f${size}>`}</code>
                  <span style={{ fontSize: `${Math.min(size, 18)}px`, color: 'var(--text-primary)', lineHeight: 1 }}>{size}px</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setColorTagsOpen(false)} className="btn-accent" style={{
            padding: '6px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
          }}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
