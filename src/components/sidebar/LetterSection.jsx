// Letter section: letter spacing and noise
import { useStore }  from '../../store.js';
import Section       from './Section.jsx';
import SliderControl from '../SliderControl.jsx';
import ToggleControl from '../ToggleControl.jsx';

export default function LetterSection() {
  const s  = useStore((s) => s.settings);
  const up = useStore((s) => s.updateSetting);
  return (
    <Section title="Letter" /*emoji="🔤"*/>
      <SliderControl label="Letter Spacing" value={s.letterSpacing} onChange={(v) => up('letterSpacing', v)} min={-2} max={8} step={0.5} unit="px" />
      <ToggleControl label="Spacing Noise" checked={s.letterSpacingNoiseEnabled} onChange={(v) => up('letterSpacingNoiseEnabled', v)} />
      {s.letterSpacingNoiseEnabled && <SliderControl label="Noise Amount" value={s.letterSpacingNoiseMax} onChange={(v) => up('letterSpacingNoiseMax', v)} min={0} max={3} step={0.1} />}
    </Section>
  );
}
