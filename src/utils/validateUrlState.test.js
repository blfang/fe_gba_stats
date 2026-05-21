import { describe, it, expect } from 'vitest';
import { validateUnitState } from './validateUrlState';
import { DEFAULT_UNIT_STATE } from '../constants';

// A minimal mock dataset that mirrors the CSV shape for well-known characters
const MOCK_DATA = [
  { Game: 'FE7', Name: 'Kent', Variant: 'All', Class: 'Cavalier', SecondClass: 'Paladin', ThirdClass: 'N/A', char_base_stats_Lv: 1, 'HM Bonus': '0' },
  { Game: 'FE7', Name: 'Sain', Variant: 'All', Class: 'Cavalier', SecondClass: 'Paladin', ThirdClass: 'N/A', char_base_stats_Lv: 1, 'HM Bonus': '0' },
  { Game: 'FE8', Name: 'Ross', Variant: 'All', Class: 'Journeyman', SecondClass: 'Fighter', ThirdClass: 'Warrior', char_base_stats_Lv: 1, 'HM Bonus': '0' },
  { Game: 'FE8', Name: 'Ross', Variant: 'All', Class: 'Journeyman', SecondClass: 'Pirate', ThirdClass: 'Berserker', char_base_stats_Lv: 1, 'HM Bonus': '0' },
];

const makeState = (overrides) => ({ ...DEFAULT_UNIT_STATE, ...overrides });

describe('validateUnitState (URL parameter validation)', () => {

  describe('character name validation', () => {
    it('resets to empty when name does not exist in data', () => {
      const state = makeState({ selectedName: 'ent' });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.selectedName).toBe('');
      expect(result.level).toBe(DEFAULT_UNIT_STATE.level);
    });

    it('resets to empty when name is empty string', () => {
      const state = makeState({ selectedName: '' });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.selectedName).toBe('');
    });

    it('preserves a valid character name', () => {
      const state = makeState({ selectedName: 'Kent' });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.selectedName).toBe('Kent');
    });
  });

  describe('variant index validation', () => {
    it('clamps variantIndex to the number of available game/variant combos - 1', () => {
      // Kent has 1 variant (index 0), so 999 should be clamped to 0
      const state = makeState({ selectedName: 'Kent', variantIndex: 999 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.variantIndex).toBe(0);
    });

    it('clamps negative variantIndex to 0', () => {
      const state = makeState({ selectedName: 'Kent', variantIndex: -5 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.variantIndex).toBe(0);
    });

    it('preserves a valid variantIndex = 0', () => {
      const state = makeState({ selectedName: 'Kent', variantIndex: 0 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.variantIndex).toBe(0);
    });
  });

  describe('promotion class validation', () => {
    it('resets promo1Status to Unpromoted when the class does not exist for the character', () => {
      // Kent only has Paladin as a valid SecondClass, not 'Swordmaster'
      const state = makeState({ selectedName: 'Kent', promo1Status: 'Swordmaster' });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.promo1Status).toBe('Unpromoted');
    });

    it('preserves a valid promo1Status', () => {
      const state = makeState({ selectedName: 'Kent', promo1Status: 'Paladin' });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.promo1Status).toBe('Paladin');
    });

    it('resets promo2Status to Unpromoted when the class does not exist', () => {
      // Kent has no ThirdClass, so any promo2 should be reset
      const state = makeState({ selectedName: 'Kent', promo1Status: 'Paladin', promo2Status: 'Warrior' });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.promo2Status).toBe('Unpromoted');
    });

    it('preserves a valid promo2Status for characters that have it', () => {
      // Ross can go Fighter -> Warrior
      const state = makeState({ selectedName: 'Ross', promo1Status: 'Fighter', promo2Status: 'Warrior' });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.promo1Status).toBe('Fighter');
      expect(result.promo2Status).toBe('Warrior');
    });

    it('resets promo2Status when promo1Status is invalid (and promo1 gets reset too)', () => {
      const state = makeState({ selectedName: 'Ross', promo1Status: 'BadClass', promo2Status: 'Warrior' });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.promo1Status).toBe('Unpromoted');
      expect(result.promo2Status).toBe('Unpromoted');
    });
  });

  describe('numeric range validation', () => {
    it('clamps level above max (20 for non-trainee, non-promoted)', () => {
      const state = makeState({ selectedName: 'Kent', level: 99 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.level).toBe(20);
    });

    it('clamps level below min (Kent base starting level is 1)', () => {
      const state = makeState({ selectedName: 'Kent', level: -5 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.level).toBe(1);
    });

    it('clamps level to trainee max of 10 for unpromoted trainees', () => {
      // Ross is a Journeyman (trainee), unpromoted, max level = 10
      const state = makeState({ selectedName: 'Ross', level: 20 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.level).toBe(10);
    });

    it('uses level min = 1 when promoted', () => {
      const state = makeState({ selectedName: 'Kent', promo1Status: 'Paladin', level: 1 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.level).toBe(1);
    });

    it('clamps promo1Level to range 10-20', () => {
      const state = makeState({ selectedName: 'Kent', promo1Level: 5 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.promo1Level).toBe(10);
    });

    it('clamps promo1Level above max to 20', () => {
      const state = makeState({ selectedName: 'Kent', promo1Level: 99 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.promo1Level).toBe(20);
    });

    it('clamps promo2Level to range 10-20', () => {
      const state = makeState({ selectedName: 'Ross', promo1Status: 'Fighter', promo2Status: 'Warrior', promo2Level: 5 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.promo2Level).toBe(10);
    });

    it('preserves a valid level within range', () => {
      const state = makeState({ selectedName: 'Kent', level: 15 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.level).toBe(15);
    });

    it('preserves a valid promo1Level within range', () => {
      const state = makeState({ selectedName: 'Kent', promo1Level: 14 });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.promo1Level).toBe(14);
    });
  });

  describe('combined invalid scenarios', () => {
    it('handles multiple invalid params at once', () => {
      const state = makeState({
        selectedName: 'ent',
        level: 99,
        promo1Status: 'FakeClass',
        promo1Level: 5,
        variantIndex: 999,
      });
      const result = validateUnitState(state, MOCK_DATA);
      // Name invalid → resets all to defaults
      expect(result.selectedName).toBe('');
      expect(result.level).toBe(DEFAULT_UNIT_STATE.level);
      expect(result.promo1Status).toBe('Unpromoted');
      expect(result.promo1Level).toBe(20);
    });

    it('handles multiple invalid params for a real character', () => {
      const state = makeState({
        selectedName: 'Kent',
        promo1Status: 'FakeClass',
        promo1Level: 5,
        level: 99,
        variantIndex: 999,
      });
      const result = validateUnitState(state, MOCK_DATA);
      expect(result.selectedName).toBe('Kent');
      expect(result.promo1Status).toBe('Unpromoted'); // fake promo reset
      expect(result.promo1Level).toBe(10); // clamped from 5
      expect(result.level).toBe(20); // clamped from 99
      expect(result.variantIndex).toBe(0); // clamped from 999
    });
  });
});