import { nanoid } from 'nanoid';

export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export type Suit = 'S' | 'H' | 'D' | 'C';
export type Card = { rank: Rank; suit: Suit; id: string };

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
export const SUITS: Suit[] = ['S', 'H', 'D', 'C'];

/**
 * Build a fresh deck of 52 unique cards.
 */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ rank, suit, id: nanoid(8) });
    }
  }
  return deck;
}

/**
 * Create a multi-deck shoe preserving stable ids for deterministic playbacks.
 */
export function createMultiDeck(decks: number): Card[] {
  const cards: Card[] = [];
  for (let i = 0; i < decks; i += 1) {
    createDeck().forEach((card) => cards.push({ ...card, id: `${card.id}-${i}` }));
  }
  return cards;
}
