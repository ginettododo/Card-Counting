'use client';
import React, { useEffect } from 'react';
import { CountDrillPanel } from '@/components/controls/CountDrillPanel';
import { DecisionDrillPanel } from '@/components/controls/DecisionDrillPanel';
import { useDrillStore } from '@/state/drillStore';
import { Button } from '@/components/ui/button';
import { recordSession } from '@/lib/persistence';

export default function DrillsPage() {
  const { start, metrics } = useDrillStore();

  useEffect(() => {
    if (!metrics.startedAt) {
      start('mixed');
    }
  }, [metrics.startedAt, start]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Drill combinati</h1>
        <p className="text-sm text-muted">
          Alterna conteggio e decisioni con feedback immediato e punteggi tracciati per sessione.
        </p>
        <Button
          className="mt-3"
          variant="outline"
          onClick={async () => {
            if (metrics.startedAt) {
              await recordSession({
                mode: metrics.mode,
                score: metrics.score,
                durationMs: Date.now() - metrics.startedAt,
                timestamp: Date.now(),
              });
            }
          }}
        >
          Salva sessione
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CountDrillPanel />
        <DecisionDrillPanel />
      </div>
    </div>
  );
}
