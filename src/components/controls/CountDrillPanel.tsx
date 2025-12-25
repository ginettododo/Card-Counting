'use client';
import React, { useState } from 'react';
import { useDrillStore } from '@/state/drillStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CardView } from '@/components/table/CardView';

export function CountDrillPanel() {
  const { metrics, start, nextCountCard, submitCount } = useDrillStore();
  const [guess, setGuess] = useState('0');

  const handleNext = () => {
    nextCountCard();
  };

  const handleSubmit = () => {
    const correct = submitCount(Number(guess));
    setGuess('0');
    return correct;
  };

  return (
    <div className="space-y-3 rounded-xl border border-border p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Count Drill</p>
          <p className="text-xs text-muted">Inserisci il running count ogni 5 carte.</p>
        </div>
        <Button size="sm" onClick={() => start('count')}>
          Restart
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {metrics.countDrill?.visibleCards.map((card) => (
          <CardView key={card.id} card={card} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Input aria-label="Running count" value={guess} onChange={(e) => setGuess(e.target.value)} className="w-24" />
        <Button onClick={handleSubmit}>Submit</Button>
        <Button variant="outline" onClick={handleNext}>
          Next card
        </Button>
      </div>
      <p className="text-xs text-muted">Score: {metrics.score} / {metrics.attempts}</p>
    </div>
  );
}
