// Reusable slider input with label and value display
export default function SliderControl({ label, value, onChange, min = 0, max = 10, step = 0.1, unit = '' }) {
  const display = typeof value === 'number'
    ? (Number.isInteger(step) ? value : value.toFixed(1))
    : value;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{label}</label>
        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--text-secondary)', minWidth: '36px', textAlign: 'right' }}>
          {display}{unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))} />
    </div>
  );
}
