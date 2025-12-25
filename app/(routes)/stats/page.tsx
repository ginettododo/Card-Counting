'use client';
import { useEffect, useState } from 'react';
import { listSessions, SessionStat } from '@/lib/persistence';

export default function StatsPage() {
  const [stats, setStats] = useState<SessionStat[]>([]);

  useEffect(() => {
    listSessions().then(setStats);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Statistiche</h1>
        <p className="text-sm text-muted">Punteggi recenti per drill conteggio, decisioni e mix.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="px-4 py-2 text-left">Modalità</th>
              <th className="px-4 py-2 text-left">Score</th>
              <th className="px-4 py-2 text-left">Durata (s)</th>
              <th className="px-4 py-2 text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row) => (
              <tr key={row.id} className="border-t border-border/40">
                <td className="px-4 py-2">{row.mode}</td>
                <td className="px-4 py-2">{row.score}</td>
                <td className="px-4 py-2">{Math.round(row.durationMs / 1000)}</td>
                <td className="px-4 py-2">{new Date(row.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
