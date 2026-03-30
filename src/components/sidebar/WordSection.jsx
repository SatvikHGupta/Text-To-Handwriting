// Word section: spacing, baseline wobble, rotation noise
import { useStore }  from '../../store.js';
import Section       from './Section.jsx';
import SliderControl from '../SliderControl.jsx';
import ToggleControl from '../ToggleControl.jsx';

export default function WordSection() {
  const s  = useStore((s) => s.settings);
  const up = useStore((s) => s.updateSetting);
  return (
    <Section title="Word" /* emoji="📝" */>
      <SliderControl label="Word Spacing" value={s.wordSpacing} onChange={(v) => up('wordSpacing', v)} min={2} max={20} step={1} unit="px" />
      <ToggleControl label="Spacing Noise" checked={s.wordSpacingNoiseEnabled} onChange={(v) => up('wordSpacingNoiseEnabled', v)} />
      {s.wordSpacingNoiseEnabled && <SliderControl label="Noise Amount" value={s.wordSpacingNoiseMax} onChange={(v) => up('wordSpacingNoiseMax', v)} min={0} max={8} step={0.5} />}
      <ToggleControl label="Baseline Wobble" checked={s.wordBaselineEnabled} onChange={(v) => up('wordBaselineEnabled', v)} />
      {s.wordBaselineEnabled && <SliderControl label="Wobble Amount" value={s.wordBaselineMax} onChange={(v) => up('wordBaselineMax', v)} min={0} max={5} step={0.5} />}
      <ToggleControl label="Word Rotation" checked={s.wordRotationEnabled} onChange={(v) => up('wordRotationEnabled', v)} />
      {s.wordRotationEnabled && <SliderControl label="Rotation Max" value={s.wordRotationMax} onChange={(v) => up('wordRotationMax', v)} min={0} max={3} step={0.1} unit="°" />}
    </Section>
  );
}
