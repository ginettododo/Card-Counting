'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { TrainerProfile, SessionStats } from '@/types/training';
import { db } from '@/lib/db';

interface ProfileState {
  profiles: TrainerProfile[];
  activeProfileId?: string;
  sessions: SessionStats[];
  addProfile: (name: string, difficulty: TrainerProfile['difficulty']) => Promise<TrainerProfile>;
  setActiveProfile: (id: string) => void;
  logSession: (session: SessionStats) => Promise<void>;
  loadPersisted: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profiles: [],
      sessions: [],
      async addProfile(name, difficulty) {
        const profile: TrainerProfile = { id: nanoid(), name, difficulty, createdAt: Date.now() };
        await db.profiles.add(profile);
        set((state) => ({ profiles: [...state.profiles, profile], activeProfileId: profile.id }));
        return profile;
      },
      setActiveProfile(id) {
        set({ activeProfileId: id });
      },
      async logSession(session) {
        await db.sessions.add(session);
        set((state) => ({ sessions: [...state.sessions, session] }));
      },
      async loadPersisted() {
        const [profiles, sessions] = await Promise.all([db.profiles.toArray(), db.sessions.toArray()]);
        if (profiles.length > 0) {
          set({ profiles, sessions, activeProfileId: get().activeProfileId ?? profiles[0].id });
        }
      },
    }),
    {
      name: 'profile-store',
      partialize: (state) => ({ activeProfileId: state.activeProfileId, profiles: state.profiles }),
    },
  ),
);
