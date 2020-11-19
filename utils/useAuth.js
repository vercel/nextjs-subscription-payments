import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from './initSupabase';

const useAuth = (options) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const session = supabase.auth.session();
    setSession(session);
    setUser(session?.user ?? null);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`Supbase auth event: ${event}`);
        setSession(session);
        setUser(session?.user ?? null);
        if (event === 'SIGNED_OUT' && options?.redirectTo)
          router.push(options.redirectTo);
      }
    );
    if (!session?.user && options?.redirectTo) router.push(options.redirectTo);
    return () => {
      authListener.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, session };
};

export { useAuth };
