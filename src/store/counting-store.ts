'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CountingSystem } from '@/types/training';
import { countingMaps, buildShoe, dealCard, type ShoeState } from '@/features/blackjack/engine';

interface CountingState {
  system: CountingSystem;
  shoe: ShoeState;
  visibleCard?: string;
  runningCount: number;
  trueCount: number;
  nextCard: () => void;
  setSystem: (system: CountingSystem) => void;
}

export const useCountingStore = create<CountingState>()(
  persist(
    (set, get) => ({
      system: 'hi-lo',
      shoe: buildShoe({ decks: 6, penetration: 0.8, continuousShuffle: false }),
      runningCount: 0,
      trueCount: 0,
      nextCard() {
        const { shoe, system } = get();
        const result = dealCard(shoe, system);
        const remainingCards = result.shoe.cards.length;
        const decks = result.shoe.cards.length / 52;
        const trueCountValue = Number((result.shoe.runningCount / Math.max(0.25, decks)).toFixed(2));
        set({
          shoe: result.shoe,
          visibleCard: result.card,
          runningCount: result.shoe.runningCount,
          trueCount: trueCountValue,
        });
      },
      setSystem(system) {
        const { shoe } = get();
        set({ system, runningCount: shoe.runningCount, trueCount: 0 });
      },
    }),
    { name: 'counting-store', partialize: (state) => ({ system: state.system }) },
  ),
);
