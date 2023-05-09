import { headers, cookies } from 'next/headers';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';

export const createServerSupabaseClient = () =>
  createServerComponentSupabaseClient<Database>({
    headers,
    cookies
  });
