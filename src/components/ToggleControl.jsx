// Reusable toggle switch with label
export default function ToggleControl({ label, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{label}</label>
      <button type="button" className={`toggle-track ${checked ? 'active' : ''}`}
        onClick={() => onChange(!checked)} aria-pressed={checked} aria-label={label} />
    </div>
  );
}
