import { Session } from '@/types/session.type';
import { create } from 'zustand';

type SessionState = {
  session?: Session;
};

type Actions = {
  setSession: (session: Session) => void;
  clearSession: () => void;
};

export type SessionStore = SessionState & Actions;

const initialState: SessionState = {
  session: undefined,
};

export const useSessionStore = create<SessionStore>()((set) => ({
  ...initialState,
  setSession: (session: Session) => set({ session }),
  clearSession: () => set({ session: undefined }),
}));
