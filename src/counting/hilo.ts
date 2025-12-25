import { Card } from '@/engine/cards';
import { CountingSystem, trueCount } from './types';

const map: Record<string, number> = {
  '2': 1,
  '3': 1,
  '4': 1,
  '5': 1,
  '6': 1,
  '7': 0,
  '8': 0,
  '9': 0,
  '10': -1,
  J: -1,
  Q: -1,
  K: -1,
  A: -1,
};

export function createHiLo(): CountingSystem {
  let rc = 0;
  return {
    name: 'Hi-Lo',
    observe(card: Card) {
      rc += map[card.rank];
    },
    reset() {
      rc = 0;
    },
    getRC() {
      return rc;
    },
    getTC(decksRemaining: number) {
      return trueCount(rc, decksRemaining);
    },
    getMeta() {
      return { balanced: true };
    },
  };
}
