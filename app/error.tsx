'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('App error boundary captured:', error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 py-16 px-4 text-center">
      <h1 className="text-3xl font-semibold">Qualcosa è andato storto</h1>
      <p className="text-muted">Un errore imprevisto è stato intercettato. Puoi riprovare o tornare alla dashboard.</p>
      <div className="flex justify-center gap-3">
        <Button onClick={() => reset()}>Riprova</Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">Torna alla dashboard</Link>
        </Button>
      </div>
      {error?.digest && <p className="text-xs text-muted">Codice: {error.digest}</p>}
    </div>
  );
}
