'use client';
import React from 'react';
import { Card } from '@/engine/cards';
import { handValue } from '@/engine/hand';
import { CardView } from './CardView';

export function HandView({ cards, label }: { cards: Card[]; label: string }) {
  const value = handValue(cards);
  return (
    <div className="space-y-2 rounded-xl border border-border bg-card/40 p-3">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-muted">
        <span>{label}</span>
        <span>
          {value.best} {value.isSoft ? '(soft)' : ''} {value.isBlackjack ? 'BJ' : ''}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {cards.map((card) => (
          <CardView key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
