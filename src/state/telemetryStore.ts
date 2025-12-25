import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type TelemetryEventType =
  | 'drill.session.start'
  | 'drill.session.save'
  | 'drill.count.submit'
  | 'drill.decision.submit'
  | 'settings.update';

export interface TelemetryEvent {
  id: string;
  type: TelemetryEventType;
  timestamp: number;
  payload?: Record<string, unknown>;
}

interface TelemetryStore {
  events: TelemetryEvent[];
  logEvent: (type: TelemetryEventType, payload?: Record<string, unknown>) => void;
  clear: () => void;
  exportJson: () => string;
}

/**
 * In-memory telemetry that never leaves the client. Useful for local debugging and exporting JSON snapshots.
 */
export const useTelemetryStore = create<TelemetryStore>((set, get) => ({
  events: [],
  logEvent: (type, payload) => {
    set((state) => ({ events: [...state.events, { id: nanoid(), type, timestamp: Date.now(), payload }] }));
  },
  clear: () => set({ events: [] }),
  exportJson: () => {
    const snapshot = { exportedAt: Date.now(), events: get().events };
    return JSON.stringify(snapshot, null, 2);
  },
}));
