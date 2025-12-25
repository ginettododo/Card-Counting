'use client';
import { useEffect } from 'react';
import { useBlackjackStore } from '@/store/blackjack-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { trueCount } from '@/features/blackjack/engine';

const deckOptions = [1, 2, 4, 6, 8] as const;

export default function BlackjackPage() {
  const { round, shoe, shoeConfig, start, playerHit, stand, resetShoe, balance } = useBlackjackStore();

  useEffect(() => {
    if (!round) start();
  }, [round, start]);

  const remainingCards = shoe.cards.length;
  const tc = trueCount(shoe.runningCount, remainingCards, shoeConfig.decks);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Tavolo Blackjack</h1>
          <p className="text-muted">Regole configurabili, conteggio in tempo reale, azioni complete.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Badge variant="success">RC {shoe.runningCount}</Badge>
          <Badge variant="success">TC {tc}</Badge>
          <Badge variant="outline">Carte rimaste {remainingCards}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Stato round</CardTitle>
            <CardDescription>Azioni: hit, stand. Double/split placeholder per prossime iterazioni.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetShoe} aria-label="Reset shoe">
              Reshuffle
            </Button>
            <Button onClick={start} aria-label="Nuovo round">
              Nuovo deal
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-surface p-4">
              <p className="text-sm text-muted">Mano giocatore</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {round?.playerHands[0].hand.map((card, idx) => (
                  <span key={`${card}-${idx}`} className="rounded-xl bg-card px-3 py-2 text-lg shadow-glow/30" aria-label={`Carta ${card}`}>
                    {card}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-lg font-semibold">Totale: {round?.playerHands[0].total}</p>
              <div className="mt-4 flex gap-2">
                <Button onClick={playerHit} disabled={round?.playerHands[0].isBusted}>
                  Hit
                </Button>
                <Button variant="outline" onClick={stand}>
                  Stand
                </Button>
              </div>
              {round?.settled && <p className="mt-3 text-sm text-muted">Esito: {round.settled.result} (saldo {balance.toFixed(2)})</p>}
            </div>
            <div className="rounded-xl border border-border/60 bg-surface p-4">
              <p className="text-sm text-muted">Dealer</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {round?.dealer.hand.map((card, idx) => (
                  <span key={`${card}-${idx}`} className="rounded-xl bg-card px-3 py-2 text-lg shadow-glow/30" aria-label={`Carta dealer ${card}`}>
                    {card}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-lg font-semibold">Totale: {round?.dealer.total}</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted">Mazzi</p>
              <Select
                aria-label="Numero mazzi"
                value={String(shoeConfig.decks)}
                onChange={(e) => useBlackjackStore.setState({ shoeConfig: { ...shoeConfig, decks: Number(e.target.value) as any } })}
              >
                {deckOptions.map((deck) => (
                  <option key={deck} value={deck}>
                    {deck} deck
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <p className="text-sm text-muted">Penetrazione</p>
              <input
                aria-label="Penetrazione"
                type="range"
                min={0.5}
                max={0.95}
                step={0.05}
                value={shoeConfig.penetration}
                onChange={(e) =>
                  useBlackjackStore.setState({ shoeConfig: { ...shoeConfig, penetration: Number(e.target.value) } })
                }
                className="w-full"
              />
              <p className="text-xs text-muted">{Math.round(shoeConfig.penetration * 100)}%</p>
            </div>
            <div className="flex items-center gap-2">
              <Toggle
                pressed={shoeConfig.continuousShuffle}
                onClick={() =>
                  useBlackjackStore.setState({
                    shoeConfig: { ...shoeConfig, continuousShuffle: !shoeConfig.continuousShuffle },
                  })
                }
              >
                Continuous shuffle
              </Toggle>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
