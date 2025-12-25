import { Card } from '@/engine/cards';
import { CountingSystem, trueCount } from './types';

function createGenericSystem(name: string, map: Record<string, number>, initialRunning = 0): CountingSystem {
  let rc = initialRunning;
  return {
    name,
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
      return { balanced: initialRunning === 0 };
    },
  };
}

export function createOmegaII(): CountingSystem {
  const map: Record<string, number> = {
    '2': 1,
    '3': 1,
    '4': 2,
    '5': 2,
    '6': 2,
    '7': 1,
    '8': 0,
    '9': -1,
    '10': -2,
    J: -2,
    Q: -2,
    K: -2,
    A: 0,
  };
  return createGenericSystem('Omega II', map);
}

export function createHiOptI(): CountingSystem {
  const map: Record<string, number> = {
    '2': 0,
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
    A: 0,
  };
  return createGenericSystem('Hi-Opt I', map);
}

export function createZen(): CountingSystem {
  const map: Record<string, number> = {
    '2': 1,
    '3': 1,
    '4': 2,
    '5': 2,
    '6': 2,
    '7': 1,
    '8': 0,
    '9': 0,
    '10': -2,
    J: -2,
    Q: -2,
    K: -2,
    A: -1,
  };
  return createGenericSystem('Zen', map);
}
