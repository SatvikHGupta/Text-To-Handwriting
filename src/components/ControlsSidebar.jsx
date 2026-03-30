// Left sidebar: settings sections , fullscreen on mobile, fixed-width on desktop

import { useStore }      from '../store.js';
import { useBreakpoint } from '../hooks/useBreakpoint.js';
import FontSection       from './sidebar/FontSection.jsx';
import LineSection       from './sidebar/LineSection.jsx';
import WordSection       from './sidebar/WordSection.jsx';
import LetterSection     from './sidebar/LetterSection.jsx';
import InkSection        from './sidebar/InkSection.jsx';
import PaperSection      from './sidebar/PaperSection.jsx';
import MarginsSection    from './sidebar/MarginsSection.jsx';

export default function ControlsSidebar({ fullscreen }) {
  const sidebarOpen   = useStore((s) => s.sidebarOpen);
  const resetSettings = useStore((s) => s.resetSettings);
  const { isMobile }  = useBreakpoint();

  // on desktop, respect sidebarOpen toggle; on mobile fullscreen always show
  if (!fullscreen && !sidebarOpen) return null;

  return (
    <aside style={{
      width:      fullscreen ? '100%' : '240px',
      flexShrink: 0,
      display:    'flex',
      flexDirection: 'column',
      overflow:   'hidden',
      background: 'var(--bg-panel)',
      borderRight: fullscreen ? 'none' : '1px solid var(--border)',
      height:     fullscreen ? '100%' : undefined,
    }}>
      <div style={{
        padding: '10px 16px', flexShrink: 0,
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Settings
        </span>
        <button onClick={resetSettings} style={{
          fontSize: '10px', color: 'var(--text-muted)', background: 'none',
          border: 'none', cursor: 'pointer', transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-light)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
          Reset
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="custom-scrollbar">
        <FontSection />
        <LineSection />
        <WordSection />
        <LetterSection />
        <InkSection />
        <PaperSection />
        <MarginsSection />
      </div>
    </aside>
  );
}
