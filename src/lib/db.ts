import Dexie, { type Table } from 'dexie';
import { SessionStats, TrainerProfile } from '@/types/training';

export class TrainingDB extends Dexie {
  profiles!: Table<TrainerProfile>;
  sessions!: Table<SessionStats>;

  constructor() {
    super('blackjack-trainer-pro');
    this.version(1).stores({
      profiles: 'id, name, difficulty, createdAt',
      sessions: 'id, profileId, mode, startedAt',
    });
  }
}

export const db = new TrainingDB();
