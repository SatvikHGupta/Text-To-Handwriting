// Paper section: type, color, line color, texture and shadow
import { useStore }  from '../../store.js';
import Section       from './Section.jsx';
import ToggleControl from '../ToggleControl.jsx';

const PAPER_TYPES = ['lined', 'grid', 'blank'];

const PAPER_COLORS = [
  { name: 'White',  value: 'white'       },
  { name: 'Cream',  value: 'cornsilk'    },
  { name: 'Yellow', value: 'lightyellow' },
  { name: 'Blue',   value: 'aliceblue'   },
  { name: 'Gray',   value: 'whitesmoke'  },
];

const LINE_COLORS = [
  { name: 'Blue',  value: 'lightsteelblue' },
  { name: 'Gray',  value: 'lightgray'      },
  { name: 'Black', value: 'black'          },
  { name: 'Red',   value: 'lightcoral'     },
  { name: 'Green', value: 'lightgreen'     },
];

// Color swatch grid with an optional custom hex picker in the last slot
function Swatches({ items, active, onSelect, showHexPicker = false }) {
  const isPreset = items.some((c) => c.value === active);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px' }}>
      {items.map(({ name, value }) => {
        const isActive = active === value;
        return (
          <button key={value} onClick={() => onSelect(value)} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 7px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
            background: isActive ? 'var(--accent-subtle)' : 'var(--bg-raised)',
            border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: value, border: '1px solid rgba(0,0,0,0.15)', flexShrink: 0 }} />
            {name}
          </button>
        );
      })}

      {showHexPicker && (
        <label style={{
          display: 'flex', alignItems: 'center', gap: '5px',
          padding: '5px 7px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
          background: !isPreset ? 'var(--accent-subtle)' : 'var(--bg-raised)',
          border: `1px solid ${!isPreset ? 'var(--accent)' : 'var(--border)'}`,
          color: !isPreset ? 'var(--text-primary)' : 'var(--text-secondary)',
          transition: 'all 0.15s',
        }}>
          <input
            type="color"
            value={isPreset ? '#ffffff' : active}
            onChange={(e) => onSelect(e.target.value)}
            style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer', background: 'transparent', flexShrink: 0 }}
          />
          Custom
        </label>
      )}
    </div>
  );
}

export default function PaperSection() {
  const s  = useStore((s) => s.settings);
  const up = useStore((s) => s.updateSetting);
  return (
    <Section title="Paper" /* emoji="📄" */>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Paper Type</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px' }}>
          {PAPER_TYPES.map((t) => {
            const active = s.paperType === t;
            return (
              <button key={t} onClick={() => up('paperType', t)} style={{
                padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 500,
                textTransform: 'capitalize', cursor: 'pointer',
                background: active ? 'var(--accent)' : 'var(--bg-raised)',
                color: active ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                boxShadow: active ? '0 0 8px var(--accent-glow)' : 'none',
                transition: 'all 0.15s',
              }}>{t}</button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Paper Color</label>
        <Swatches items={PAPER_COLORS} active={s.paperColor} onSelect={(v) => up('paperColor', v)} showHexPicker />
      </div>

      {s.paperType !== 'blank' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Line Color</label>
          <Swatches items={LINE_COLORS} active={s.paperLineColor} onSelect={(v) => up('paperLineColor', v)} />
        </div>
      )}

      <ToggleControl label="Paper Texture" checked={s.paperTextureEnabled} onChange={(v) => up('paperTextureEnabled', v)} />
      <ToggleControl label="Paper Shadow"  checked={s.paperShadowEnabled}  onChange={(v) => up('paperShadowEnabled', v)} />
    </Section>
  );
}
