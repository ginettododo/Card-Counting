'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { HandView } from '@/components/table/HandView';
import { ActionPanel } from '@/components/controls/ActionPanel';
import { useGameStore } from '@/state/gameStore';
import { CountingOverlay } from '@/components/table/CountingOverlay';

export default function TablePage() {
  const { round, startRound, revealDealer, rules } = useGameStore();

  useEffect(() => {
    if (round.phase === 'DEALER_TURN') {
      revealDealer();
    }
  }, [round.phase, revealDealer]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Tavolo Blackjack</h1>
          <p className="text-sm text-muted">Regole: {rules.dealerHitsSoft17 ? 'H17' : 'S17'} · {rules.decks} mazzi · DAS {rules.das ? 'on' : 'off'}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => startRound()}>Nuova mano</Button>
          {round.phase === 'DEALER_TURN' && (
            <Button variant="outline" onClick={() => revealDealer()}>
              Rivela dealer
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <HandView cards={round.dealer} label="Dealer" />
          {round.playerHands.map((hand, idx) => (
            <HandView key={idx} cards={hand.cards} label={`Player ${idx + 1}${idx === round.activeHand ? ' (attivo)' : ''}`} />
          ))}
          <ActionPanel />
        </div>
        <div className="space-y-3">
          <CountingOverlay />
          <div className="rounded-xl border border-border bg-card/50 p-4 text-sm text-muted">
            <p className="font-semibold text-text">Suggerimenti rapidi</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Il conteggio considera solo carte visibili secondo le regole di blackjack.</li>
              <li>Modalità CSM reinserisce la carta estratta direttamente nella scarpa.</li>
              <li>Late surrender attiva, usa se disponibile vs 15/16 contro 10/A.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
