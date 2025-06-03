'use client';

import { signIn, signOut } from '@/services/auth.service';
import { useSessionStore } from '@/stores/session-store';
import { useCallback, useEffect } from 'react';

export default function AuthProvider() {
  const { setSession, clearSession } = useSessionStore();

  const signInHandler = useCallback(
    async (userToken: string) => {
      const user = await signIn(userToken);
      setSession(user);
    },
    [setSession]
  );

  const handleReceiveUserToken = useCallback(
    async (event: MessageEvent) => {
      if (event.data?.type === 'userToken') {
        const userToken = event.data?.token;
        if (userToken) {
          signInHandler(userToken);
        } else {
          await signOut();
          clearSession();
        }
      }
    },
    [clearSession, signInHandler]
  );

  useEffect(() => {
    window.parent?.postMessage('requestUserToken', '*');

    window.addEventListener('message', handleReceiveUserToken);

    return () => {
      window.removeEventListener('message', handleReceiveUserToken);
    };
  }, [handleReceiveUserToken]);

  return null;
}
