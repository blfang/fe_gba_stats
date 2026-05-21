import { describe, it, expect } from 'vitest';
import { binomPMF, convolve, hmPMFHelper, getAverage, getPercentile } from './statMath';

describe('StatMath Utilities', () => {

  describe('binomPMF', () => {
    it('returns 1.0 for 0 successes at 0% growth', () => {
      expect(binomPMF(10, 0, 0)).toBe(1);
    });

    it('calculates a simple 50/50 flip correctly (n=1, k=1, p=0.5)', () => {
      expect(binomPMF(1, 1, 0.5)).toBe(0.5);
    });

    it('sums to ~1.0 over all possible outcomes', () => {
      const n = 10;
      const p = 0.45;
      let totalProb = 0;
      for (let k = 0; k <= n; k++) {
        totalProb += binomPMF(n, k, p);
      }
      expect(totalProb).toBeCloseTo(1, 5);
    });
  });

  describe('convolve', () => {
    it('correctly shifts a distribution by a constant', () => {
      const pmf1 = { 10: 1.0 }; // Guaranteed base stat of 10
      const pmf2 = { 1: 0.5, 2: 0.5 }; // 50/50 chance of +1 or +2
      const result = convolve(pmf1, pmf2);
      
      expect(result[11]).toBe(0.5);
      expect(result[12]).toBe(0.5);
    });

    it('convolves two Bernoulli distributions (coin flips)', () => {
      const coin = { 0: 0.5, 1: 0.5 };
      const result = convolve(coin, coin); // Two flips
      
      // Outcomes: 0 (0.25), 1 (0.5), 2 (0.25)
      expect(result[0]).toBe(0.25);
      expect(result[1]).toBe(0.5);
      expect(result[2]).toBe(0.25);
    });
  });

  describe('hmPMFHelper (Hard Mode Logic)', () => {
    it('returns 0 for values outside the support window', () => {
      // If window is [1, 2], checking 5 should be 0
      expect(hmPMFHelper(5, 1, 2)).toBe(0);
    });

    it('sums to ~1.0 over the support range', () => {
      const a = 2.5;
      const b = 4.8;
      let totalProb = 0;
      // Support is floor(a) to floor(b)+1 -> 2 to 5
      for (let y = 2; y <= 5; y++) {
        totalProb += hmPMFHelper(y, a, b);
      }
      expect(totalProb).toBeCloseTo(1, 5);
    });
  });

  describe('Aggregation Helpers', () => {
    const testPMF = { 10: 0.2, 11: 0.6, 12: 0.2 };

    it('calculates the correct average', () => {
      expect(getAverage(testPMF)).toBeCloseTo(11, 5);
    });

    it('finds the correct median (50th percentile)', () => {
      expect(getPercentile(testPMF, 0.5)).toBe(11);
    });

    it('finds the 90th percentile correctly', () => {
      // 0.2 (at 10) + 0.6 (at 11) = 0.8. 
      // Need more to hit 0.9, so must be 12.
      expect(getPercentile(testPMF, 0.9)).toBe(12);
    });
  });
});