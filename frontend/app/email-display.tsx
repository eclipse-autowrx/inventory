// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

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
