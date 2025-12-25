import { Card } from '@/engine/cards';
import { CountingSystem, trueCount } from './types';

const map: Record<string, number> = {
  '2': 1,
  '3': 1,
  '4': 1,
  '5': 1,
  '6': 1,
  '7': 1,
  '8': 0,
  '9': 0,
  '10': -1,
  J: -1,
  Q: -1,
  K: -1,
  A: -1,
};

export function createKO(decks: number): CountingSystem {
  let rc = 0;
  const initialRunning = -4 * (decks - 1);
  rc = initialRunning;

  return {
    name: 'KO',
    observe(card: Card) {
      rc += map[card.rank];
    },
    reset() {
      rc = initialRunning;
    },
    getRC() {
      return rc;
    },
    getTC(decksRemaining: number) {
      return trueCount(rc, decksRemaining);
    },
    getMeta() {
      return { balanced: false, initialRunning };
    },
  };
}
