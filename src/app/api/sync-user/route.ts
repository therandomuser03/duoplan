import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return new NextResponse('Error fetching user', { status: 500 });
  }

  if (!existingUser) {
    const { error: insertError } = await supabase.from('users').insert([
      {
        id: session.user.id,
        first_name: session.user.user_metadata?.first_name || 'User',
        last_name: session.user.user_metadata?.last_name || 'Name',
        email: session.user.email,
      },
    ]);

    if (insertError) {
      return new NextResponse('Error creating user', { status: 500 });
    }
  }

  return new NextResponse('User synced successfully', { status: 200 });
} 