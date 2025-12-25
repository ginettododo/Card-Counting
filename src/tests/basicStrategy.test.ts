import { describe, expect, it } from 'vitest';
import { recommendAction } from '@/strategy/basicStrategy';
import { Card } from '@/engine/cards';
import { defaultRules } from '@/engine/rules';

const c = (rank: Card['rank']): Card => ({ rank, suit: 'S', id: rank + Math.random() });

describe('basic strategy spot checks', () => {
  it('stands on hard 12 vs dealer 4', () => {
    expect(recommendAction([c('10'), c('2')], c('4'), defaultRules)).toBe('STAND');
  });
  it('hits hard 12 vs dealer 2', () => {
    expect(recommendAction([c('10'), c('2')], c('2'), defaultRules)).toBe('HIT');
  });
  it('doubles 11 vs dealer 6', () => {
    expect(recommendAction([c('6'), c('5')], c('6'), defaultRules)).toBe('DOUBLE');
  });
  it('splits 8s vs dealer 10', () => {
    expect(recommendAction([c('8'), c('8')], c('10'), defaultRules)).toBe('SPLIT');
  });
  it('surrenders 16 vs 10 when allowed', () => {
    expect(recommendAction([c('10'), c('6')], c('10'), defaultRules)).toBe('SURRENDER');
  });
  it('hits hard 16 vs 10 if surrender unavailable', () => {
    const noSurrender = { ...defaultRules, lateSurrender: false };
    expect(recommendAction([c('10'), c('6')], c('10'), noSurrender)).toBe('HIT');
  });
  it('doubles soft 18 vs 3', () => {
    expect(recommendAction([c('A'), c('7')], c('3'), defaultRules)).toBe('DOUBLE');
  });
  it('stands soft 18 vs 8', () => {
    expect(recommendAction([c('A'), c('7')], c('8'), defaultRules)).toBe('STAND');
  });
  it('hits soft 18 vs A', () => {
    expect(recommendAction([c('A'), c('7')], c('A'), defaultRules)).toBe('HIT');
  });
  it('splits 9s vs 9', () => {
    expect(recommendAction([c('9'), c('9')], c('9'), defaultRules)).toBe('SPLIT');
  });
  it('stands on hard 17', () => {
    expect(recommendAction([c('10'), c('7')], c('9'), defaultRules)).toBe('STAND');
  });
  it('doubles hard 9 vs 5', () => {
    expect(recommendAction([c('4'), c('5')], c('5'), defaultRules)).toBe('DOUBLE');
  });
  it('hits hard 9 vs 9', () => {
    expect(recommendAction([c('4'), c('5')], c('9'), defaultRules)).toBe('HIT');
  });
  it('splits Aces vs dealer anything', () => {
    expect(recommendAction([c('A'), c('A')], c('6'), defaultRules)).toBe('SPLIT');
    expect(recommendAction([c('A'), c('A')], c('10'), defaultRules)).toBe('SPLIT');
  });
});
