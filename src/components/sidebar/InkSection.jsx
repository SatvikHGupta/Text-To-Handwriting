// Ink effects section: blur, flow, shadow
import { useStore }  from '../../store.js';
import Section       from './Section.jsx';
import SliderControl from '../SliderControl.jsx';
import ToggleControl from '../ToggleControl.jsx';

export default function InkSection() {
  const s  = useStore((s) => s.settings);
  const up = useStore((s) => s.updateSetting);
  return (
    <Section title="Ink Effects" /* emoji="🖋️" */>
      <ToggleControl label="Blur" checked={s.inkBlurEnabled} onChange={(v) => up('inkBlurEnabled', v)} />
      {s.inkBlurEnabled && <SliderControl label="Blur Amount" value={s.inkBlurAmount} onChange={(v) => up('inkBlurAmount', v)} min={0} max={2} step={0.1} unit="px" />}
      <ToggleControl label="Ink Flow" checked={s.inkFlowEnabled} onChange={(v) => up('inkFlowEnabled', v)} />
      {s.inkFlowEnabled && <SliderControl label="Flow Amount" value={s.inkFlowAmount} onChange={(v) => up('inkFlowAmount', v)} min={0} max={3} step={0.1} />}
      <ToggleControl label="Shadow" checked={s.inkShadowEnabled} onChange={(v) => up('inkShadowEnabled', v)} />
      {s.inkShadowEnabled && <SliderControl label="Shadow Amount" value={s.inkShadowAmount} onChange={(v) => up('inkShadowAmount', v)} min={0} max={3} step={0.1} unit="px" />}
    </Section>
  );
}
