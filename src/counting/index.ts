import { createHiLo } from './hilo';
import { createKO } from './ko';
import { createHiOptI, createOmegaII, createZen } from './systems';
import { CountingSystem } from './types';
import { CountingSystemId } from '@/types/training';

const factories: Record<CountingSystemId, (decks: number) => CountingSystem> = {
  'hi-lo': () => createHiLo(),
  ko: (decks) => createKO(decks),
  'omega-ii': () => createOmegaII(),
  'hi-opt-i': () => createHiOptI(),
  zen: () => createZen(),
};

export function getCountingSystem(name: CountingSystemId, decks: number): CountingSystem {
  const factory = factories[name] ?? factories['hi-lo'];
  return factory(decks);
}

export * from './types';
export * from './hilo';
export * from './ko';
export * from './systems';
