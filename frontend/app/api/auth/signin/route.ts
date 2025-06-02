import { apiConfig } from '@/configs/api';
import apiFetch from '@/lib/api-fetch';
import { SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from '@/lib/auth/helper';
import { encode, getServerSession } from '@/lib/auth/server-session-auth';
import { Session } from '@/types/session.type';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({}, { status: 401 });
    }

    const res = await apiFetch(`${apiConfig.baseUrl}/auth/authenticate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          message: data?.message || 'Authentication failed',
        },
        { status: res.status }
      );
    }

    const { user } = data;

    if (!user) {
      return NextResponse.json({}, { status: 401 });
    }

    const previousSessionUser = await getServerSession();

    const sessionUser: Session = {
      id: user.id,
      email: user.email,
      accessToken: token,
    };

    let needRefresh = true;
    if (previousSessionUser?.id === sessionUser.id) {
      needRefresh = false;
    }

    const session = encode(sessionUser);
    (await cookies()).set(SESSION_COOKIE_NAME, session, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + SESSION_COOKIE_MAX_AGE),
      sameSite: 'lax',
      path: '/',
    });

    return NextResponse.json({ user, needRefresh }, { status: 200 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          message: 'Invalid body format. Expect a JSON body with "token" field',
        },
        { status: 400 }
      );
    }
    console.error('Error during sign-in:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
