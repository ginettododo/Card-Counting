'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RuleSet, ShoeConfig, CountingSystemId, BlackjackHandState } from '@/types/training';
import { buildShoe, startRound, hit, dealerPlay, settleRound, type ShoeState, type BlackjackRound } from '@/features/blackjack/engine';

interface BlackjackState {
  rules: RuleSet;
  shoeConfig: ShoeConfig;
  shoe: ShoeState;
  countingSystem: CountingSystemId;
  round?: BlackjackRound;
  balance: number;
  start: () => void;
  playerHit: () => void;
  stand: () => void;
  resetShoe: () => void;
}

const defaultRules: RuleSet = {
  dealerHitsSoft17: true,
  doubleAfterSplit: true,
  resplitAces: false,
  lateSurrender: true,
  dealerPeeksBlackjack: true,
  blackjackPayout: '3:2',
};

const defaultShoe: ShoeConfig = {
  decks: 6,
  penetration: 0.75,
  continuousShuffle: false,
};

export const useBlackjackStore = create<BlackjackState>()(
  persist(
    (set, get) => ({
      rules: defaultRules,
      shoeConfig: defaultShoe,
      shoe: buildShoe(defaultShoe),
      countingSystem: 'hi-lo',
      balance: 0,
      start() {
        const { shoe, countingSystem } = get();
        const { shoe: nextShoe, round } = startRound(shoe, countingSystem);
        set({ shoe: nextShoe, round });
      },
      playerHit() {
        const { round, shoe, countingSystem } = get();
        if (!round) return;
        const { shoe: nextShoe, round: updatedRound } = hit(shoe, round, 0, countingSystem);
        set({ shoe: nextShoe, round: updatedRound });
      },
      stand() {
        const { round, shoe, countingSystem, rules, balance } = get();
        if (!round) return;
        const dealerResult = dealerPlay(round.dealer, shoe, rules, countingSystem);
        const settled = settleRound({ ...round, dealer: dealerResult.dealer }, 1, rules);
        set({
          shoe: dealerResult.shoe,
          round: { ...round, dealer: dealerResult.dealer, settled },
          balance: balance + settled.delta,
        });
      },
      resetShoe() {
        const { shoeConfig } = get();
        set({ shoe: buildShoe(shoeConfig), round: undefined });
      },
    }),
    {
      name: 'blackjack-store',
      partialize: (state) => ({ rules: state.rules, shoeConfig: state.shoeConfig, countingSystem: state.countingSystem }),
    },
  ),
);
