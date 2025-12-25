'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useProfileStore } from '@/store/profile-store';

export default function ProfilePage() {
  const { profiles, activeProfileId, addProfile, setActiveProfile, loadPersisted, sessions } = useProfileStore();
  const [name, setName] = useState('Player One');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'pro'>('beginner');

  useEffect(() => {
    loadPersisted();
  }, [loadPersisted]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Profili & Progressi</h1>
          <p className="text-muted">Profili locali, storico sessioni e accuracy per modalità.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crea profilo</CardTitle>
            <CardDescription>Salva preferenze e progressi in IndexedDB + localStorage.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input aria-label="Nome profilo" value={name} onChange={(e) => setName(e.target.value)} />
            <Select aria-label="Difficoltà" value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
              <option value="beginner">Beginner (aiuti attivi)</option>
              <option value="intermediate">Intermediate (aiuti ridotti)</option>
              <option value="pro">Pro (timer, niente suggerimenti)</option>
            </Select>
            <Button
              onClick={() => {
                addProfile(name, difficulty);
              }}
            >
              Salva profilo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profili attivi</CardTitle>
            <CardDescription>Seleziona il profilo per associare sessioni.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {profiles.length === 0 ? (
              <p className="text-sm text-muted">Nessun profilo ancora creato.</p>
            ) : (
              <div className="space-y-2">
                {profiles.map((profile) => (
                  <Button
                    key={profile.id}
                    variant={profile.id === activeProfileId ? 'default' : 'outline'}
                    className="w-full justify-between"
                    onClick={() => setActiveProfile(profile.id)}
                  >
                    <span>{profile.name}</span>
                    <span className="text-xs text-muted">{profile.difficulty}</span>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storico sessioni</CardTitle>
          <CardDescription>Ultime attività di training.</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted">Ancora nessuna sessione registrata.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {sessions.slice(-10).map((session) => (
                <li key={session.id} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-muted">{new Date(session.startedAt).toLocaleString()}</span>
                  <span>{session.mode}</span>
                  <span className="text-accent">Accuracy {Math.round(session.accuracy * 100)}%</span>
                  <span>Streak {session.streak}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
