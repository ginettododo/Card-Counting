import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Offline | Blackjack Trainer Pro',
  description: 'Sei offline: consulta i drill salvati e torna online per sincronizzare.',
};

export const dynamic = 'force-static';

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-12">
      <h1 className="text-3xl font-semibold">Sei offline</h1>
      <p className="text-muted">
        Puoi continuare a usare i drill già caricati e rivedere le ultime mani. Quando la connessione tornerà attiva, la web app
        si aggiornerà automaticamente.
      </p>
      <div className="space-y-2 rounded-xl border border-border bg-card p-4">
        <h2 className="text-lg font-semibold">Suggerimenti</h2>
        <ul className="list-inside list-disc text-sm text-muted">
          <li>Le pagine /drills e gli asset essenziali sono memorizzati per l&apos;uso offline.</li>
          <li>Le sessioni non vengono inviate: esporta manualmente i log da Impostazioni.</li>
          <li>Al ritorno online puoi rilanciare i drill per aggiornare le carte.</li>
        </ul>
      </div>
      <Button asChild>
        <Link href="/drills">Torna ai drill</Link>
      </Button>
    </div>
  );
}
