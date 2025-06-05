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
