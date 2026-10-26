import { describe, expect, it } from 'vitest';
import { calculateAge, calculateDoseRange, nextQueueNumber } from '../lib/clinic-utils';

describe('clinic utilities', () => {
  it('calculates child age in years and months', () => {
    expect(calculateAge('2024-06-01', '2026-10-26')).toEqual({ years: 2, months: 4 });
  });

  it('calculates paracetamol dose by current weight', () => {
    expect(calculateDoseRange('Paracetamol', 12)).toEqual({ minMg: 120, maxMg: 180, label: 'per dosis' });
  });

  it('increments latest queue number', () => {
    expect(nextQueueNumber(['A-001', 'A-009'])).toBe('A-010');
  });
});
