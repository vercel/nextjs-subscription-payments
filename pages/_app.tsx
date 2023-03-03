import { useEffect, useState } from 'react';
import React from 'react';
import { AppProps } from 'next/app';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

import Layout from '@/components/Layout';
import { MyUserContextProvider } from '@/utils/useUser';
import type { Database } from 'types_db';

import 'styles/main.css';
import 'styles/chrome-bug.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <div className="bg-black">
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}
