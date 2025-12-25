import { describe, expect, it } from 'vitest';
import { handValue } from '@/engine/hand';
import { Card } from '@/engine/cards';

function card(rank: Card['rank'], suit: Card['suit'] = 'S'): Card {
  return { rank, suit, id: `${rank}${suit}` };
}

describe('handValue', () => {
  it('handles multiple aces optimally', () => {
    const value = handValue([card('A'), card('A'), card('9')]);
    expect(value.best).toBe(21);
    expect(value.isSoft).toBe(true);
    expect(value.isBust).toBe(false);
  });

  it('detects blackjack', () => {
    const value = handValue([card('A'), card('K')]);
    expect(value.isBlackjack).toBe(true);
    expect(value.best).toBe(21);
  });
});
