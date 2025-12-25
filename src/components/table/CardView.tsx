'use client';
import React from 'react';
import { Card } from '@/engine/cards';
import { cn } from '@/lib/utils';

function rankLabel(rank: Card['rank']) {
  return rank;
}

export function CardView({ card }: { card: Card }) {
  const isRed = card.suit === 'H' || card.suit === 'D';
  const suitIcon = { S: '♠', H: '♥', D: '♦', C: '♣' }[card.suit];
  return (
    <div
      className={cn(
        'flex h-20 w-14 flex-col justify-between rounded-lg border border-border bg-white px-2 py-2 text-sm shadow-sm',
        isRed ? 'text-red-600' : 'text-black'
      )}
    >
      <span className="font-semibold">{rankLabel(card.rank)}</span>
      <span className="text-center text-lg">{suitIcon}</span>
      <span className="self-end text-xs">{card.id.slice(0, 2)}</span>
    </div>
  );
}
