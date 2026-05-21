import { getAverage, getPercentile, calculateStatDistribution } from './statMath';
import { LABELS } from '../constants';

export default function calculateUnit(data, state) {
  if (!data.length || !state.selectedName) return { char: null, stats: null };

  const baseMatches = data.filter((v) => v.Name === state.selectedName);
  const uniqueMap = new Map();
  baseMatches.forEach((v) => {
    const key = `${v.Game}-${v.Variant}`;
    if (!uniqueMap.has(key)) uniqueMap.set(key, v);
  });
  const gameVariants = Array.from(uniqueMap.values());
  const selectedBase = gameVariants[state.variantIndex] || gameVariants[0];

  const tier2Options = data.filter(
    (v) =>
      v.Name === state.selectedName &&
      v.Game === selectedBase.Game &&
      v.Variant === selectedBase.Variant &&
      v.SecondClass &&
      v.SecondClass !== 'N/A'
  );
  const tier3Options = data.filter(
    (v) =>
      v.Name === state.selectedName &&
      v.Game === selectedBase.Game &&
      v.Variant === selectedBase.Variant &&
      v.SecondClass === state.promo1Status &&
      v.ThirdClass &&
      v.ThirdClass !== 'N/A'
  );

  const isTier2 = state.promo1Status !== 'Unpromoted';
  const isTier3 = state.promo2Status !== 'Unpromoted';

  let char = data.find(
    (v) =>
      v.Name === state.selectedName &&
      v.Game === selectedBase?.Game &&
      v.Variant === selectedBase?.Variant
  );
  if (state.promo2Status !== 'Unpromoted')
    char = tier3Options.find((p) => p.ThirdClass === state.promo2Status) || tier3Options[0];
  else if (state.promo1Status !== 'Unpromoted')
    char = tier2Options.find((p) => p.SecondClass === state.promo1Status) || tier2Options[0];

  if (!char) return { char: null, stats: null };

  const results = {};
  LABELS.forEach((stat) => {
    const growthKey = state.useAdjustedGrowths
      ? `char_growth_rates_adjusted_${stat}`
      : `char_growth_rates_${stat}`;
    results[stat] = calculateStatDistribution(char, stat, (char[growthKey] || 0) / 100, {
      level: state.level,
      promo1Level: state.promo1Level,
      promo2Level: state.promo2Level,
      isTier2,
      isTier3,
      isHardMode: state.isHardMode,
      startLevel: char.char_base_stats_Lv || 1,
    });
  });

  const stats = {
    avg: LABELS.map((l) => getAverage(results[l])),
    med: LABELS.map((l) => getPercentile(results[l], 0.5)),
    blessed: LABELS.map((l) => getPercentile(results[l], 0.9)),
    cursed: LABELS.map((l) => getPercentile(results[l], 0.1)),
    maxes: LABELS.map(
      (l) =>
        char[
          isTier3
            ? `third_class_max_stats_${l}`
            : isTier2
              ? `second_class_max_stats_${l}`
              : `class_max_stats_${l}`
        ] || 20
    ),
    charName: char.Name,
    className: isTier3 ? char.ThirdClass : isTier2 ? char.SecondClass : char.Class,
  };

  return { char, stats };
}
