export type Rules = {
  decks: number;
  penetration: number;
  dealerHitsSoft17: boolean;
  blackjackPayout: number;
  das: boolean;
  rsa: boolean;
  lateSurrender: boolean;
  peek: boolean;
  allowDoubleAny: boolean;
  allowDoubleOn: number[];
  maxSplits: number;
  insurance: boolean;
  csm: boolean;
};

export const defaultRules: Rules = {
  decks: 6,
  penetration: 0.75,
  dealerHitsSoft17: false,
  blackjackPayout: 1.5,
  das: true,
  rsa: true,
  lateSurrender: true,
  peek: true,
  allowDoubleAny: true,
  allowDoubleOn: [9, 10, 11],
  maxSplits: 3,
  insurance: true,
  csm: false,
};
