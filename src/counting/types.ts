import { Card } from '@/engine/cards';

export interface CountingSystem {
  name: string;
  observe: (card: Card) => void;
  reset: () => void;
  getRC: () => number;
  getTC: (decksRemaining: number) => number;
  getMeta: () => Record<string, unknown>;
}

export function trueCount(rc: number, decksRemaining: number): number {
  const denominator = Math.max(0.25, decksRemaining);
  return Math.round((rc / denominator) * 10) / 10;
}
