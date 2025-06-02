'use client';

import apiFetch from '@/lib/api-fetch';
import { useCallback, useEffect } from 'react';

export default function AuthProvider() {
  const signIn = useCallback(async (userToken: string) => {
    const response = await apiFetch('/api/auth/signin', {
      method: 'POST',
      body: {
        token: userToken,
      },
    });

    if (!response.ok) {
      console.warn('Failed to sign in with user token');
      return;
    }

    const { needRefresh = true } = await response.json();
    if (needRefresh) {
      window.location.href = window.location.href;
    }
  }, []);

  const handleReceiveUserToken = useCallback(
    async (event: MessageEvent) => {
      if (event.data?.type === 'userToken') {
        const userToken = event.data?.token;
        if (userToken) {
          signIn(userToken);
        } else {
          const res = await apiFetch('/api/auth/signout', {
            method: 'POST',
          });
          const { needRefresh } = await res.json();
          if (needRefresh) {
            window.location.href = window.location.href;
          }
        }
      }
    },
    [signIn]
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
