export default function ChartVisibilityControls({ unitNum, visibility, setVisibility, color }) {
  const toggle = (key) => {
    setVisibility({ ...visibility, [key]: !visibility[key] });
  };

  return (
    <div className="chart-controls">
      <p className="control-label" style={{ color: color, fontWeight: 'bold' }}>
        Unit {unitNum} Visibility
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <label className="checkbox-label">
          <input type="checkbox" checked={visibility.max} onChange={() => toggle('max')} />
          Class Max
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={visibility.range} onChange={() => toggle('range')} />
          Typical Range (10th-90th percentile)
        </label>
        <label className="checkbox-label">
          <input type="checkbox" checked={visibility.med} onChange={() => toggle('med')} />
          Median
        </label>
      </div>
    </div>
  );
}