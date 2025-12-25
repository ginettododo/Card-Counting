'use client';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useTelemetryStore } from '@/state/telemetryStore';

export function TelemetryPanel() {
  const { events, exportJson, clear } = useTelemetryStore();

  const lastEvents = useMemo(() => events.slice(-8).reverse(), [events]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportJson());
  };

  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Telemetria locale</p>
          <h2 className="text-lg font-semibold">Session logs (in-memory)</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            Copia JSON
          </Button>
          <Button variant="ghost" size="sm" onClick={clear}>
            Pulisci
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted">
        I log restano in memoria locale e non vengono inviati. Copia il JSON per allegarlo a debug o per esportare le sessioni
        correnti.
      </p>
      <div className="space-y-2 text-xs">
        {lastEvents.length === 0 && <p className="text-muted">Nessun evento registrato.</p>}
        {lastEvents.map((event) => (
          <div key={event.id} className="rounded-lg border border-border/60 bg-surface px-3 py-2">
            <p className="font-semibold">{event.type}</p>
            <p className="text-muted">{new Date(event.timestamp).toLocaleString()}</p>
            {event.payload && (
              <pre className="mt-1 overflow-x-auto text-[10px] text-muted">{JSON.stringify(event.payload)}</pre>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
