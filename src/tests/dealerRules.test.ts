import { describe, expect, it } from 'vitest';
import { playDealer } from '@/engine/settlement';
import { Card } from '@/engine/cards';
import { Rules } from '@/engine/rules';

const card = (rank: Card['rank']): Card => ({ rank, suit: 'S', id: rank });

const h17Rules: Rules = {
  decks: 6,
  penetration: 0.75,
  dealerHitsSoft17: true,
  blackjackPayout: 1.5,
  das: true,
  rsa: true,
  lateSurrender: true,
  peek: true,
  allowDoubleAny: true,
  allowDoubleOn: [9, 10, 11],
  maxSplits: 3,
  insurance: true,
  csm: false,
};

describe('dealer H17 logic', () => {
  it('hits soft 17 when rule enabled', () => {
    const dealerHand = [card('A'), card('6')];
    const shoe = [card('2')];
    const draw = () => shoe.shift()!;
    const result = playDealer(dealerHand, draw, h17Rules);
    expect(result.length).toBe(3);
  });
});
