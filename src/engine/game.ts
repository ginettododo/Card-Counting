import { Card } from './cards';
import { draw, Shoe, createShoe } from './shoe';
import { Rules } from './rules';
import { playDealer, RoundResult, settlePlayerHand } from './settlement';

export type Phase = 'IDLE' | 'PLAYER_TURN' | 'DEALER_TURN' | 'ROUND_OVER';
export type Action = 'HIT' | 'STAND' | 'DOUBLE' | 'SPLIT' | 'SURRENDER' | 'INSURANCE' | 'NOINSURANCE';

export interface HandState {
  cards: Card[];
  bet: number;
  surrendered?: boolean;
  isSettled?: boolean;
  result?: RoundResult;
}

export interface RoundState {
  shoe: Shoe;
  playerHands: HandState[];
  activeHand: number;
  dealer: Card[];
  phase: Phase;
  insuranceTaken: boolean;
}

export interface GameContext {
  rules: Rules;
  initialBet: number;
}

export function dealInitial(shoe: Shoe, rules: Rules, bet: number): RoundState {
  let updatedShoe = shoe;
  const player: Card[] = [];
  const dealer: Card[] = [];
  // player, dealer up, player, dealer hole
  ({ card: player[0], shoe: updatedShoe } = draw(updatedShoe));
  ({ card: dealer[0], shoe: updatedShoe } = draw(updatedShoe));
  ({ card: player[1], shoe: updatedShoe } = draw(updatedShoe));
  ({ card: dealer[1], shoe: updatedShoe } = draw(updatedShoe));

  return {
    shoe: updatedShoe,
    playerHands: [{ cards: player, bet }],
    activeHand: 0,
    dealer,
    phase: 'PLAYER_TURN',
    insuranceTaken: false,
  };
}

export function playerHit(state: RoundState): RoundState {
  const { card, shoe } = draw(state.shoe);
  const playerHands = [...state.playerHands];
  playerHands[state.activeHand] = {
    ...playerHands[state.activeHand],
    cards: [...playerHands[state.activeHand].cards, card],
  };
  return { ...state, playerHands, shoe };
}

export function playerStand(state: RoundState): RoundState {
  return advanceHand(state);
}

export function playerDouble(state: RoundState): RoundState {
  const { card, shoe } = draw(state.shoe);
  const playerHands = [...state.playerHands];
  const current = playerHands[state.activeHand];
  playerHands[state.activeHand] = {
    ...current,
    cards: [...current.cards, card],
    bet: current.bet * 2,
  };
  return advanceHand({ ...state, playerHands, shoe });
}

export function playerSplit(state: RoundState, rules: Rules): RoundState {
  const hand = state.playerHands[state.activeHand];
  if (hand.cards.length !== 2 || hand.cards[0].rank !== hand.cards[1].rank) {
    throw new Error('Cannot split this hand');
  }
  if (state.playerHands.length > rules.maxSplits) throw new Error('Reached max splits');

  const [first, second] = hand.cards;
  const { card: newFirst, shoe: shoeAfterFirst } = draw(state.shoe);
  const { card: newSecond, shoe } = draw(shoeAfterFirst);
  const newHands: HandState[] = [
    { cards: [first, newFirst], bet: hand.bet },
    { cards: [second, newSecond], bet: hand.bet },
  ];
  const playerHands = [
    ...state.playerHands.slice(0, state.activeHand),
    ...newHands,
    ...state.playerHands.slice(state.activeHand + 1),
  ];
  return { ...state, playerHands };
}

export function surrender(state: RoundState): RoundState {
  const playerHands = [...state.playerHands];
  playerHands[state.activeHand] = { ...playerHands[state.activeHand], surrendered: true };
  return advanceHand({ ...state, playerHands });
}

export function executeDealer(state: RoundState, rules: Rules): RoundState {
  const drawCard = () => {
    const { card, shoe } = draw(state.shoe);
    state.shoe = shoe;
    return card;
  };
  const dealerHand = playDealer(state.dealer, drawCard, rules);
  return { ...state, dealer: dealerHand, phase: 'ROUND_OVER', shoe: state.shoe };
}

export function settle(state: RoundState, rules: Rules): RoundState {
  const dealer = state.dealer;
  const playerHands = state.playerHands.map((hand) => ({
    ...hand,
    result: settlePlayerHand(hand.cards, dealer, hand.bet, rules, hand.surrendered),
    isSettled: true,
  }));
  return { ...state, playerHands, phase: 'ROUND_OVER' };
}

function advanceHand(state: RoundState): RoundState {
  const nextIndex = state.activeHand + 1;
  if (nextIndex >= state.playerHands.length) {
    return { ...state, phase: 'DEALER_TURN' };
  }
  return { ...state, activeHand: nextIndex };
}

export function resetRound(context: GameContext): RoundState {
  const shoe = createShoe(context.rules.decks, undefined, context.rules.penetration, context.rules.csm ? 'csm' : 'shoe');
  return {
    shoe,
    playerHands: [],
    activeHand: 0,
    dealer: [],
    phase: 'IDLE',
    insuranceTaken: false,
  };
}
