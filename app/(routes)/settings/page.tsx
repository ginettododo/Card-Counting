'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSettingsStore } from '@/state/settingsStore';
import { useTelemetryStore } from '@/state/telemetryStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { TelemetryPanel } from '@/components/telemetry/TelemetryPanel';
import { exportData, importData } from '@/lib/persistence';
import { Rules } from '@/engine/rules';
import { CountingSystemId } from '@/types/training';

const COUNTING_OPTIONS: { id: CountingSystemId; label: string; hint: string }[] = [
  { id: 'hi-lo', label: 'Hi-Lo (bilanciato)', hint: 'Facile da memorizzare, RC e TC stabili.' },
  { id: 'ko', label: 'KO (sbilanciato)', hint: 'Running count non torna a zero, utile per CSM.' },
  { id: 'omega-ii', label: 'Omega II', hint: 'Più pesi per le carte medie, ottimo per TC precisi.' },
  { id: 'hi-opt-i', label: 'Hi-Opt I', hint: 'Ace neutro, ideale con side count.' },
  { id: 'zen', label: 'Zen Count', hint: 'Mix bilanciato con asso negativo per TC aggressivo.' },
];

const RULE_PRESETS: { id: string; name: string; description: string; rules: Rules }[] = [
  {
    id: 'vegas-6d-s17',
    name: 'Vegas 6D S17',
    description: '6 mazzi, S17, DAS, late surrender. Setup classico per shoe.',
    rules: {
      decks: 6,
      penetration: 0.75,
      dealerHitsSoft17: false,
      blackjackPayout: 1.5,
      das: true,
      rsa: true,
      lateSurrender: true,
      peek: true,
      allowDoubleAny: true,
      allowDoubleOn: [9, 10, 11],
      maxSplits: 3,
      insurance: true,
      csm: false,
    },
  },
  {
    id: 'ac-8d-h17',
    name: 'Atlantic City 8D H17',
    description: '8 mazzi, H17, late surrender opzionale, CSM disattivato.',
    rules: {
      decks: 8,
      penetration: 0.8,
      dealerHitsSoft17: true,
      blackjackPayout: 1.5,
      das: true,
      rsa: true,
      lateSurrender: true,
      peek: true,
      allowDoubleAny: true,
      allowDoubleOn: [9, 10, 11],
      maxSplits: 4,
      insurance: true,
      csm: false,
    },
  },
  {
    id: 'single-deck',
    name: 'Single Deck H17',
    description: '1 mazzo, penetrazione alta, payout 3:2, niente CSM.',
    rules: {
      decks: 1,
      penetration: 0.6,
      dealerHitsSoft17: true,
      blackjackPayout: 1.5,
      das: false,
      rsa: false,
      lateSurrender: false,
      peek: true,
      allowDoubleAny: false,
      allowDoubleOn: [10, 11],
      maxSplits: 2,
      insurance: true,
      csm: false,
    },
  },
];

export default function SettingsPage() {
  const { rules, countingSystem, allowHints, update, hydrate } = useSettingsStore();
  const { logEvent } = useTelemetryStore();
  const [importPayload, setImportPayload] = useState('');
  const [doubleOnText, setDoubleOnText] = useState(rules.allowDoubleOn.join(', '));

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    setDoubleOnText(rules.allowDoubleOn.join(', '));
  }, [rules.allowDoubleOn]);

  const handleExport = async () => {
    const payload = await exportData();
    setImportPayload(payload);
  };

  const handleImport = async () => {
    await importData(importPayload);
    logEvent('settings.update', { source: 'import' });
  };

  const applyPreset = (presetId: string) => {
    const preset = RULE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    update({ rules: preset.rules });
    logEvent('settings.update', { preset: preset.id });
  };

  const parsedDoubleOn = useMemo(() => {
    return doubleOnText
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((v) => !Number.isNaN(v) && v > 0 && v <= 20);
  }, [doubleOnText]);

  const handleRulesChange = (nextRules: Partial<Rules>) => {
    update({ rules: { ...rules, ...nextRules } });
    logEvent('settings.update', { field: 'rules', changes: nextRules });
  };

  const handleCountingChange = (value: CountingSystemId) => {
    update({ countingSystem: value });
    logEvent('settings.update', { field: 'countingSystem', value });
  };

  const handleAllowHintsChange = (value: boolean) => {
    update({ allowHints: value });
    logEvent('settings.update', { field: 'allowHints', value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Impostazioni</h1>
        <p className="text-sm text-muted">Configura regole tavolo, sistema di conteggio, hint e backup dati.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-3 rounded-xl border border-border p-4">
          <h2 className="text-lg font-semibold">Preset regole</h2>
          <p className="text-sm text-muted">Applica rapidamente setup realistici per simulare tavoli comuni.</p>
          <div className="space-y-3">
            {RULE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-left hover:border-accent"
              >
                <p className="text-sm font-semibold">{preset.name}</p>
                <p className="text-xs text-muted">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4 rounded-xl border border-border p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Regole tavolo</h3>
              <label className="block text-xs font-medium text-muted">Mazzi</label>
              <Input
                type="number"
                value={rules.decks}
                min={1}
                max={8}
                onChange={(e) => handleRulesChange({ decks: Number(e.target.value) })}
              />
              <label className="block text-xs font-medium text-muted">Penetrazione</label>
              <Input
                type="number"
                step="0.05"
                min={0.4}
                max={0.95}
                value={rules.penetration}
                onChange={(e) => handleRulesChange({ penetration: Number(e.target.value) })}
              />
              <label className="block text-xs font-medium text-muted">Dealer su soft 17</label>
              <Select
                value={rules.dealerHitsSoft17 ? 'H17' : 'S17'}
                onChange={(e) => handleRulesChange({ dealerHitsSoft17: e.target.value === 'H17' })}
              >
                <option value="S17">Stand (S17)</option>
                <option value="H17">Hit (H17)</option>
              </Select>
              <label className="block text-xs font-medium text-muted">Payout Blackjack</label>
              <Select
                value={rules.blackjackPayout.toString()}
                onChange={(e) => handleRulesChange({ blackjackPayout: Number(e.target.value) })}
              >
                <option value={1.5}>3:2</option>
                <option value={1.2}>6:5</option>
              </Select>
              <label className="block text-xs font-medium text-muted">Max splits</label>
              <Input
                type="number"
                value={rules.maxSplits}
                min={1}
                max={4}
                onChange={(e) => handleRulesChange({ maxSplits: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-semibold">Opzioni avanzate</h3>
              <div className="flex flex-wrap gap-3 text-sm text-muted">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rules.das}
                    onChange={(e) => handleRulesChange({ das: e.target.checked })}
                  />
                  DAS
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rules.rsa}
                    onChange={(e) => handleRulesChange({ rsa: e.target.checked })}
                  />
                  Resplit Aces
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rules.lateSurrender}
                    onChange={(e) => handleRulesChange({ lateSurrender: e.target.checked })}
                  />
                  Late surrender
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rules.peek}
                    onChange={(e) => handleRulesChange({ peek: e.target.checked })}
                  />
                  Peek blackjack
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rules.insurance}
                    onChange={(e) => handleRulesChange({ insurance: e.target.checked })}
                  />
                  Insurance
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rules.csm}
                    onChange={(e) => handleRulesChange({ csm: e.target.checked })}
                  />
                  CSM
                </label>
              </div>
              <label className="block text-xs font-medium text-muted">Double</label>
              <div className="flex flex-wrap gap-2 text-sm text-muted">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rules.allowDoubleAny}
                    onChange={(e) => handleRulesChange({ allowDoubleAny: e.target.checked })}
                  />
                  Su qualsiasi mano
                </label>
                <Input
                  aria-label="Valori double consentiti"
                  value={doubleOnText}
                  onChange={(e) => setDoubleOnText(e.target.value)}
                  onBlur={() => handleRulesChange({ allowDoubleOn: parsedDoubleOn })}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="text-base font-semibold">Sistema di conteggio</h3>
              <Select value={countingSystem} onChange={(e) => handleCountingChange(e.target.value as CountingSystemId)}>
                {COUNTING_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted">
                {COUNTING_OPTIONS.find((opt) => opt.id === countingSystem)?.hint}
              </p>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={allowHints}
                  onChange={(e) => handleAllowHintsChange(e.target.checked)}
                />
                Mostra suggerimenti nei drill
              </label>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-semibold">Backup locale</h3>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleExport}>Export JSON</Button>
                <Button variant="outline" onClick={handleImport}>
                  Importa
                </Button>
              </div>
              <textarea
                className="w-full rounded-md border border-border bg-card p-2 text-sm"
                rows={6}
                value={importPayload}
                onChange={(e) => setImportPayload(e.target.value)}
                aria-label="Payload JSON"
              />
            </div>
          </div>
        </div>
      </div>

      <TelemetryPanel />
    </div>
  );
}
