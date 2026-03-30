// Help modal: usage guide, privacy info, and tech stack

import { useStore } from '../../store.js';

const STEPS = [
  ['Type your text',   'Enter content in the right panel. Each line becomes a new line on the page.'],
  ['Customise style',  'Use the left sidebar → font, spacing, noise, ink effects, paper type.'],
  ['Choose a font',    'Browse 10+ built-in fonts or upload your own via the font picker.'],
  ['Add pages',        'Use the page bar below the canvas to add, switch, or delete pages.'],
  ['Download',         'Click Download to export as PNG or PDF → single page or all pages.'],
];

const TECH = ['Blood, Sweat, Tear and assignment deadlines','My bad handwriting AI cannot ever replicate', 'Also', 'React 19', 'Vite 7', 'Tailwind CSS 4', 'Zustand 5', 'html2canvas', 'jsPDF'];

export default function HelpModal() {
  const helpOpen    = useStore((s) => s.helpOpen);
  const setHelpOpen = useStore((s) => s.setHelpOpen);
  if (!helpOpen) return null;

  return (
    <div className="fade-in" style={{
      position: 'fixed', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: 'var(--bg-panel)', border: '1px solid var(--border)',
        borderRadius: '16px', boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        width: '100%', maxWidth: '480px', maxHeight: '80vh',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Help & About</h2>
          <button onClick={() => setHelpOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }} className="custom-scrollbar">
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '4px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>Text to Handwriting</strong> → free, client-side. No server, no login.
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '20px' }}>
            by <span style={{ color: 'var(--text-secondary)' }}>Satvik Hemant Gupta</span>
          </p>

          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>How to use</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {STEPS.map(([title, desc], i) => (
              <div key={i} style={{ display: 'flex', gap: '10px' }}>
                <span style={{
                  flexShrink: 0, width: '20px', height: '20px', borderRadius: '50%',
                  background: 'var(--accent-subtle)', color: 'var(--accent-light)',
                  fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px',
                }}>{i + 1}</span>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)' }}>{title} → </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{desc}</span>
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Privacy</p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            All data stays in your browser via IndexedDB. Nothing is sent to any server as there is none.
          </p>

          <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Built with</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {TECH.map((t) => (
              <span key={t} style={{
                fontSize: '10px', padding: '3px 8px', borderRadius: '4px',
                background: 'var(--bg-raised)', color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setHelpOpen(false)} className="btn-accent"
            style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
