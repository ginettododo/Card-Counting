import { describe, expect, it } from 'vitest';
import { createHiLo } from '@/counting';
import { Card } from '@/engine/cards';

const card = (rank: Card['rank'], id: string): Card => ({ rank, suit: 'S', id });

describe('counting visibility', () => {
  it('ignores dealer hole card until reveal', () => {
    const system = createHiLo();
    const player = [card('5', 'p1'), card('K', 'p2')];
    const dealerUp = card('9', 'd1');
    const dealerHole = card('A', 'd2');

    // visible cards
    player.forEach((c) => system.observe(c));
    system.observe(dealerUp);
    const rcBeforeReveal = system.getRC();

    system.observe(dealerHole);
    const rcAfterReveal = system.getRC();

    expect(rcBeforeReveal).toBe(0); // +1 -1 0 +0
    expect(rcAfterReveal).toBe(-1);
  });
});
