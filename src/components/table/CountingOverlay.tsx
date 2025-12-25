'use client';
import { useGameStore } from '@/state/gameStore';

export function CountingOverlay() {
  const { counting, decksRemaining } = useGameStore();
  const rc = counting.getRC();
  const tc = counting.getTC(decksRemaining());
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-muted">Running Count</span>
        <span className="font-semibold">{rc}</span>
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-muted">True Count</span>
        <span className="font-semibold">{tc}</span>
      </div>
    </div>
  );
}
