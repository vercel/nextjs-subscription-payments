import { headers, cookies } from 'next/headers';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { Subscription, UserDetails } from '@/types';
import { Database } from '@/types_db';

export const createServerSupabaseClient = () =>
  createServerComponentSupabaseClient<Database>({
    headers,
    cookies
  });

export async function getUserData() {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    const { data: userDetails } = await supabase
      .from('users')
      .select('*')
      .single();
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();

    return {
      session,
      user,
      userDetails: userDetails as unknown as UserDetails,
      subscription: subscription as Subscription
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      session: null,
      user: null,
      userDetails: null,
      subscription: null
    };
  }
}
