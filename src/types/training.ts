export type DeckCount = 1 | 2 | 4 | 6 | 8;
export type RuleSet = {
  dealerHitsSoft17: boolean;
  doubleAfterSplit: boolean;
  resplitAces: boolean;
  lateSurrender: boolean;
  dealerPeeksBlackjack: boolean;
  blackjackPayout: '3:2' | '6:5';
};

export type CountingSystemId = 'hi-lo' | 'ko' | 'omega-ii' | 'hi-opt-i' | 'zen';

export interface ShoeConfig {
  decks: DeckCount;
  penetration: number; // 0-1
  continuousShuffle: boolean;
}

export interface TrainerProfile {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'pro';
  createdAt: number;
}

export interface SessionStats {
  id: string;
  profileId: string;
  startedAt: number;
  mode: 'blackjack' | 'counting' | 'strategy';
  accuracy: number;
  streak: number;
  reactionMsAvg?: number;
}

export interface DrillResult {
  attempts: number;
  correct: number;
  averageTimeMs: number;
}

export type Card = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface BlackjackHandState {
  hand: Card[];
  total: number;
  soft: boolean;
  isBlackjack?: boolean;
  isBusted?: boolean;
}

export interface RoundOutcome {
  result: 'win' | 'lose' | 'push' | 'blackjack';
  delta: number;
}

export interface BasicStrategyRecommendation {
  action: 'hit' | 'stand' | 'double' | 'split' | 'surrender';
  rationale: string;
}
