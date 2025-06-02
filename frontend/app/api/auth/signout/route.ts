import { getServerSession } from '@/lib/auth/server-session-auth';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const session = await getServerSession();
  if (session) {
    (await cookies()).delete('session');
    return NextResponse.json(
      {
        needRefresh: true,
      },
      {
        status: 200,
      }
    );
  }
  return NextResponse.json({ needRefresh: false }, { status: 200 });
}
