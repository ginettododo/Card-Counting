import { Card } from '@/engine/cards';
import { handValue } from '@/engine/hand';
import { Rules } from '@/engine/rules';
import { Action } from '@/engine/game';

const dealerIndex = (card: Card) => (card.rank === 'A' ? 11 : card.rank === 'K' || card.rank === 'Q' || card.rank === 'J' || card.rank === '10' ? 10 : Number(card.rank));

type DecisionRow = Record<number, string> & { default?: string };
type Table = Record<number, DecisionRow>;

type StrategyTables = {
  hard: Table;
  soft: Table;
  pairs: Table;
  surrender: Record<number, number[]>;
};

const multiDeckS17DAS: StrategyTables = {
  hard: {
    5: { default: 'H' },
    6: { default: 'H' },
    7: { default: 'H' },
    8: { default: 'H' },
    9: { 3: 'Dh', 4: 'Dh', 5: 'Dh', 6: 'Dh', default: 'H' },
    10: { 2: 'Dh', 3: 'Dh', 4: 'Dh', 5: 'Dh', 6: 'Dh', 7: 'Dh', 8: 'Dh', 9: 'Dh', default: 'H' },
    11: { 2: 'Dh', 3: 'Dh', 4: 'Dh', 5: 'Dh', 6: 'Dh', 7: 'Dh', 8: 'Dh', 9: 'Dh', 10: 'Dh', default: 'H' },
    12: { 4: 'S', 5: 'S', 6: 'S', default: 'H' },
    13: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', default: 'H' },
    14: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', default: 'H' },
    15: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', default: 'H' },
    16: { 2: 'S', 3: 'S', 4: 'S', 5: 'S', 6: 'S', default: 'H' },
    17: { default: 'S' },
    18: { default: 'S' },
    19: { default: 'S' },
    20: { default: 'S' },
    21: { default: 'S' },
  },
  soft: {
    13: { 5: 'Dh', 6: 'Dh', default: 'H' },
    14: { 5: 'Dh', 6: 'Dh', default: 'H' },
    15: { 4: 'Dh', 5: 'Dh', 6: 'Dh', default: 'H' },
    16: { 4: 'Dh', 5: 'Dh', 6: 'Dh', default: 'H' },
    17: { 3: 'Dh', 4: 'Dh', 5: 'Dh', 6: 'Dh', default: 'H' },
    18: { 3: 'Ds', 4: 'Ds', 5: 'Ds', 6: 'Ds', 2: 'S', 7: 'S', 8: 'S', default: 'H' },
    19: { 6: 'Ds', default: 'S' },
    20: { default: 'S' },
    21: { default: 'S' },
  },
  pairs: {
    2: { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', default: 'H' },
    3: { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', default: 'H' },
    4: { 5: 'P', 6: 'P', default: 'H' },
    5: { default: 'Dh' },
    6: { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', default: 'H' },
    7: { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'P', default: 'H' },
    8: { default: 'P' },
    9: { 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 8: 'P', 9: 'P', default: 'S' },
    10: { default: 'S' },
    11: { default: 'P' },
  },
  surrender: {
    15: [10],
    16: [9, 10, 11],
  },
};

const multiDeckH17Adjustments: Partial<StrategyTables> = {
  soft: {
    17: { 2: 'Dh', 3: 'Dh', 4: 'Dh', 5: 'Dh', 6: 'Dh', default: 'H' },
    18: { 2: 'Ds', 3: 'Ds', 4: 'Ds', 5: 'Ds', 6: 'Ds', 7: 'S', 8: 'S', default: 'H' },
  },
};

function mergeTables(base: StrategyTables, overrides?: Partial<StrategyTables>): StrategyTables {
  if (!overrides) return base;
  return {
    hard: { ...base.hard, ...(overrides.hard ?? {}) },
    soft: { ...base.soft, ...(overrides.soft ?? {}) },
    pairs: { ...base.pairs, ...(overrides.pairs ?? {}) },
    surrender: { ...base.surrender, ...(overrides.surrender ?? {}) },
  };
}

function lookup(table: Table, total: number, dealer: number): string | undefined {
  const row = table[total];
  if (!row) return undefined;
  return row[dealer] ?? row.default;
}

function resolveAction(code: string, rules: Rules, total: number): Action {
  const doubleAllowed = rules.allowDoubleAny || rules.allowDoubleOn.includes(total);
  switch (code) {
    case 'S':
      return 'STAND';
    case 'H':
      return 'HIT';
    case 'P':
      return 'SPLIT';
    case 'D':
      return doubleAllowed ? 'DOUBLE' : 'HIT';
    case 'Dh':
      return doubleAllowed ? 'DOUBLE' : 'HIT';
    case 'Ds':
      return doubleAllowed ? 'DOUBLE' : 'STAND';
    default:
      return 'HIT';
  }
}

function fallbackForSurrender(total: number, dealer: number): Action {
  if (total === 16 && dealer >= 9) return 'HIT';
  if (total === 15 && dealer === 10) return 'HIT';
  return total >= 17 ? 'STAND' : 'HIT';
}

export function recommendAction(hand: Card[], dealerUp: Card, rules: Rules): Action {
  const totalValue = handValue(hand);
  const dealer = dealerIndex(dealerUp);
  const tables = mergeTables(multiDeckS17DAS, rules.dealerHitsSoft17 ? multiDeckH17Adjustments : undefined);

  const isPair = hand.length === 2 && hand[0].rank === hand[1].rank;
  if (isPair) {
    const pairValue = hand[0].rank === 'A' ? 11 : hand[0].rank === '10' || hand[0].rank === 'J' || hand[0].rank === 'Q' || hand[0].rank === 'K' ? 10 : Number(hand[0].rank);
    const code = lookup(tables.pairs, pairValue, dealer);
    if (code === 'P' && rules.maxSplits > 0) {
      return 'SPLIT';
    }
  }

  if (rules.lateSurrender) {
    const surrenderRow = tables.surrender[totalValue.best];
    if (surrenderRow && surrenderRow.includes(dealer)) {
      return 'SURRENDER';
    }
  }

  if (totalValue.isSoft && totalValue.best <= 21 && totalValue.best >= 13 && totalValue.best <= 21) {
    const code = lookup(tables.soft, totalValue.best, dealer);
    if (code) return resolveAction(code, rules, totalValue.best);
  }

  const hardCode = lookup(tables.hard, totalValue.best, dealer) ?? 'H';
  const action = hardCode === 'H' && rules.lateSurrender && tables.surrender[totalValue.best]?.includes(dealer)
    ? fallbackForSurrender(totalValue.best, dealer)
    : resolveAction(hardCode, rules, totalValue.best);
  if (action === 'SURRENDER') return fallbackForSurrender(totalValue.best, dealer);
  return action;
}
