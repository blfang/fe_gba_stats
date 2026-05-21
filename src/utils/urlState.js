// --- URL parameter configuration ---
// Each entry defines one URL query parameter for a unit:
//   suffix     – The query param suffix (prefixed with "1" or "2" at runtime)
//   key        – The React state property name
//   defaultVal – The value used when the param is absent in the URL
//   parse      – Converts the raw string from URL back to a state value
//   shouldWrite – Whether this param should be included in the serialized URL
//   serialize  – Converts the state value to a URL-safe string

const UNIT_PARAM_CONFIGS = [
  {
    suffix: 'n',
    key: 'selectedName',
    defaultVal: '',
    parse: (v) => v || '',
    shouldWrite: (state) => !!state.selectedName,
    serialize: (state) => encodeURIComponent(state.selectedName),
  },
  {
    suffix: 'v',
    key: 'variantIndex',
    defaultVal: 0,
    parse: (v) => parseInt(v) || 0,
    shouldWrite: (state) => !!state.variantIndex,
    serialize: (state) => String(state.variantIndex),
  },
  {
    suffix: 'l',
    key: 'level',
    defaultVal: 1,
    parse: (v) => parseInt(v) || 1,
    shouldWrite: (state) => state.level !== 1,
    serialize: (state) => String(state.level),
  },
  {
    suffix: 'h',
    key: 'isHardMode',
    defaultVal: false,
    parse: (v) => v === '1',
    shouldWrite: (state) => !!state.isHardMode,
    serialize: () => '1',
  },
  {
    suffix: 'p1',
    key: 'promo1Status',
    defaultVal: 'Unpromoted',
    parse: (v) => v || 'Unpromoted',
    shouldWrite: (state) => state.promo1Status !== 'Unpromoted',
    serialize: (state) => encodeURIComponent(state.promo1Status),
  },
  {
    suffix: 'p2',
    key: 'promo2Status',
    defaultVal: 'Unpromoted',
    parse: (v) => v || 'Unpromoted',
    shouldWrite: (state) => state.promo2Status !== 'Unpromoted',
    serialize: (state) => encodeURIComponent(state.promo2Status),
  },
  {
    suffix: 'l1',
    key: 'promo1Level',
    defaultVal: 20,
    parse: (v) => parseInt(v) || 20,
    shouldWrite: (state) => state.promo1Level !== 20,
    serialize: (state) => String(state.promo1Level),
  },
  {
    suffix: 'l2',
    key: 'promo2Level',
    defaultVal: 20,
    parse: (v) => parseInt(v) || 20,
    shouldWrite: (state) => state.promo2Level !== 20,
    serialize: (state) => String(state.promo2Level),
  },
  {
    suffix: 'g',
    key: 'useAdjustedGrowths',
    defaultVal: true,
    parse: (v) => v !== '0',
    shouldWrite: (state) => !state.useAdjustedGrowths,
    serialize: () => '0',
  },
];

const VIS_PARAM_CONFIGS = [
  {
    suffix: 'm',
    key: 'max',
    defaultVal: true,
    parse: (v) => v !== '0',
    shouldWrite: (state) => !state.max,
    serialize: () => '0',
  },
  {
    suffix: 'r',
    key: 'range',
    defaultVal: true,
    parse: (v) => v !== '0',
    shouldWrite: (state) => !state.range,
    serialize: () => '0',
  },
  {
    suffix: 'd',
    key: 'med',
    defaultVal: true,
    parse: (v) => v !== '0',
    shouldWrite: (state) => !state.med,
    serialize: () => '0',
  },
];

/**
 * Parse the current URL query string into { u1, u2, vis1, vis2 }.
 * Returns null if no unit-related params are present.
 */
export const parseQueryString = () => {
  const params = new URLSearchParams(window.location.search);
  const hasAny = Array.from(params.keys()).some((k) => /^[12]/.test(k));
  if (!hasAny) return null;

  const readState = (prefix, configs) => {
    const state = {};
    configs.forEach(({ suffix, key, defaultVal, parse }) => {
      const raw = params.get(`${prefix}${suffix}`);
      state[key] = raw !== null ? parse(raw) : defaultVal;
    });
    return state;
  };

  return {
    u1: readState('1', UNIT_PARAM_CONFIGS),
    u2: readState('2', UNIT_PARAM_CONFIGS),
    vis1: readState('1', VIS_PARAM_CONFIGS),
    vis2: readState('2', VIS_PARAM_CONFIGS),
  };
};

/**
 * Serialize unit/visibility state into a query string.
 * Returns an empty string when all values are defaults.
 */
export const buildQueryString = (u1, u2, vis1, vis2) => {
  const writeParts = (prefix, state, configs) => {
    const parts = [];
    configs.forEach(({ suffix, key, shouldWrite, serialize }) => {
      if (shouldWrite(state)) {
        parts.push(`${prefix}${suffix}=${serialize(state)}`);
      }
    });
    return parts;
  };

  const allParts = [
    ...writeParts('1', u1, UNIT_PARAM_CONFIGS),
    ...writeParts('2', u2, UNIT_PARAM_CONFIGS),
    ...writeParts('1', vis1, VIS_PARAM_CONFIGS),
    ...writeParts('2', vis2, VIS_PARAM_CONFIGS),
  ];

  return allParts.length ? `?${allParts.join('&')}` : '';
};