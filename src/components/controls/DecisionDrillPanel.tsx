'use client';
import React, { useEffect, useState } from 'react';
import { useDrillStore } from '@/state/drillStore';
import { Button } from '@/components/ui/button';
import { CardView } from '@/components/table/CardView';

const actions = ['HIT', 'STAND', 'DOUBLE', 'SPLIT', 'SURRENDER'];

export function DecisionDrillPanel() {
  const { metrics, newDecisionSpot, submitDecision } = useDrillStore();
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (!metrics.decisionDrill) {
      newDecisionSpot();
    }
  }, [metrics.decisionDrill, newDecisionSpot]);

  const handleSelect = (action: string) => {
    const correct = submitDecision(action);
    setFeedback(correct ? 'Corretto' : `Errato: ${metrics.decisionDrill?.correctAction}`);
    newDecisionSpot();
  };

  const drill = metrics.decisionDrill;
  if (!drill) return null;

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Decision Drill</p>
          <p className="text-xs text-muted">Scegli l’azione ottimale.</p>
        </div>
        <Button size="sm" onClick={() => newDecisionSpot()}>
          Nuovo spot
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <div>
          <p className="text-xs text-muted">Player</p>
          <div className="flex gap-2">
            {drill.player.map((c) => (
              <CardView key={c.id} card={c} />
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted">Dealer</p>
          <CardView card={drill.dealer} />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <Button key={action} variant="outline" onClick={() => handleSelect(action)}>
            {action}
          </Button>
        ))}
      </div>
      <p className="text-xs text-muted">Score: {metrics.score} / {metrics.attempts}</p>
      {feedback && <p className="text-xs font-semibold text-accent">{feedback}</p>}
    </div>
  );
}
