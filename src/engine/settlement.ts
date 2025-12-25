import { Card } from './cards';
import { handValue } from './hand';
import { Rules } from './rules';

export type Outcome = 'WIN' | 'LOSE' | 'PUSH' | 'BLACKJACK' | 'SURRENDER';
export type RoundResult = { outcome: Outcome; payout: number; description: string };

export function playDealer(dealer: Card[], shoeDraw: () => Card, rules: Rules): Card[] {
  let current = [...dealer];
  let value = handValue(current);
  while (true) {
    const shouldHitSoft17 = rules.dealerHitsSoft17 && value.best === 17 && value.isSoft;
    if (value.best < 17 || shouldHitSoft17) {
      current = [...current, shoeDraw()];
      value = handValue(current);
      continue;
    }
    break;
  }
  return current;
}

export function settlePlayerHand(player: Card[], dealer: Card[], bet: number, rules: Rules, surrendered = false): RoundResult {
  if (surrendered) {
    return { outcome: 'SURRENDER', payout: -bet / 2, description: 'Late surrender' };
  }

  const playerValue = handValue(player);
  const dealerValue = handValue(dealer);

  if (playerValue.isBust) return { outcome: 'LOSE', payout: -bet, description: 'Player bust' };
  if (dealerValue.isBust) return { outcome: 'WIN', payout: bet, description: 'Dealer bust' };

  if (playerValue.isBlackjack && !dealerValue.isBlackjack) {
    return { outcome: 'BLACKJACK', payout: bet * rules.blackjackPayout, description: 'Blackjack' };
  }

  if (dealerValue.isBlackjack && !playerValue.isBlackjack) {
    return { outcome: 'LOSE', payout: -bet, description: 'Dealer blackjack' };
  }

  if (playerValue.best > dealerValue.best) return { outcome: 'WIN', payout: bet, description: 'Higher total' };
  if (playerValue.best < dealerValue.best) return { outcome: 'LOSE', payout: -bet, description: 'Lower total' };
  return { outcome: 'PUSH', payout: 0, description: 'Push' };
}
