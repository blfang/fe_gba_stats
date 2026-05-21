import { DEFAULT_UNIT_STATE } from '../constants';

const TRAINEE_CLASSES = ['Recruit', 'Journeyman', 'Pupil'];

const getUniqueCharacterNames = (data) => new Set(data.map((d) => d.Name));

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/**
 * Validate a unit's URL-derived state against the actual CSV data.
 * Returns a corrected state object.
 */
export const validateUnitState = (state, data) => {
  const names = getUniqueCharacterNames(data);
  if (!state.selectedName || !names.has(state.selectedName)) {
    return { ...DEFAULT_UNIT_STATE, selectedName: '' };
  }

  const baseMatches = data.filter((v) => v.Name === state.selectedName);
  const uniqueMap = new Map();
  baseMatches.forEach((v) => {
    const key = `${v.Game}-${v.Variant}`;
    if (!uniqueMap.has(key)) uniqueMap.set(key, v);
  });
  const gameVariants = Array.from(uniqueMap.values());
  const maxVariant = gameVariants.length - 1;
  const validVariantIndex = clamp(state.variantIndex, 0, maxVariant);

  const selectedBase = gameVariants[validVariantIndex];

  // Validate tier2 promo
  const validTier2Options = data.filter(
    (v) =>
      v.Name === state.selectedName &&
      v.Game === selectedBase.Game &&
      v.Variant === selectedBase.Variant &&
      v.SecondClass &&
      v.SecondClass !== 'N/A'
  );
  const validTier2Classes = new Set(validTier2Options.map((v) => v.SecondClass));
  const validPromo1 = validTier2Classes.has(state.promo1Status) ? state.promo1Status : 'Unpromoted';

  // Validate tier3 promo
  const validTier3Options = validPromo1 !== 'Unpromoted'
    ? data.filter(
        (v) =>
          v.Name === state.selectedName &&
          v.Game === selectedBase.Game &&
          v.Variant === selectedBase.Variant &&
          v.SecondClass === validPromo1 &&
          v.ThirdClass &&
          v.ThirdClass !== 'N/A'
      )
    : [];
  const validTier3Classes = new Set(validTier3Options.map((v) => v.ThirdClass));
  const validPromo2 = validTier3Classes.has(state.promo2Status) ? state.promo2Status : 'Unpromoted';

  // Validate numeric ranges
  const isTier2 = validPromo1 !== 'Unpromoted';
  const isTier3 = validPromo2 !== 'Unpromoted';
  const isTrainee = TRAINEE_CLASSES.includes(selectedBase?.Class);

  const levelMin = isTier2 || isTier3 ? 1 : (selectedBase?.char_base_stats_Lv || 1);
  const levelMax = !isTier2 && !isTier3 && isTrainee ? 10 : 20;
  const validLevel = clamp(state.level, levelMin, levelMax);

  const validPromo1Level = clamp(state.promo1Level, 10, 20);
  const validPromo2Level = clamp(state.promo2Level, 10, 20);

  return {
    ...state,
    variantIndex: validVariantIndex,
    promo1Status: validPromo1,
    promo2Status: validPromo2,
    promo1Level: validPromo1Level,
    promo2Level: validPromo2Level,
    level: validLevel,
  };
};