import { create } from 'zustand';
import { defaultRules, Rules } from '@/engine/rules';
import { loadSettings, saveSettings, StoredSettings } from '@/lib/persistence';
import { CountingSystemId } from '@/types/training';

export interface SettingsStore {
  rules: Rules;
  countingSystem: CountingSystemId;
  allowHints: boolean;
  hydrate: () => Promise<void>;
  update: (settings: Partial<StoredSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  rules: defaultRules,
  countingSystem: 'hi-lo',
  allowHints: true,
  async hydrate() {
    const stored = await loadSettings();
    if (stored) {
      set({ rules: stored.rules, countingSystem: stored.countingSystem, allowHints: stored.allowHints });
    }
  },
  update: (settings) => {
    const next = { rules: { ...get().rules, ...(settings.rules ?? {}) }, countingSystem: settings.countingSystem ?? get().countingSystem, allowHints: settings.allowHints ?? get().allowHints } as StoredSettings;
    set({ rules: next.rules, countingSystem: next.countingSystem, allowHints: next.allowHints });
    saveSettings({ ...next, id: 'default' });
  },
}));
