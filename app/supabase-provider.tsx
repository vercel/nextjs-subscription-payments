'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  SupabaseClient,
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import {
  useSessionContext,
  useUser as useSupaUser
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase-client';

import { ProductWithPrice, UserDetails, Subscription } from '@/types';
import type { Database } from '@/types_db';

// Combined context type
type CombinedContextType = {
  supabase: SupabaseClient<Database>;
  accessToken: string | null;
  user: User | null;
  userDetails: UserDetails | null;
  isLoading: boolean;
  subscription: Subscription | null;
};

const CombinedContext = createContext<CombinedContextType | undefined>(
  undefined
);

export default function SupabaseProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { session, isLoading: isLoadingUser } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;
  const router = useRouter();
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase]);

  const getUserDetails = () => supabase.from('users').select('*').single();
  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();

  useEffect(() => {
    if (user && !isLoadingData && !userDetails && !subscription) {
      setIsLoadingData(true);
      Promise.allSettled([getUserDetails(), getSubscription()]).then(
        (results) => {
          alert (results);
          const userDetailsPromise = results[0];
          const subscriptionPromise = results[1];

          if (userDetailsPromise.status === 'fulfilled')
            setUserDetails(userDetailsPromise.value.data as UserDetails);

          if (subscriptionPromise.status === 'fulfilled')
            setSubscription(subscriptionPromise.value.data as Subscription);

          setIsLoadingData(false);
        }
      );
    } else if (!user && !isLoadingUser && !isLoadingData) {
      setUserDetails(null);
      setSubscription(null);
    }
  }, [user, isLoadingUser]);

  const value = {
    supabase,
    accessToken,
    user,
    userDetails,
    isLoading: isLoadingUser || isLoadingData,
    subscription
  };

  return (
    <CombinedContext.Provider value={value}>
      <>{children}</>
    </CombinedContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(CombinedContext);

  if (context === undefined) {
    throw new Error('useCombinedContext must be used inside CombinedProvider');
  }

  return context;
};
