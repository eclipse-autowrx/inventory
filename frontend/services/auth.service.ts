'use server';

import { apiConfig } from '@/configs/api';
import { apiFetch } from '@/lib/api-fetch';
import { SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from '@/lib/auth/helper';
import { encode } from '@/lib/auth/server-session-auth';
import { Session } from '@/types/session.type';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function signIn(token: string) {
  try {
    if (!token) {
      throw new Error('Token is required for sign-in');
    }

    const res = await apiFetch(`${apiConfig.baseUrl}/auth/authenticate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Authentication failed:', data?.message || 'Unknown error');
      throw new Error('Authentication failed');
    }

    const { user } = data;

    if (!user) {
      throw new Error('Authentication failed. User not found.');
    }

    const sessionUser: Session = {
      id: user.id,
      email: user.email,
      accessToken: token,
    };

    const session = encode(sessionUser);
    (await cookies()).set(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      expires: new Date(Date.now() + SESSION_COOKIE_MAX_AGE),
      sameSite: 'lax',
      path: '/',
    });

    revalidatePath('/schema', 'page');
    revalidatePath('/schema/[pages]', 'page');

    return user;
  } catch (error) {
    console.error('Error during sign-in:', error);
    throw new Error('Internal Server Error');
  }
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
}
