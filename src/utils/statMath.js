/**
 * Core mathematical utilities for Fire Emblem Stat Projections
 */

export const binomPMF = (n, k, p) => {
  if (k < 0 || k > n) return 0;
  if (p === 0) return k === 0 ? 1 : 0;
  if (p === 1) return k === n ? 1 : 0;

  const logFactorial = (num) => {
    let res = 0;
    for (let i = 2; i <= num; i++) res += Math.log(i);
    return res;
  };

  const logBinom = logFactorial(n) - (logFactorial(k) + logFactorial(n - k));
  return Math.exp(logBinom + k * Math.log(p) + (n - k) * Math.log(1 - p));
};

export const convolve = (pmf1, pmf2) => {
  const result = {};
  for (const [k1, p1] of Object.entries(pmf1)) {
    for (const [k2, p2] of Object.entries(pmf2)) {
      const sum = parseInt(k1) + parseInt(k2);
      result[sum] = (result[sum] || 0) + (p1 * p2);
    }
  }
  return result;
};

export const hmPMFHelper = (y, a, b) => {
  if (y < Math.floor(a) || y > Math.floor(b) + 1) return 0.0;
  const term1 = (Math.pow(Math.min(1, 1 - (a - y)), 2) - Math.pow(Math.max(0, 1 - (b - y)), 2)) * (y <= Math.floor(b) ? 1 : 0);
  const term2 = (Math.pow(Math.min(1, b - y + 1), 2) - Math.pow(Math.max(0, a - y + 1), 2)) * (y >= Math.floor(a) + 1 ? 1 : 0);
  return (1.0 / 2.0 / (b - a)) * (term1 + term2);
};

/**
 * Calculates a specific percentile from a PMF (e.g., 0.5 for median)
 */
export const getPercentile = (pmf, percentile) => {
  const sortedKeys = Object.keys(pmf).map(Number).sort((a, b) => a - b);
  let cumulative = 0;
  for (const key of sortedKeys) {
    cumulative += pmf[key];
    if (cumulative >= percentile) return key;
  }
  return sortedKeys[sortedKeys.length - 1];
};

/**
 * Calculates the expected value (mean) of a PMF
 */
export const getAverage = (pmf) => {
  return Object.entries(pmf).reduce((acc, [val, prob]) => acc + (parseInt(val) * prob), 0);
};


// Add this helper to generate the full distribution object
export const createBinomialPMF = (n, p) => {
  const pmf = {};
  const intG = Math.floor(p);
  const fracG = p - intG;

  for (let k = 0; k <= n; k++) {
    // This handles growths > 100% by adding the guaranteed (intG * n)
    const statGain = k + (intG * n);
    pmf[statGain] = binomPMF(n, k, fracG);
  }
  return pmf;
};

/**
 * Processes a single stat through its entire lifecycle (Base -> T2 -> T3)
 * Handles Hard Mode bonuses, base leveling, promotion gains, and class caps.
 */
export const calculateStatDistribution = (char, stat, growthRate, config) => {
  const {
    level,
    promo1Level,
    promo2Level,
    isTier2,
    isTier3,
    startLevel,
    isHardMode
  } = config;

  // 1. Initial Seed: Start with the character's base stat
  let currentPMF = { [char[`char_base_stats_${stat}`] || 0]: 1.0 };

  // 2. Hard Mode Bonuses (Applied to base stats before recruitment)
  const hmBonusLevels = parseFloat(char['HM Bonus']) || 0;
  if (isHardMode && hmBonusLevels > 0) {
    const classGrowth = (char[`class_growth_rates_${stat}`] || 0) / 100;
    const expected = classGrowth * hmBonusLevels;

    // GBA HM calculation: uniform distribution around the expected gain
    const hmPMF = {};
    const a = (7 / 8) * expected;
    const b = (9 / 8) * expected;

    // Generate the probability for each possible integer gain from HM levels
    for (let y = Math.floor(a); y <= Math.floor(b) + 1; y++) {
      const p = hmPMFHelper(y, a, b);
      if (p > 0) hmPMF[y] = p;
    }
    currentPMF = convolve(currentPMF, hmPMF);
  }

  // 3. Base Class Leveling (Tier 1)
  // If promoted, they leveled to promo1Level. If not, they leveled to current level.
  const lvInTier1 = isTier2 ? Math.max(0, promo1Level - startLevel) : Math.max(0, level - startLevel);
  if (lvInTier1 > 0) {
    currentPMF = convolve(currentPMF, createBinomialPMF(lvInTier1, growthRate));
  }

  // 4. First Promotion (Tier 2)
  if (isTier2) {
    const cap1 = char[`class_max_stats_${stat}`] || 20;
    const gain1 = stat === 'Lck' ? 0 : (char[`second_class_promo_gains_${stat}`] || 0);

    // Cap at Tier 1 max, then add promo gains
    currentPMF = applyShiftAndCap(currentPMF, gain1, cap1);

    // Levels gained in Tier 2
    const lvInTier2 = isTier3 ? Math.max(0, promo2Level - 1) : Math.max(0, level - 1);
    if (lvInTier2 > 0) {
      currentPMF = convolve(currentPMF, createBinomialPMF(lvInTier2, growthRate));
    }
  }

  // 5. Second Promotion (Tier 3 / Trainee Final)
  if (isTier3) {
    const cap2 = char[`second_class_max_stats_${stat}`] || 20;
    const gain2 = stat === 'Lck' ? 0 : (char[`third_class_promo_gains_${stat}`] || 0);

    // Cap at Tier 2 max, then add second promo gains
    currentPMF = applyShiftAndCap(currentPMF, gain2, cap2);

    // Levels gained in Tier 3
    const lvInTier3 = Math.max(0, level - 1);
    if (lvInTier3 > 0) {
      currentPMF = convolve(currentPMF, createBinomialPMF(lvInTier3, growthRate));
    }
  }

  // 6. Final Class Cap
  // Determine which class cap applies based on current tier
  const finalCapKey = isTier3 ? 'third_class_max_stats' : (isTier2 ? 'second_class_max_stats' : 'class_max_stats');
  const finalCap = char[`${finalCapKey}_${stat}`] || (stat === 'HP' ? 60 : 20);

  return applyShiftAndCap(currentPMF, 0, finalCap);
};

// Ensure this is also exported if you use it elsewhere
export const applyShiftAndCap = (pmf, gain, cap) => {
  const next = {};
  Object.entries(pmf).forEach(([v, p]) => {
    const newVal = Math.min(parseInt(v) + gain, cap);
    next[newVal] = (next[newVal] || 0) + p;
  });
  return next;
};