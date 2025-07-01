// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

'use client';

import { signIn, signOut } from '@/services/auth.service';
import { useSessionStore } from '@/stores/session-store';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useCallback, useEffect } from 'react';

function InnerIframeSyncProvider() {
  const { setSession, clearSession } = useSessionStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const signInHandler = useCallback(
    async (userToken: string) => {
      const user = await signIn(userToken);
      setSession(user);
    },
    [setSession]
  );

  const handleMessageFromParent = useCallback(
    async (event: MessageEvent) => {
      if (event.data?.type === 'userToken') {
        const userToken = event.data?.token;
        if (userToken) {
          signInHandler(userToken);
        } else if (userToken === null) {
          await signOut();
          clearSession();
        }
      }

      if (event.data?.type === 'syncRoute') {
        const route = event.data?.route;
        if (route === null || route === 'undefined') {
          return;
        }
        const url = new URL(route, window.location.origin);
        if (
          url.pathname !== pathname ||
          url.search?.replace('?', '') !== searchParams.toString()
        ) {
          router.push(`${url.pathname}${url.search}`);
        }
      }
    },
    [clearSession, pathname, router, searchParams, signInHandler]
  );

  useEffect(() => {
    const search = searchParams.toString();
    if (!search && (!pathname || pathname === '/')) {
      return;
    }
    window.parent?.postMessage(
      {
        type: 'syncRoute',
        route: `${pathname}?${search}`,
      },
      '*'
    );
  }, [pathname, searchParams]);

  useEffect(() => {
    window.parent?.postMessage('requestUserToken', '*');
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessageFromParent);

    return () => {
      window.removeEventListener('message', handleMessageFromParent);
    };
  }, [handleMessageFromParent]);

  return null;
}

export default function IframeSyncProvider() {
  return (
    <Suspense>
      <InnerIframeSyncProvider />
    </Suspense>
  );
}
