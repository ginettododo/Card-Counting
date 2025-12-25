'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { recordSession } from '@/lib/persistence';
import { useDrillStore } from '@/state/drillStore';
import { useSettingsStore } from '@/state/settingsStore';
import { useTelemetryStore } from '@/state/telemetryStore';
import { AboutCounting } from '@/components/content/about-counting';

const CountDrillPanel = dynamic(() => import('@/components/controls/CountDrillPanel').then((m) => m.CountDrillPanel), {
  ssr: false,
  loading: () => <DrillSkeleton title="Count Drill" />,
});

const DecisionDrillPanel = dynamic(() => import('@/components/controls/DecisionDrillPanel').then((m) => m.DecisionDrillPanel), {
  ssr: false,
  loading: () => <DrillSkeleton title="Decision Drill" />,
});

function DrillSkeleton({ title }: { title: string }) {
  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <div className="h-4 w-28 rounded bg-surface" aria-hidden />
      <p className="text-xs text-muted">Caricamento {title}...</p>
      <div className="flex gap-2">
        <div className="h-16 w-12 rounded bg-surface" />
        <div className="h-16 w-12 rounded bg-surface" />
      </div>
    </div>
  );
}

export default function DrillsPage() {
  const { start, metrics, syncConfig } = useDrillStore();
  const { rules, countingSystem } = useSettingsStore();
  const { logEvent } = useTelemetryStore();

  useEffect(() => {
    syncConfig(rules, countingSystem);
  }, [rules, countingSystem, syncConfig]);

  useEffect(() => {
    if (!metrics.startedAt) {
      start('mixed');
      logEvent('drill.session.start', { mode: 'mixed', ruleset: rules.decks, countingSystem });
    }
  }, [metrics.startedAt, start, logEvent, rules.decks, countingSystem]);

  const handleSave = async () => {
    if (metrics.startedAt) {
      await recordSession({
        mode: metrics.mode,
        score: metrics.score,
        durationMs: Date.now() - metrics.startedAt,
        timestamp: Date.now(),
      });
      logEvent('drill.session.save', { mode: metrics.mode, score: metrics.score, attempts: metrics.attempts });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Drill combinati</h1>
        <p className="text-sm text-muted">
          Alterna conteggio e decisioni con feedback immediato e punteggi tracciati per sessione. Funziona anche offline grazie
          alla cache PWA dei drill.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-muted">
          <span>Regole: {rules.decks}D {rules.dealerHitsSoft17 ? 'H17' : 'S17'}</span>
          <span>• Sistema: {countingSystem}</span>
        </div>
        <Button className="mt-3" variant="outline" onClick={handleSave}>
          Salva sessione
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <CountDrillPanel />
        <DecisionDrillPanel />
      </div>
      <AboutCounting />
    </div>
  );
}
