// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

import 'server-only';

import { type Session } from '@/types/session.type';
import { SESSION_COOKIE_NAME } from './helper';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function getServerSession(): Promise<Session | undefined> {
  const cookie = (await cookies()).get(SESSION_COOKIE_NAME);

  if (!cookie) {
    return;
  }

  return decode(cookie.value);
}

export function encode(user: Session) {
  if (!process.env.SESSION_JWT_SECRET) {
    throw new Error('SESSION_JWT_SECRET is not set');
  }

  const token = jwt.sign(user, process.env.SESSION_JWT_SECRET, {
    expiresIn: '1d',
    audience: 'inventory',
    issuer: 'playground',
  });

  return token;
}

export function decode(token?: string): Session | undefined {
  if (!process.env.SESSION_JWT_SECRET) {
    throw new Error('SESSION_JWT_SECRET is not set');
  }

  if (!token) {
    return undefined;
  }

  try {
    const session = jwt.verify(token, process.env.SESSION_JWT_SECRET, {
      audience: 'inventory',
      issuer: 'playground',
    });
    return session as Session;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}
