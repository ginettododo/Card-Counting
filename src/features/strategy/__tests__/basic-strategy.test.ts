import { recommendAction } from '../basic-strategy';

const rules = {
  dealerHitsSoft17: true,
  doubleAfterSplit: true,
  resplitAces: false,
  lateSurrender: true,
  dealerPeeksBlackjack: true,
  blackjackPayout: '3:2' as const,
};

describe('basic strategy recommendation', () => {
  it('recommends split for aces', () => {
    const rec = recommendAction(['A', 'A'], '6', rules);
    expect(rec.action).toBe('split');
  });

  it('recommends surrender on 16 vs 10 with surrender enabled', () => {
    const rec = recommendAction(['9', '7'], '10', rules);
    expect(rec.action).toBe('surrender');
  });

  it('recommends stand on hard 17', () => {
    const rec = recommendAction(['10', '7'], '9', rules);
    expect(rec.action).toBe('stand');
  });
});
