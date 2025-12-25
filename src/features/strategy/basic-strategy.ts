import { BasicStrategyRecommendation, RuleSet } from '@/types/training';

type HandType = 'hard' | 'soft' | 'pair';

function determineHandType(player: string[]): HandType {
  if (player.length === 2 && player[0] === player[1]) return 'pair';
  if (player.includes('A') && player.reduce((acc, card) => acc + (card === 'A' ? 11 : ['K', 'Q', 'J', '10'].includes(card) ? 10 : Number(card)), 0) <= 21) {
    return 'soft';
  }
  return 'hard';
}

export function recommendAction(player: string[], dealerUp: string, rules: RuleSet): BasicStrategyRecommendation {
  const total = calculateTotal(player);
  const type = determineHandType(player);

  if (type === 'pair') {
    if (player[0] === 'A' || player[0] === '8') return { action: 'split', rationale: 'Dividi assi e 8 per massimizzare EV' };
    if (player[0] === '9' && !['7', '10', 'A'].includes(dealerUp)) return { action: 'split', rationale: '9 contro carte medie è favorevole' };
    if (player[0] === '7' && ['2', '3', '4', '5', '6', '7'].includes(dealerUp)) return { action: 'split', rationale: 'Dividi 7 contro upcard debole' };
  }

  if (type === 'soft') {
    if (total >= 19) return { action: 'stand', rationale: 'Soft 19+ è già forte' };
    if (total === 18) {
      if (['2', '7', '8'].includes(dealerUp)) return { action: 'stand', rationale: 'Soft 18 è pari contro dealer medio' };
      if (['3', '4', '5', '6'].includes(dealerUp) && rules.doubleAfterSplit) return { action: 'double', rationale: 'Soft 18 vs 3-6 si raddoppia' };
      return { action: 'hit', rationale: 'Soft 18 vs carta forte, prendi carta' };
    }
    if (total === 17 && ['3', '4', '5', '6'].includes(dealerUp)) return { action: 'double', rationale: 'Soft 17 raddoppia contro 3-6' };
    if (total === 16 && ['4', '5', '6'].includes(dealerUp)) return { action: 'double', rationale: 'Soft 16 aggressivo vs 4-6' };
    if (total === 15 && ['4', '5', '6'].includes(dealerUp)) return { action: 'double', rationale: 'Soft 15 raddoppia vs 4-6' };
    if (total === 13 || total === 14) return { action: ['5', '6'].includes(dealerUp) ? 'double' : 'hit', rationale: 'Soft 13-14 raddoppia vs 5-6 altrimenti hit' };
  }

  if (rules.lateSurrender && total === 16 && ['9', '10', 'A'].includes(dealerUp)) {
    return { action: 'surrender', rationale: '16 vs 9/10/A meglio arrendersi tardi' };
  }

  if (total >= 17) return { action: 'stand', rationale: '17+ è forte' };
  if (total >= 13 && dealerUp <= '6') return { action: 'stand', rationale: '13-16 contro carta debole si sta' };
  if (total === 12 && ['4', '5', '6'].includes(dealerUp)) return { action: 'stand', rationale: '12 vs 4-6 si sta' };
  if (total === 11) return { action: 'double', rationale: '11 sempre aggressivo' };
  if (total === 10 && dealerUp <= '9') return { action: 'double', rationale: '10 vs 9- raddoppia' };
  if (total === 9 && ['3', '4', '5', '6'].includes(dealerUp)) return { action: 'double', rationale: '9 vs 3-6 raddoppia' };

  return { action: 'hit', rationale: 'Prendi carta per migliorare la mano' };
}

function calculateTotal(hand: string[]): number {
  return hand.reduce((total, card) => {
    if (card === 'A') return total + 11;
    if (['K', 'Q', 'J', '10'].includes(card)) return total + 10;
    return total + Number(card);
  }, 0);
}
