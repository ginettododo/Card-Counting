import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, Gamepad2, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: <Gamepad2 className="h-6 w-6 text-accent" aria-hidden />,
      title: 'Blackjack Engine',
      description:
        'Allenati con scarpe multi-mazzo, regole configurabili e tutte le azioni: hit, stand, double, split, surrender.',
      href: '/play/blackjack',
      action: 'Vai al tavolo',
    },
    {
      icon: <Brain className="h-6 w-6 text-accent" aria-hidden />,
      title: 'Counting Trainer',
      description:
        'Sistemi Hi-Lo, KO e avanzati con overlay di conteggio, RC/TC e modalità indovinare conteggio nascosto.',
      href: '/train/counting',
      action: 'Esercitati ora',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-accent" aria-hidden />,
      title: 'Basic Strategy',
      description: 'Drill decisionale con regole S17/H17, DAS e surrender per spot realistici.',
      href: '/train/basic-strategy',
      action: 'Apri i drill',
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-accent" aria-hidden />,
      title: 'Progress & Profili',
      description: 'Statistiche, accuracy e cronologia sessioni salvate localmente.',
      href: '/profile',
      action: 'Vedi progressi',
    },
  ];

  return (
    <div className="space-y-10">
      <header className="rounded-2xl bg-gradient-to-br from-surface to-card p-8 shadow-glow">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-muted">Blackjack Trainer Pro</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Allena conteggio, strategia e riflessi</h1>
            <p className="max-w-2xl text-muted">
              Tavolo realistico, overlay di conteggio e drill di strategia in un&apos;unica web app. Design premium, PWA
              offline e statistiche locali.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/play/blackjack">Apri il tavolo</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/train/counting">Modalità conteggio</Link>
              </Button>
            </div>
          </div>
          <div className="w-full rounded-xl border border-border bg-card p-5 md:w-80">
            <p className="text-sm text-muted">Percorso consigliato</p>
            <ol className="mt-4 space-y-3 text-sm text-muted">
              <li><strong className="text-text">1.</strong> Imposta regole tavolo</li>
              <li><strong className="text-text">2.</strong> Esegui drill conteggio (RC/TC)</li>
              <li><strong className="text-text">3.</strong> Fai decision drill basic strategy</li>
              <li><strong className="text-text">4.</strong> Rivedi streak e errori caldi</li>
            </ol>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {features.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface">{item.icon}</div>
                <div>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
              </div>
              <Button asChild size="sm" variant="ghost">
                <Link href={item.href}>{item.action}</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted">
                Flow guidato con feedback immediato, timer opzionale e overlay di conteggio per migliorare sia memoria
                che tempo di reazione.
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
