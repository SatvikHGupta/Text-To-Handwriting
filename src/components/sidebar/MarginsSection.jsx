// Margins section: margin line color, left/top/right toggles and sizes
import { useStore }  from '../../store.js';
import Section       from './Section.jsx';
import SliderControl from '../SliderControl.jsx';
import ToggleControl from '../ToggleControl.jsx';

const MARGIN_COLORS = [
  { name: 'Black', value: 'black'     },
  { name: 'Red',   value: 'crimson'   },
  { name: 'Blue',  value: 'royalblue' },
  { name: 'Gray',  value: 'lightgray' },
];

export default function MarginsSection() {
  const s  = useStore((s) => s.settings);
  const up = useStore((s) => s.updateSetting);

  const isPreset = MARGIN_COLORS.some((c) => c.value === s.marginLineColor);

  return (
    <Section title="Page & Margins" /* emoji="📐" */>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Margin Line Color</label>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {MARGIN_COLORS.map(({ name, value }) => {
            const active = s.marginLineColor === value;
            return (
              <button key={value} onClick={() => up('marginLineColor', value)} style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '5px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
                background: active ? 'var(--accent-subtle)' : 'var(--bg-raised)',
                border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                transition: 'all 0.15s',
              }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: value, border: '1px solid rgba(0,0,0,0.15)', flexShrink: 0 }} />
                {name}
              </button>
            );
          })}

          <label style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            padding: '5px 8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer',
            background: !isPreset ? 'var(--accent-subtle)' : 'var(--bg-raised)',
            border: `1px solid ${!isPreset ? 'var(--accent)' : 'var(--border)'}`,
            color: !isPreset ? 'var(--text-primary)' : 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}>
            <input
              type="color"
              value={isPreset ? '#000000' : s.marginLineColor}
              onChange={(e) => up('marginLineColor', e.target.value)}
              style={{ width: '10px', height: '10px', borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer', background: 'transparent', flexShrink: 0 }}
            />
            Custom
          </label>
        </div>
      </div>

      <ToggleControl label="Left Margin"  checked={s.paperMarginLeftEnabled}  onChange={(v) => up('paperMarginLeftEnabled', v)} />
      {s.paperMarginLeftEnabled  && <SliderControl label="Left Margin Size"  value={s.paperMarginLeft}  onChange={(v) => up('paperMarginLeft', v)}  min={20} max={160} step={5} unit="px" />}
      <ToggleControl label="Top Margin"   checked={s.paperMarginTopEnabled}   onChange={(v) => up('paperMarginTopEnabled', v)} />
      {s.paperMarginTopEnabled   && <SliderControl label="Top Margin Size"   value={s.paperMarginTop}   onChange={(v) => up('paperMarginTop', v)}   min={20} max={120} step={5} unit="px" />}
      <ToggleControl label="Right Margin" checked={s.paperMarginRightEnabled} onChange={(v) => up('paperMarginRightEnabled', v)} />
      {s.paperMarginRightEnabled && <SliderControl label="Right Margin Size" value={s.paperMarginRight} onChange={(v) => up('paperMarginRight', v)} min={20} max={120} step={5} unit="px" />}
    </Section>
  );
}
