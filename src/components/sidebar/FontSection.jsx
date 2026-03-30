// Font section: family, size, and ink color controls
import { useStore }  from '../../store.js';
import Section       from './Section.jsx';
import SliderControl from '../SliderControl.jsx';

const INK_COLORS = [
  { name: 'Black',     value: 'black'     },
  { name: 'Dark Blue', value: 'navy'      },
  { name: 'Blue',      value: 'royalblue' },
  { name: 'Dark Gray', value: 'dimgray'   },
  { name: 'Red',       value: 'crimson'   },
];

const selStyle = {
  width: '100%', padding: '6px 8px', fontSize: '12px',
  background: 'var(--bg-raised)', color: 'var(--text-primary)',
  border: '1px solid var(--border)', borderRadius: '6px',
  outline: 'none', cursor: 'pointer', appearance: 'none',
};

export default function FontSection() {
  const settings          = useStore((s) => s.settings);
  const updateSetting     = useStore((s) => s.updateSetting);
  const fonts             = useStore((s) => s.fonts);
  const setFontPickerOpen = useStore((s) => s.setFontPickerOpen);

  const isPreset = INK_COLORS.some((c) => c.value === settings.fontColor);

  return (
    <Section title="Font" /* emoji="✍️" */>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Font Family</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <select value={settings.fontFamily} onChange={(e) => updateSetting('fontFamily', e.target.value)}
            style={{ ...selStyle, fontFamily: settings.fontFamily, flex: 1 }}>
            {fonts.map((f) => (
              <option key={f.name} value={f.family} style={{ fontFamily: f.family }}>
                {f.name}{f.category === 'custom' ? ' ★' : ''}
              </option>
            ))}
          </select>
          <button onClick={() => setFontPickerOpen(true)} style={{
            padding: '6px 10px', fontSize: '11px', fontWeight: 600,
            background: 'var(--accent-subtle)', color: 'var(--accent-light)',
            border: '1px solid var(--accent-glow)', borderRadius: '6px', cursor: 'pointer',
          }}>+</button>
        </div>
      </div>

      <SliderControl label="Font Size" value={settings.fontSize}
        onChange={(v) => updateSetting('fontSize', v)} min={12} max={48} step={1} unit="px" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Ink Color</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px' }}>
          {INK_COLORS.map(({ name, value }) => {
            const active = settings.fontColor === value;
            return (
              <button key={value} onClick={() => updateSetting('fontColor', value)} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 7px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
                background: active ? 'var(--accent-subtle)' : 'var(--bg-raised)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: value, border: '1px solid var(--border)', flexShrink: 0 }} />
                {name}
              </button>
            );
          })}

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
              value={isPreset ? '#000000' : settings.fontColor}
              onChange={(e) => updateSetting('fontColor', e.target.value)}
              style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer', background: 'transparent', flexShrink: 0 }}
            />
            Custom
          </label>
        </div>
      </div>
    </Section>
  );
}
