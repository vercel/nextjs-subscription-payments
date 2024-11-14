// app/api/account/update/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Database } from '@/types_db';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { fullName, email } = await req.json();
    const supabase = createRouteHandlerClient<Database>({ cookies });

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update auth email if changed
    if (email !== user.email) {
      const { error: updateAuthError } = await supabase.auth.updateUser({
        email: email
      });

      if (updateAuthError) {
        return NextResponse.json(
          { error: updateAuthError.message },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const { error: updateError } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating account:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
