// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

'use client';

// This component displays current user's email. Use for debugging.
import { useSessionStore } from '@/stores/session-store';

export function EmailDisplay() {
  const { session } = useSessionStore();
  const email = session?.email;

  if (!email) {
    return null;
  }
  return <p>{email}</p>;
}
