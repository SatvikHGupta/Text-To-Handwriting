// Line section: line spacing, slope, font size noise
import { useStore }  from '../../store.js';
import Section       from './Section.jsx';
import SliderControl from '../SliderControl.jsx';
import ToggleControl from '../ToggleControl.jsx';

export default function LineSection() {
  const s  = useStore((s) => s.settings);
  const up = useStore((s) => s.updateSetting);
  return (
    <Section title="Line" /* emoji="📏" */>
      <SliderControl label="Line Spacing" value={s.lineSpacing} onChange={(v) => up('lineSpacing', v)} min={20} max={60} step={1} unit="px" />
      <ToggleControl label="Spacing Noise" checked={s.lineSpacingNoiseEnabled} onChange={(v) => up('lineSpacingNoiseEnabled', v)} />
      {s.lineSpacingNoiseEnabled && <SliderControl label="Noise Amount" value={s.lineSpacingNoiseMax} onChange={(v) => up('lineSpacingNoiseMax', v)} min={0} max={8} step={0.5} />}
      <ToggleControl label="Line Slope" checked={s.lineSlopeEnabled} onChange={(v) => up('lineSlopeEnabled', v)} />
      {s.lineSlopeEnabled && <SliderControl label="Slope Amount" value={s.lineSlopeMax} onChange={(v) => up('lineSlopeMax', v)} min={0} max={3} step={0.1} unit="°" />}
      <ToggleControl label="Font Size Noise" checked={s.lineFontNoiseEnabled} onChange={(v) => up('lineFontNoiseEnabled', v)} />
      {s.lineFontNoiseEnabled && <SliderControl label="Noise Amount" value={s.lineFontNoiseMax} onChange={(v) => up('lineFontNoiseMax', v)} min={0} max={4} step={0.5} />}
    </Section>
  );
}
