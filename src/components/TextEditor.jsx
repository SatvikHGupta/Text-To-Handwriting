// Right panel: text input and margin fields , fullscreen on mobile, compact on tablet

import { useCallback }   from 'react';
import { useStore }      from '../store.js';
import { useBreakpoint } from '../hooks/useBreakpoint.js';

export default function TextEditor({ fullscreen, compact }) {
  const updatePageText   = useStore((s) => s.updatePageText);
  const updateMarginText = useStore((s) => s.updateMarginText);
  const currentPage      = useStore((s) => s.pages[s.currentPageIndex]);
  const settings         = useStore((s) => s.settings);
  const { isMobile }     = useBreakpoint();

  const text      = currentPage?.text ?? '';
  const showTop   = settings.paperMarginTopEnabled;
  const showLeft  = settings.paperMarginLeftEnabled;
  const showRight = settings.paperMarginRightEnabled;

  const handleChange = useCallback((e) => updatePageText(e.target.value), [updatePageText]);

  // compact mode for tablet: narrower
  const width = fullscreen ? '100%' : compact ? '280px' : '360px';

  return (
    <aside style={{
      width:      width,
      flexShrink: 0,
      display:    'flex',
      flexDirection: 'column',
      overflow:   'hidden',
      background: 'var(--bg-panel)',
      borderLeft: fullscreen ? 'none' : '1px solid var(--border)',
      height:     fullscreen ? '100%' : undefined,
    }}>
      <div style={{
        padding: '10px 16px', flexShrink: 0,
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Text Input
        </span>
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
          {text.length} ch · {text.split('\n').length} ln
        </span>
      </div>

      {(showTop || showLeft || showRight) && (
        <div style={{ flexShrink: 0, borderBottom: '1px solid var(--border)' }}>
          {showTop   && <MarginField label="Top Margin Text"   color="#818cf8" value={currentPage?.topMarginText   ?? ''} onChange={(v) => updateMarginText('top',   v)} placeholder="Page title, date, subject..." multiline />}
          {showLeft  && <MarginField label="Left Margin Notes"  color="#34d399" value={currentPage?.leftMarginText  ?? ''} onChange={(v) => updateMarginText('left',  v)} placeholder="Line numbers, annotations..." multiline />}
          {showRight && <MarginField label="Right Margin Notes" color="#a78bfa" value={currentPage?.rightMarginText ?? ''} onChange={(v) => updateMarginText('right', v)} placeholder="Comments, references..."      multiline />}
        </div>
      )}

      <textarea
        value={text}
        onChange={handleChange}
        placeholder={"Start typing here...\n\nEach line -> new line on the page.\nPreview updates in real time."}
        className="custom-scrollbar"
        style={{
          flex: 1, minHeight: 0, width: '100%',
          background: 'transparent', resize: 'none', outline: 'none',
          fontSize: '13px', lineHeight: 1.7,
          padding: showTop ? '10px 16px 14px' : '14px 16px',
          borderTop: showTop ? '3px solid #818cf844' : 'none',
          borderRight: showRight ? '3px solid #a78bfa44' : 'none',
          fontFamily: `'${settings.fontFamily}', cursive`,
          color: 'var(--text-primary)',
          caretColor: 'var(--accent)',
        }}
        spellCheck={false}
        autoFocus={!isMobile}
      />
    </aside>
  );
}

function MarginField({ label, color, value, onChange, placeholder, multiline = false }) {
  const inputStyle = {
    width: '100%', padding: '6px 10px', fontSize: '12px', borderRadius: '6px',
    border: `1px solid ${color}33`, background: 'var(--bg-raised)',
    color: 'var(--text-primary)', outline: 'none', resize: 'none',
    boxSizing: 'border-box',
  };
  return (
    <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
      <label style={{ display: 'block', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color, marginBottom: '6px' }}>
        {label}
      </label>
      <textarea
        rows={multiline ? 2 : 1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="margin-field-scroll"
        style={{ ...inputStyle, lineHeight: 1.5 }}
      />
    </div>
  );
}
