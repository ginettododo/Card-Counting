import { CountingSystemId, RuleSet, ShoeConfig, BlackjackHandState, RoundOutcome } from '@/types/training';

const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
type Card = (typeof CARD_VALUES)[number];

export interface ShoeState {
  cards: Card[];
  cutIndex: number;
  discard: Card[];
  runningCount: number;
}

export interface BlackjackRound {
  playerHands: BlackjackHandState[];
  dealer: BlackjackHandState;
  settled?: RoundOutcome;
}

export const countingMaps: Record<CountingSystemId, Record<Card, number>> = {
  'hi-lo': { A: -1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 0, '8': 0, '9': 0, '10': -1, J: -1, Q: -1, K: -1 },
  ko: { A: -1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 0, '9': 0, '10': -1, J: -1, Q: -1, K: -1 },
  'omega-ii': { A: 0, '2': 1, '3': 1, '4': 2, '5': 2, '6': 2, '7': 1, '8': 0, '9': -1, '10': -2, J: -2, Q: -2, K: -2 },
  'hi-opt-i': { A: 0, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 0, '8': 0, '9': 0, '10': -1, J: -1, Q: -1, K: -1 },
  zen: { A: -1, '2': 1, '3': 1, '4': 2, '5': 2, '6': 2, '7': 1, '8': 0, '9': 0, '10': -2, J: -2, Q: -2, K: -2 },
};

export function buildShoe(config: ShoeConfig): ShoeState {
  const decks = Array.from({ length: config.decks }).flatMap(() => CARD_VALUES.flatMap((card) => Array(4).fill(card as Card)));
  const cards = shuffle(decks);
  const cutIndex = Math.floor(cards.length * config.penetration);
  return { cards, cutIndex, discard: [], runningCount: 0 };
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function dealCard(shoe: ShoeState, system: CountingSystemId): { card: Card; shoe: ShoeState } {
  if (shoe.cards.length === 0) {
    return { card: 'A', shoe: buildShoe({ decks: 6, penetration: 0.75, continuousShuffle: true }) };
  }
  const [card, ...rest] = shoe.cards;
  const runningCount = shoe.runningCount + countingMaps[system][card];
  return { card, shoe: { ...shoe, cards: rest, discard: [...shoe.discard, card], runningCount } };
}

export function evaluateHand(cards: Card[]): BlackjackHandState {
  let total = 0;
  let aces = 0;
  cards.forEach((card) => {
    if (card === 'A') {
      aces += 1;
      total += 11;
    } else if (['K', 'Q', 'J', '10'].includes(card)) {
      total += 10;
    } else {
      total += Number(card);
    }
  });

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  const soft = cards.includes('A') && total <= 21 && aces > 0;
  const isBlackjack = cards.length === 2 && total === 21;
  const isBusted = total > 21;

  return { hand: cards, total, soft, isBlackjack, isBusted };
}

export function startRound(shoe: ShoeState, system: CountingSystemId): { shoe: ShoeState; round: BlackjackRound } {
  let nextShoe = shoe;
  const playerCards: Card[] = [];
  const dealerCards: Card[] = [];
  for (let i = 0; i < 2; i += 1) {
    const playerDeal = dealCard(nextShoe, system);
    playerCards.push(playerDeal.card);
    nextShoe = playerDeal.shoe;
    const dealerDeal = dealCard(nextShoe, system);
    dealerCards.push(dealerDeal.card);
    nextShoe = dealerDeal.shoe;
  }

  return {
    shoe: nextShoe,
    round: {
      playerHands: [evaluateHand(playerCards)],
      dealer: evaluateHand(dealerCards),
    },
  };
}

export function hit(shoe: ShoeState, round: BlackjackRound, handIndex: number, system: CountingSystemId) {
  const result = dealCard(shoe, system);
  const hand = round.playerHands[handIndex];
  const newHand = evaluateHand([...hand.hand, result.card]);
  const updated = [...round.playerHands];
  updated[handIndex] = newHand;
  return { shoe: result.shoe, round: { ...round, playerHands: updated } };
}

export function dealerPlay(dealer: BlackjackHandState, shoe: ShoeState, rules: RuleSet, system: CountingSystemId) {
  let current = dealer;
  let currentShoe = shoe;
  while (current.total < 17 || (current.total === 17 && current.soft && rules.dealerHitsSoft17)) {
    const next = dealCard(currentShoe, system);
    current = evaluateHand([...current.hand, next.card]);
    currentShoe = next.shoe;
  }
  return { dealer: current, shoe: currentShoe };
}

export function settleRound(round: BlackjackRound, bet: number, rules: RuleSet): RoundOutcome {
  const player = round.playerHands[0];
  const dealer = round.dealer;

  if (player.isBlackjack && !dealer.isBlackjack) {
    const payout = rules.blackjackPayout === '3:2' ? bet * 1.5 : bet * (6 / 5);
    return { result: 'blackjack', delta: payout };
  }
  if (player.isBusted) return { result: 'lose', delta: -bet };
  if (dealer.isBusted) return { result: 'win', delta: bet };
  if (player.total > dealer.total) return { result: 'win', delta: bet };
  if (player.total < dealer.total) return { result: 'lose', delta: -bet };
  return { result: 'push', delta: 0 };
}

export function trueCount(running: number, remainingCards: number, decks: number): number {
  const decksRemaining = Math.max(0.25, (remainingCards / 52) * (1 / decks));
  return Number((running / decksRemaining).toFixed(2));
}
