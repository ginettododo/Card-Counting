import { createHiLo } from './hilo';
import { createKO } from './ko';
import { CountingSystem } from './types';

export function getCountingSystem(name: 'Hi-Lo' | 'KO', decks: number): CountingSystem {
  if (name === 'KO') return createKO(decks);
  return createHiLo();
}

export * from './types';
export * from './hilo';
export * from './ko';
