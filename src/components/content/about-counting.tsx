import React from 'react';

export function AboutCounting() {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-muted">About counting</p>
          <h2 className="text-xl font-semibold">Mini guida pratica</h2>
        </div>
        <span className="rounded-full bg-surface px-3 py-1 text-xs text-muted">Offline ready</span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="space-y-2 text-sm text-muted">
          <h3 className="text-base font-semibold text-text">1. Running count</h3>
          <p>
            Applica il valore del sistema scelto ad ogni carta vista. Restare disciplinati è più importante di cercare la
            perfezione millimetrica: ogni errore va riconosciuto e corretto al prossimo pack.
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted">
          <h3 className="text-base font-semibold text-text">2. True count e puntata</h3>
          <p>
            Trasforma il running count in true count dividendo per i mazzi rimanenti. Usa il TC per ridurre le puntate sotto 0 e
            incrementarle sopra +2, tenendo sempre un buffer per la varianza.
          </p>
        </div>
        <div className="space-y-2 text-sm text-muted">
          <h3 className="text-base font-semibold text-text">3. Deviation & ritmo</h3>
          <p>
            Le deviazioni (es. 16 vs T o insurance) hanno soglie note: TC +3/+4 per i grandi swing. Esegui le decisioni con un
            ritmo costante: il timing coerente evita di dare tells al tavolo.
          </p>
        </div>
      </div>
    </section>
  );
}
