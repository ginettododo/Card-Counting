import { Card, createMultiDeck } from './cards';

export type ShoeMode = 'shoe' | 'csm';

export interface Shoe {
  cards: Card[];
  discard: Card[];
  cutCardIndex: number;
  needsReshuffle: boolean;
  decks: number;
  penetration: number;
  mode: ShoeMode;
  rngSeed?: number;
}

function seededRandom(seed: number) {
  let x = seed || 1;
  return () => {
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    return (x < 0 ? ~x + 1 : x) % 1_000_000 / 1_000_000;
  };
}

export function createShoe(decks: number, rngSeed?: number, penetration = 0.75, mode: ShoeMode = 'shoe'): Shoe {
  const cards = createMultiDeck(decks);
  const random = seededRandom(rngSeed ?? Date.now());
  const shuffled = shuffle([...cards], random);
  const cutCardIndex = Math.floor(shuffled.length * (1 - penetration));
  return {
    cards: shuffled,
    discard: [],
    cutCardIndex,
    needsReshuffle: false,
    decks,
    penetration,
    mode,
    rngSeed,
  };
}

export function shuffle(cards: Card[], random = Math.random): Card[] {
  for (let i = cards.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export function draw(shoe: Shoe): { card: Card; shoe: Shoe } {
  if (shoe.cards.length === 0) {
    throw new Error('Shoe is empty. Reshuffle required.');
  }
  const [card, ...rest] = shoe.cards;
  const discard = shoe.mode === 'csm' ? [] : [...shoe.discard, card];
  let cards = rest;
  if (shoe.mode === 'csm') {
    const reshuffled = shuffle([...rest, card]);
    cards = reshuffled;
  }
  const needsReshuffle = cards.length <= shoe.cutCardIndex;
  return { card, shoe: { ...shoe, cards, discard, needsReshuffle } };
}
