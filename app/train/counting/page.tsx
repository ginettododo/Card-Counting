'use client';
import { useEffect } from 'react';
import { useCountingStore } from '@/store/counting-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';

const systems = [
  { value: 'hi-lo', label: 'Hi-Lo (default)' },
  { value: 'ko', label: 'KO (unbalanced)' },
  { value: 'omega-ii', label: 'Omega II' },
  { value: 'hi-opt-i', label: 'Hi-Opt I' },
  { value: 'zen', label: 'Zen' },
] as const;

export default function CountingPage() {
  const { system, runningCount, trueCount, visibleCard, nextCard, setSystem } = useCountingStore();

  useEffect(() => {
    if (!visibleCard) nextCard();
  }, [visibleCard, nextCard]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Counting Trainer</h1>
          <p className="text-muted">Mostra carte scoperte, conteggio RC/TC aggiornato e modalità drill.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted">
          <Badge variant="success">RC {runningCount}</Badge>
          <Badge variant="success">TC {trueCount}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Overlay carta</CardTitle>
            <CardDescription>Visualizza la carta pescata e il delta conteggio.</CardDescription>
          </div>
          <Select aria-label="Sistema di conteggio" value={system} onChange={(e) => setSystem(e.target.value as any)} className="w-full sm:w-auto">
            {systems.map((sys) => (
              <option key={sys.value} value={sys.value}>
                {sys.label}
              </option>
            ))}
          </Select>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-10 text-center">
            <p className="text-sm text-muted">Carta visibile</p>
            <p className="text-6xl font-semibold tracking-tight">{visibleCard}</p>
            <p className="text-sm text-muted">Aggiorna per simulare flusso di gioco realistico.</p>
            <Button size="lg" onClick={nextCard} aria-label="Nuova carta">
              Pesca carta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
