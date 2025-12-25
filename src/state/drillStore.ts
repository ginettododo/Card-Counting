import { create } from 'zustand';
import { Card, createDeck } from '@/engine/cards';
import { CountingSystem, getCountingSystem } from '@/counting';
import { Rules, defaultRules } from '@/engine/rules';
import { CountingSystemId } from '@/types/training';
import { recommendAction } from '@/strategy/basicStrategy';
import { pickOne } from '@/lib/random';
import { now } from '@/lib/time';

export type DrillMode = 'count' | 'decision' | 'mixed';

export interface CountDrillState {
  visibleCards: Card[];
  targetCards: Card[];
  checkpointsEvery: number;
}

export interface DecisionDrillState {
  player: Card[];
  dealer: Card;
  correctAction: string;
}

export interface DrillMetrics {
  mode: DrillMode;
  score: number;
  attempts: number;
  startedAt: number | null;
  finishedAt: number | null;
  countDrill?: CountDrillState;
  decisionDrill?: DecisionDrillState;
}

export interface DrillStore {
  rules: Rules;
  countingSystem: CountingSystemId;
  system: CountingSystem;
  metrics: DrillMetrics;
  runningCount: number;
  start: (mode: DrillMode) => void;
  nextCountCard: () => Card | null;
  submitCount: (guess: number) => boolean;
  newDecisionSpot: () => DecisionDrillState;
  submitDecision: (action: string) => boolean;
  syncConfig: (rules: Rules, system: CountingSystemId) => void;
}

function buildRandomHand(): Card[] {
  const deck = createDeck();
  return [pickOne(deck), pickOne(deck)];
}

export const useDrillStore = create<DrillStore>((set, get) => ({
  rules: defaultRules,
  countingSystem: 'hi-lo',
  system: getCountingSystem('hi-lo', defaultRules.decks),
  metrics: {
    mode: 'count',
    score: 0,
    attempts: 0,
    startedAt: null,
    finishedAt: null,
  },
  runningCount: 0,
  start: (mode) => {
    const deck = createDeck();
    const system = getCountingSystem(get().countingSystem, get().rules.decks);
    system.reset();
    const firstCards = deck.slice(0, 20);
    set({
      system,
      metrics: {
        mode,
        score: 0,
        attempts: 0,
        startedAt: now(),
        finishedAt: null,
        countDrill: { visibleCards: [], targetCards: firstCards, checkpointsEvery: 5 },
        decisionDrill: undefined,
      },
      runningCount: 0,
    });
  },
  nextCountCard: () => {
    const state = get();
    const drill = state.metrics.countDrill;
    if (!drill || drill.targetCards.length === 0) return null;
    const [card, ...rest] = drill.targetCards;
    const visible = [...drill.visibleCards, card];
    visible.forEach((c) => state.system.observe(c));
    const rc = state.system.getRC();
    set({
      runningCount: rc,
      metrics: {
        ...state.metrics,
        countDrill: { ...drill, visibleCards: visible, targetCards: rest },
      },
    });
    return card;
  },
  submitCount: (guess) => {
    const state = get();
    const correct = state.runningCount === guess;
    set({
      metrics: {
        ...state.metrics,
        score: correct ? state.metrics.score + 1 : state.metrics.score,
        attempts: state.metrics.attempts + 1,
      },
    });
    return correct;
  },
  newDecisionSpot: () => {
    const player = buildRandomHand();
    const dealer = pickOne(createDeck());
    const correctAction = recommendAction(player, dealer, get().rules);
    const drill: DecisionDrillState = { player, dealer, correctAction };
    set((state) => ({ metrics: { ...state.metrics, decisionDrill: drill } }));
    return drill;
  },
  submitDecision: (action) => {
    const state = get();
    const drill = state.metrics.decisionDrill;
    if (!drill) return false;
    const correct = drill.correctAction === action;
    set({
      metrics: {
        ...state.metrics,
        score: correct ? state.metrics.score + 1 : state.metrics.score,
        attempts: state.metrics.attempts + 1,
      },
    });
    return correct;
  },
  syncConfig: (rules, system) => {
    set((state) => ({
      rules,
      countingSystem: system,
      system: getCountingSystem(system, rules.decks),
      metrics: { ...state.metrics, score: 0, attempts: 0, startedAt: null, finishedAt: null },
    }));
  },
}));
