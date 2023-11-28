'use client';

import type { Database } from '@/types_db';
import { createClient } from '@/utils/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
};

const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClient());
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event) => {
      console.log('Supabase auth event: ', event);
      if (event === 'SIGNED_IN') router.refresh();
      if (event === 'PASSWORD_RECOVERY') router.push('/account/reset-password');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  return (
    <Context.Provider value={{ supabase }}>
      <>{children}</>
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider');
  }

  return context;
};
