import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import type { Database } from 'types_db';

export const supabase = createBrowserSupabaseClient<Database>();

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from('users')
    .update({
      full_name: name
    })
    .eq('id', user.id);
};

