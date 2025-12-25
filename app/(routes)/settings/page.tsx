'use client';
import { useState } from 'react';
import { useSettingsStore } from '@/state/settingsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { exportData, importData } from '@/lib/persistence';

export default function SettingsPage() {
  const { rules, countingSystem, allowHints, update } = useSettingsStore();
  const [importPayload, setImportPayload] = useState('');

  const handleExport = async () => {
    const payload = await exportData();
    setImportPayload(payload);
  };

  const handleImport = async () => {
    await importData(importPayload);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Impostazioni</h1>
        <p className="text-sm text-muted">Configura regole tavolo, sistema di conteggio e backup dati.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-border p-4">
          <h2 className="text-lg font-semibold">Regole</h2>
          <label className="block text-xs font-medium text-muted">Mazzi</label>
          <Input type="number" value={rules.decks} min={1} max={8} onChange={(e) => update({ rules: { ...rules, decks: Number(e.target.value) } })} />
          <label className="block text-xs font-medium text-muted">Penetrazione</label>
          <Input type="number" step="0.05" min={0.4} max={0.95} value={rules.penetration} onChange={(e) => update({ rules: { ...rules, penetration: Number(e.target.value) } })} />
          <label className="block text-xs font-medium text-muted">Dealer su soft 17</label>
          <Select value={rules.dealerHitsSoft17 ? 'H17' : 'S17'} onChange={(e) => update({ rules: { ...rules, dealerHitsSoft17: e.target.value === 'H17' } })}>
            <option value="S17">Stand (S17)</option>
            <option value="H17">Hit (H17)</option>
          </Select>
          <div className="flex flex-wrap gap-2 text-sm text-muted">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rules.das} onChange={(e) => update({ rules: { ...rules, das: e.target.checked } })} />
              DAS
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rules.lateSurrender} onChange={(e) => update({ rules: { ...rules, lateSurrender: e.target.checked } })} />
              Late surrender
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rules.csm} onChange={(e) => update({ rules: { ...rules, csm: e.target.checked } })} />
              CSM
            </label>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-border p-4">
          <h2 className="text-lg font-semibold">Sistema</h2>
          <label className="block text-xs font-medium text-muted">Counting system</label>
          <Select value={countingSystem} onChange={(e) => update({ countingSystem: e.target.value as 'Hi-Lo' | 'KO' })}>
            <option value="Hi-Lo">Hi-Lo</option>
            <option value="KO">KO</option>
          </Select>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={allowHints} onChange={(e) => update({ allowHints: e.target.checked })} />
            Mostra suggerimenti
          </label>
          <div className="space-y-2">
            <Button onClick={handleExport}>Export JSON</Button>
            <textarea
              className="w-full rounded-md border border-border bg-card p-2 text-sm"
              rows={4}
              value={importPayload}
              onChange={(e) => setImportPayload(e.target.value)}
              aria-label="Payload JSON"
            />
            <Button variant="outline" onClick={handleImport}>
              Importa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
