import { buildShoe, startRound, hit, evaluateHand, countingMaps } from '../engine';

describe('blackjack engine', () => {
  it('builds shoe with correct length and cut index', () => {
    const shoe = buildShoe({ decks: 2, penetration: 0.75, continuousShuffle: false });
    expect(shoe.cards.length).toBe(2 * 52);
    expect(shoe.cutIndex).toBeCloseTo(shoe.cards.length * 0.75, 0);
  });

  it('evaluates blackjack and bust states', () => {
    const bj = evaluateHand(['A', 'K']);
    expect(bj.isBlackjack).toBe(true);
    const bust = evaluateHand(['K', 'Q', '5']);
    expect(bust.isBusted).toBe(true);
  });

  it('starts round and allows hit', () => {
    const shoe = buildShoe({ decks: 1, penetration: 0.8, continuousShuffle: false });
    const { shoe: afterDeal, round } = startRound(shoe, 'hi-lo');
    expect(round.playerHands[0].hand).toHaveLength(2);
    const { round: afterHit } = hit(afterDeal, round, 0, 'hi-lo');
    expect(afterHit.playerHands[0].hand.length).toBe(3);
  });
});
