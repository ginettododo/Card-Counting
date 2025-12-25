import { Card } from './cards';

export type HandValue = {
  best: number;
  isSoft: boolean;
  totals: number[];
  isBlackjack: boolean;
  isBust: boolean;
};

/**
 * Compute all totals for a blackjack hand, handling multiple aces gracefully.
 */
export function handValue(hand: Card[]): HandValue {
  let totals = [0];
  hand.forEach((card) => {
    const value = card.rank === 'A' ? [1, 11] : ['K', 'Q', 'J'].includes(card.rank) || card.rank === '10' ? [10] : [Number(card.rank)];
    const nextTotals: number[] = [];
    totals.forEach((t) => {
      value.forEach((v) => nextTotals.push(t + v));
    });
    totals = Array.from(new Set(nextTotals));
  });

  const validTotals = totals.filter((t) => t <= 21);
  const best = validTotals.length ? Math.max(...validTotals) : Math.min(...totals);
  const isSoft = hand.some((c) => c.rank === 'A') && validTotals.includes(best) && totals.includes(best - 10);
  const isBlackjack = hand.length === 2 && best === 21;
  const isBust = totals.every((t) => t > 21);

  return { best, isSoft, totals: totals.sort((a, b) => a - b), isBlackjack, isBust };
}
