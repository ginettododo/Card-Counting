import { create } from 'zustand';
import { Action, dealInitial, executeDealer, playerDouble, playerHit, playerSplit, playerStand, RoundState, settle, surrender } from '@/engine/game';
import { defaultRules, Rules } from '@/engine/rules';
import { createShoe } from '@/engine/shoe';
import { Card } from '@/engine/cards';
import { CountingSystem, getCountingSystem } from '@/counting';
import { handValue } from '@/engine/hand';

export interface GameMetrics {
  bankroll: number;
  lastResult?: string;
}

export interface GameStore {
  rules: Rules;
  countingSystemName: 'Hi-Lo' | 'KO';
  counting: CountingSystem;
  round: RoundState;
  metrics: GameMetrics;
  setRules: (rules: Rules) => void;
  setCountingSystem: (system: 'Hi-Lo' | 'KO') => void;
  startRound: (bet?: number) => void;
  act: (action: Action) => void;
  revealDealer: () => void;
  decksRemaining: () => number;
}

function createInitialState(): RoundState {
  const shoe = createShoe(defaultRules.decks, undefined, defaultRules.penetration, defaultRules.csm ? 'csm' : 'shoe');
  return { shoe, playerHands: [], dealer: [], activeHand: 0, phase: 'IDLE', insuranceTaken: false };
}

function observeCard(counting: CountingSystem, card: Card) {
  counting.observe(card);
}

export const useGameStore = create<GameStore>((set, get) => ({
  rules: defaultRules,
  countingSystemName: 'Hi-Lo',
  counting: getCountingSystem('Hi-Lo', defaultRules.decks),
  round: createInitialState(),
  metrics: { bankroll: 0 },
  setRules: (rules) =>
    set((state) => ({
      rules,
      round: { ...state.round, shoe: createShoe(rules.decks, state.round.shoe.rngSeed, rules.penetration, rules.csm ? 'csm' : 'shoe') },
    })),
  setCountingSystem: (system) =>
    set((state) => ({
      countingSystemName: system,
      counting: getCountingSystem(system, state.rules.decks),
    })),
  startRound: (bet = 10) => {
    set((state) => {
      const shoe = state.round.shoe.needsReshuffle
        ? createShoe(state.rules.decks, state.round.shoe.rngSeed, state.rules.penetration, state.rules.csm ? 'csm' : 'shoe')
        : state.round.shoe;
      state.counting.reset();
      const round = dealInitial(shoe, state.rules, bet);
      // visibility: player cards and dealer upcard only
      observeCard(state.counting, round.playerHands[0].cards[0]);
      observeCard(state.counting, round.playerHands[0].cards[1]);
      observeCard(state.counting, round.dealer[0]);
      return { round };
    });
  },
  act: (action) => {
    const state = get();
    let round = state.round;
    if (round.phase === 'PLAYER_TURN') {
      switch (action) {
        case 'HIT':
          round = playerHit(round);
          observeCard(state.counting, round.playerHands[round.activeHand].cards.slice(-1)[0]);
          break;
        case 'STAND':
          round = playerStand(round);
          break;
        case 'DOUBLE':
          round = playerDouble(round);
          observeCard(state.counting, round.playerHands[round.activeHand]?.cards.slice(-1)[0]);
          break;
        case 'SPLIT':
          round = playerSplit(round, state.rules);
          round.playerHands[round.activeHand].cards.forEach((c) => observeCard(state.counting, c));
          round.playerHands[round.activeHand + 1].cards.forEach((c) => observeCard(state.counting, c));
          break;
        case 'SURRENDER':
          round = surrender(round);
          break;
        default:
          break;
      }
    }
    set({ round });
  },
  revealDealer: () => {
    set((state) => {
      if (state.round.phase === 'DEALER_TURN') {
        // reveal hole card
        if (state.round.dealer[1]) {
          observeCard(state.counting, state.round.dealer[1]);
        }
        let round = executeDealer(state.round, state.rules);
        // observe cards drawn by dealer beyond hole
        round.dealer.slice(2).forEach((card) => observeCard(state.counting, card));
        round = settle(round, state.rules);
        const bankrollChange = round.playerHands.reduce((acc, h) => acc + (h.result?.payout ?? 0), 0);
        return { round, metrics: { bankroll: state.metrics.bankroll + bankrollChange, lastResult: `${bankrollChange}` } };
      }
      if (state.round.phase === 'ROUND_OVER') return state;
      return state;
    });
  },
  decksRemaining: () => {
    const { round, rules } = get();
    return Math.max(0.25, round.shoe.cards.length / (rules.decks * 52));
  },
}));

export function isActionAllowed(action: Action, round: RoundState, rules: Rules): boolean {
  const hand = round.playerHands[round.activeHand];
  const total = handValue(hand.cards).best;
  switch (action) {
    case 'DOUBLE':
      return round.phase === 'PLAYER_TURN' && (rules.allowDoubleAny || rules.allowDoubleOn.includes(total));
    case 'SPLIT':
      return (
        round.phase === 'PLAYER_TURN' &&
        hand.cards.length === 2 &&
        hand.cards[0].rank === hand.cards[1].rank &&
        round.playerHands.length <= rules.maxSplits
      );
    case 'SURRENDER':
      return round.phase === 'PLAYER_TURN' && rules.lateSurrender;
    default:
      return round.phase === 'PLAYER_TURN';
  }
}
