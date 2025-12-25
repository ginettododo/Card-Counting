'use client';
import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { recommendAction } from '@/features/strategy/basic-strategy';
import { useBlackjackStore } from '@/store/blackjack-store';

const dealerOptions = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];
const sampleHands = [
  ['10', '6'],
  ['A', '7'],
  ['9', '9'],
  ['5', '5'],
  ['8', '2'],
];

export default function BasicStrategyPage() {
  const [playerHand, setPlayerHand] = useState<string[]>(sampleHands[0]);
  const [dealerCard, setDealerCard] = useState<string>('6');
  const { rules } = useBlackjackStore();
  const recommendation = useMemo(() => recommendAction(playerHand, dealerCard, rules), [playerHand, dealerCard, rules]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Basic Strategy Drill</h1>
          <p className="text-muted">Simula spot e ricevi l&apos;azione suggerita con spiegazione rapida.</p>
        </div>
        <Badge variant="outline">Regole: {rules.dealerHitsSoft17 ? 'H17' : 'S17'} / DAS {rules.doubleAfterSplit ? 'on' : 'off'}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Decision Drill</CardTitle>
          <CardDescription>Seleziona mano e upcard per vedere l&apos;azione ottimale.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted">Mano giocatore</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {sampleHands.map((hand, idx) => (
                  <Button key={idx} variant={playerHand === hand ? 'default' : 'outline'} onClick={() => setPlayerHand(hand)}>
                    {hand.join(' / ')}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted">Carta dealer</p>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {dealerOptions.map((card) => (
                  <Button key={card} variant={dealerCard === card ? 'default' : 'outline'} onClick={() => setDealerCard(card)}>
                    {card}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center gap-2 rounded-xl border border-border bg-surface p-4 text-center">
              <p className="text-sm text-muted">Azione consigliata</p>
              <p className="text-3xl font-semibold capitalize">{recommendation.action}</p>
              <p className="text-sm text-muted">{recommendation.rationale}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
