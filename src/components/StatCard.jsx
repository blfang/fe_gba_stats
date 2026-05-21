import { getSpriteStyle } from '../utils/spriteLogic';
import { LABELS } from '../constants';

export default function StatCard({ char, stats, selectedName, level, useAdjustedGrowths, themeColor }) {
  if (!char || !stats) {
    return (
      <div
        className="stat-card-container"
        style={{
          flex: '1 1 300px',
          height: 'fit-content',
          margin: 0,
          borderLeft: `4px solid ${themeColor}`,
          opacity: 0.6,
        }}
      >
        <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
          {selectedName
            ? `"${selectedName}" not found in character data.`
            : 'Select a character to view stats.'}
        </div>
      </div>
    );
  }

  const gameKey = char.Game;
  const portraitStyle = getSpriteStyle(gameKey, stats.charName, 'large');

  return (
    <div
      className="stat-card-container"
      style={{
        flex: '1 1 300px',
        height: 'fit-content',
        margin: 0,
        borderLeft: `4px solid ${themeColor}`,
      }}
    >
      {/* Portrait Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div
          className="portrait-box"
          style={{
            ...portraitStyle,
            borderRadius: '4px',
          }}
        />
        <div style={{ flex: 1 }}>
          <h2 className="stat-name" style={{ margin: 0 }}>{stats.charName}</h2>
          <p className="stat-subtitle" style={{ margin: 0 }}>{stats.className} • Lv {level}</p>
        </div>
      </div>

      {/* Updated Table Header */}
      <div className="stat-table-header">
        <span className="header-label">Stat <span className="header-sub">(growth)</span></span>
        <span className="header-label header-label--right" title="The median, along with the 10th and 90th percentile range. Anything below (or above) this range occurs in the 10% unluckiest (or 10% luckiest) cases in terms of RNG.">Median <span className="header-sub">[10%, 90%]</span></span>
      </div>

      {/* Updated Table Rows */}
      {LABELS.map((l, i) => (
        <div key={l} className="stat-table-row">
          <span className="col-label">
            {l} <span className="val-growth">({Math.round(char?.[useAdjustedGrowths ? `char_growth_rates_adjusted_${l}` : `char_growth_rates_${l}`] || 0)}%)</span>
          </span>

          <span className="col-range-value">
            <span className="val-median">{stats.med[i]}</span>
            <span className="val-sep"> [</span>
            <span className="val-cursed">{stats.cursed[i]}</span>
            <span className="val-sep">, </span>
            <span className="val-blessed">{stats.blessed[i]}</span>
            <span className="val-sep">]</span>
          </span>
        </div>
      ))}
    </div>
  );
}