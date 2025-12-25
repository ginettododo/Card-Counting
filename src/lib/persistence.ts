import Dexie, { Table } from 'dexie';
import { Rules } from '@/engine/rules';

export interface StoredSettings {
  id: string;
  rules: Rules;
  countingSystem: 'Hi-Lo' | 'KO';
  allowHints: boolean;
}

export interface SessionStat {
  id?: number;
  mode: 'count' | 'decision' | 'mixed';
  score: number;
  durationMs: number;
  timestamp: number;
}

class TrainerDb extends Dexie {
  settings!: Table<StoredSettings, string>;
  stats!: Table<SessionStat, number>;

  constructor() {
    super('trainer-db');
    this.version(1).stores({
      settings: '&id',
      stats: '++id, mode, timestamp',
    });
  }
}

const db = new TrainerDb();

export async function loadSettings(): Promise<StoredSettings | undefined> {
  return db.settings.get('default');
}

export async function saveSettings(settings: StoredSettings) {
  await db.settings.put(settings);
}

export async function recordSession(stat: SessionStat) {
  await db.stats.add(stat);
}

export async function listSessions(limit = 20): Promise<SessionStat[]> {
  return db.stats.orderBy('timestamp').reverse().limit(limit).toArray();
}

export async function exportData(): Promise<string> {
  const [settings, stats] = await Promise.all([db.settings.toArray(), db.stats.toArray()]);
  return JSON.stringify({ settings, stats });
}

export async function importData(json: string) {
  const parsed = JSON.parse(json);
  if (parsed.settings) {
    await db.settings.clear();
    await db.settings.bulkAdd(parsed.settings);
  }
  if (parsed.stats) {
    await db.stats.clear();
    await db.stats.bulkAdd(parsed.stats);
  }
}
