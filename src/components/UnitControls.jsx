import { useMemo } from 'react';
import Select, { components } from 'react-select';
import { getSpriteStyle } from '../utils/spriteLogic';

const createNumericOptions = (min, max) => {
  return Array.from({ length: max - min + 1 }, (_, i) => ({
    value: min + i,
    label: (min + i).toString(),
  }));
};

// Helper to find the best game key for a character based on FE8 > FE7 > FE6
const getBestGameForChar = (charName, data) => {
  const games = new Set(data.filter((v) => v.Name === charName).map((v) => v.Game));
  return ['FE8', 'FE7', 'FE6'].find((g) => games.has(g)) || 'FE7';
};

const CustomCharacterOption = (props) => {
  const { data: fullData } = props.selectProps;
  const charName = props.data.label;
  const gameKey = getBestGameForChar(charName, fullData);
  const spriteStyle = getSpriteStyle(gameKey, charName, 'mini');

  return (
    <components.Option {...props}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span>{charName}</span>
        <div
          style={{
            ...spriteStyle,
            zoom: 1.0,
            flexShrink: 0,
          }}
        />
      </div>
    </components.Option>
  );
};

export default function UnitControls({
  data, characterOptions, customStyles, themeColor,
  state, setState,
}) {
  const {
    selectedName, variantIndex, level, isHardMode,
    promo1Status, promo2Status, promo1Level, promo2Level, useAdjustedGrowths,
  } = state;

  const updateState = (newVal) => setState((prev) => ({ ...prev, ...newVal }));

  const gameVariants = useMemo(() => {
    if (!data.length) return [];
    const baseMatches = data.filter((v) => v.Name === selectedName);
    const uniqueMap = new Map();
    baseMatches.forEach((v) => {
      const key = `${v.Game}-${v.Variant}`;
      if (!uniqueMap.has(key)) uniqueMap.set(key, v);
    });
    const result = Array.from(uniqueMap.values());
    const uniqueGames = new Set(result.map((v) => v.Game));
    return result.map((v) => ({ ...v, _showGame: uniqueGames.size > 1 }));
  }, [data, selectedName]);

  const selectedBase = gameVariants[variantIndex] || gameVariants[0];
  const isTrainee = ['Recruit', 'Journeyman', 'Pupil'].includes(selectedBase?.Class);

  const tier2Options = useMemo(() => {
    if (!selectedBase || !data.length) return [];
    return data.filter(
      (v) =>
        v.Name === selectedName &&
        v.Game === selectedBase.Game &&
        v.Variant === selectedBase.Variant &&
        v.SecondClass &&
        v.SecondClass !== 'N/A'
    );
  }, [data, selectedName, selectedBase]);

  const tier3Options = useMemo(() => {
    if (promo1Status === 'Unpromoted' || !selectedBase) return [];
    return data.filter(
      (v) =>
        v.Name === selectedName &&
        v.Game === selectedBase.Game &&
        v.Variant === selectedBase.Variant &&
        v.SecondClass === promo1Status &&
        v.ThirdClass &&
        v.ThirdClass !== 'N/A'
    );
  }, [data, selectedName, selectedBase, promo1Status]);

  const char = useMemo(() => {
    if (!data.length || !selectedBase) return null;
    if (promo2Status !== 'Unpromoted')
      return tier3Options.find((p) => p.ThirdClass === promo2Status) || tier3Options[0];
    if (promo1Status !== 'Unpromoted')
      return tier2Options.find((p) => p.SecondClass === promo1Status) || tier2Options[0];
    return data.find(
      (v) =>
        v.Name === selectedName &&
        v.Game === selectedBase?.Game &&
        v.Variant === selectedBase?.Variant
    );
  }, [data, selectedName, selectedBase, promo1Status, promo2Status, tier2Options, tier3Options]);

  const isTier2 = promo1Status !== 'Unpromoted';
  const isTier3 = promo2Status !== 'Unpromoted';

  return (
    <div className="control-panel" style={{ borderLeft: `4px solid ${themeColor}`, flex: 1, height: 'fit-content' }}>
      <div className="control-group">
        <label className="control-label">Character</label>
        <Select
          options={characterOptions}
          value={{ value: selectedName, label: selectedName }}
          styles={customStyles}
          data={data}
          components={{ Option: CustomCharacterOption }}
          onChange={(s) => {
            const newChar = data.find((v) => v.Name === s.value);
            updateState({
              selectedName: s.value,
              variantIndex: 0,
              promo1Status: 'Unpromoted',
              promo2Status: 'Unpromoted',
              level: newChar?.char_base_stats_Lv || 1,
            });
          }}
        />
      </div>

      {gameVariants.length > 1 && (
        <div className="control-group">
          <label className="control-label">Game / Variant</label>
          <Select
            isSearchable={false}
            styles={customStyles}
            options={gameVariants.map((v, i) => ({
              value: i,
              label: `${v._showGame ? `${v.Game} - ` : ''}${v.Variant || 'Standard'}`,
            }))}
            value={{
              value: variantIndex,
              label: `${gameVariants[variantIndex]?._showGame ? `${gameVariants[variantIndex].Game} - ` : ''}${gameVariants[variantIndex]?.Variant || 'Standard'}`,
            }}
            onChange={(s) => {
              const newBase = gameVariants[s.value];
              updateState({
                variantIndex: s.value,
                promo1Status: 'Unpromoted',
                promo2Status: 'Unpromoted',
                level: newBase?.char_base_stats_Lv || 1,
              });
            }}
          />
        </div>
      )}

      {parseFloat(char?.['HM Bonus']) > 0 && (
        <div
          className={`toggle-card ${isHardMode ? 'active' : ''}`}
          onClick={() => updateState({ isHardMode: !isHardMode })}
        >
          <div className="toggle-switch" style={isHardMode ? { background: themeColor } : undefined} />
          <span className="toggle-text">Apply Hard Mode Bonuses</span>
        <a
          href="#faq-hard-mode"
          className="faq-link"
          onClick={(e) => e.stopPropagation()}
          title="Learn more about hard mode bonuses in the FAQ"
        >
          ?
        </a>
        </div>
      )}
      <div
        className={`toggle-card ${useAdjustedGrowths ? 'active' : ''}`}
        onClick={() => updateState({ useAdjustedGrowths: !useAdjustedGrowths })}
      >
        <div className="toggle-switch" style={useAdjustedGrowths ? { background: themeColor } : undefined} />
        <span className="toggle-text">Include reroll logic</span>
        <a
          href="#faq-reroll"
          className="faq-link"
          onClick={(e) => e.stopPropagation()}
          title="Learn more about reroll logic in the FAQ"
        >
          ?
        </a>
      </div>

      {tier2Options.length > 0 && (
        <div className="control-group" style={{ paddingTop: '15px' }}>
          <label className="control-label">Promotion</label>
          <Select
            isSearchable={false}
            styles={customStyles}
            options={[
              { value: 'Unpromoted', label: `Unpromoted (${selectedBase?.Class})` },
              ...[...new Set(tier2Options.map((o) => o.SecondClass))].map((sc) => ({ value: sc, label: sc })),
            ]}
            value={{
              value: promo1Status,
              label: promo1Status === 'Unpromoted' ? `Unpromoted (${selectedBase?.Class})` : promo1Status,
            }}
            onChange={(s) => updateState({ promo1Status: s.value, promo2Status: 'Unpromoted' })}
          />
        </div>
      )}

      {isTier2 && !isTrainee && (
        <div className="control-group">
          <div className="level-header">
            <label className="control-label">Promoted At</label>
            <Select
              styles={customStyles}
              isSearchable={false}
              value={{ value: promo1Level, label: promo1Level.toString() }}
              options={createNumericOptions(10, 20)}
              onChange={(s) => updateState({ promo1Level: s.value })}
            />
          </div>
          <input
            className="range-input"
            type="range"
            min="10"
            max="20"
            value={promo1Level}
            onChange={(e) => updateState({ promo1Level: Number(e.target.value) })}
          />
        </div>
      )}

      {tier3Options.length > 0 && (
        <div className="control-group">
          <label className="control-label">Second Promotion</label>
          <Select
            isSearchable={false}
            styles={customStyles}
            options={[
              { value: 'Unpromoted', label: 'Not Promoted Again' },
              ...[...new Set(tier3Options.map((o) => o.ThirdClass))].map((tc) => ({ value: tc, label: tc })),
            ]}
            value={{
              value: promo2Status,
              label: promo2Status === 'Unpromoted' ? 'Not Promoted Again' : promo2Status,
            }}
            onChange={(s) => updateState({ promo2Status: s.value })}
          />
        </div>
      )}

      {isTier3 && (
        <div className="control-group">
          <div className="level-header">
            <label className="control-label">Promoted At</label>
            <Select
              styles={customStyles}
              isSearchable={false}
              value={{ value: promo2Level, label: promo2Level.toString() }}
              options={createNumericOptions(10, 20)}
              onChange={(s) => updateState({ promo2Level: s.value })}
            />
          </div>
          <input
            className="range-input"
            type="range"
            min="10"
            max="20"
            value={promo2Level}
            onChange={(e) => updateState({ promo2Level: Number(e.target.value) })}
          />
        </div>
      )}

      <div className="control-group" style={{ marginTop: '20px' }}>
        <div className="level-header">
          <label className="control-label">Level</label>
          <Select
            styles={customStyles}
            isSearchable={false}
            isDisabled={(() => {
              const levelMin = isTier2 || isTier3 ? 1 : char?.char_base_stats_Lv || 1;
              const levelMax = !isTier2 && !isTier3 && isTrainee ? 10 : 20;
              return levelMin === levelMax;
            })()}
            value={{ value: level, label: level.toString() }}
            options={createNumericOptions(
              isTier2 || isTier3 ? 1 : char?.char_base_stats_Lv || 1,
              !isTier2 && !isTier3 && isTrainee ? 10 : 20
            )}
            onChange={(s) => updateState({ level: s.value })}
          />
        </div>
        {(() => {
          const levelMin = isTier2 || isTier3 ? 1 : char?.char_base_stats_Lv || 1;
          const levelMax = !isTier2 && !isTier3 && isTrainee ? 10 : 20;
          return levelMin !== levelMax ? (
            <input
              className="range-input"
              type="range"
              min={levelMin}
              max={levelMax}
              value={level}
              onChange={(e) => updateState({ level: Number(e.target.value) })}
            />
          ) : null;
        })()}
      </div>
    </div>
  );
}