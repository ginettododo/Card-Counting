import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-gradient-to-br from-surface to-card p-8 shadow-glow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Contesto</p>
            <h1 className="text-3xl font-semibold">Allena conteggio e decisioni con regole realistiche</h1>
            <p className="text-muted max-w-3xl">
              Dashboard riassuntiva con stato del tavolo, drill e statistiche locali. Ogni modulo è pronto per sessioni
              rapide con regole multi-mazzo, DAS e surrender.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/table">Apri tavolo</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/drills">Vai ai drill</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Conteggio</CardTitle>
            <CardDescription>Hi-Lo, KO, Omega II, Hi-Opt I e Zen con RC/TC in tempo reale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted">
            <p>Visibilità conforme: carte giocatore e upcard immediatamente, hole card solo su reveal.</p>
            <p>CSM opzionale con reinserimento istantaneo.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Strategia base</CardTitle>
            <CardDescription>Tabelle multi-mazzo S17/H17, DAS e surrender.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted">
            <p>Fallback automatici quando double/split non ammessi dalle regole correnti.</p>
            <p>Consigli istantanei nei drill decisionali.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Persistenza</CardTitle>
            <CardDescription>Settings, profilo e stats in IndexedDB.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted">
            <p>Esporta/importa JSON con un click dalla pagina impostazioni.</p>
            <p>Sessioni drill salvate con punteggio e durata.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
