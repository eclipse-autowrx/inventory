// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

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
