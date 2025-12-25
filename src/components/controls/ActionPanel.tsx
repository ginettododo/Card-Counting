'use client';
import { Action } from '@/engine/game';
import { useGameStore, isActionAllowed } from '@/state/gameStore';
import { Button } from '@/components/ui/button';

const actions: { action: Action; label: string }[] = [
  { action: 'HIT', label: 'Hit' },
  { action: 'STAND', label: 'Stand' },
  { action: 'DOUBLE', label: 'Double' },
  { action: 'SPLIT', label: 'Split' },
  { action: 'SURRENDER', label: 'Surrender' },
];

export function ActionPanel() {
  const { act, round, rules } = useGameStore();
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((item) => (
        <Button
          key={item.action}
          onClick={() => act(item.action)}
          disabled={!isActionAllowed(item.action, round, rules)}
          variant={item.action === 'HIT' ? 'default' : 'outline'}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
