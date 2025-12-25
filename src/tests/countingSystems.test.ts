import { describe, expect, it } from 'vitest';
import { getCountingSystem } from '@/counting';
import { Card } from '@/engine/cards';

const buildCard = (rank: Card['rank']): Card => ({ rank, suit: 'S', id: rank });

describe('counting systems', () => {
  it('tracks Hi-Lo running count', () => {
    const system = getCountingSystem('hi-lo', 6);
    ['2', '3', '10', 'A'].forEach((rank) => system.observe(buildCard(rank as Card['rank'])));
    expect(system.getRC()).toBe(0);
  });

  it('initialises KO with unbalanced running count', () => {
    const system = getCountingSystem('ko', 6);
    expect(system.getRC()).toBe(-20);
    system.observe(buildCard('5'));
    expect(system.getRC()).toBe(-19);
  });

  it('keeps aces neutral in Hi-Opt I', () => {
    const system = getCountingSystem('hi-opt-i', 6);
    system.observe(buildCard('A'));
    system.observe(buildCard('5'));
    expect(system.getRC()).toBe(1);
  });

  it('computes Zen true count', () => {
    const system = getCountingSystem('zen', 6);
    ['10', '10', '10'].forEach((rank) => system.observe(buildCard(rank as Card['rank'])));
    expect(system.getTC(4.5)).toBeLessThan(0);
  });
});
