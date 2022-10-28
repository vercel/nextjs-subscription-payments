import 'styles/main.css';
import 'styles/chrome-bug.css';
import { useEffect, useState } from 'react';
import React from 'react';
import { MantineProvider } from '@mantine/core';

import Layout from 'components/Layout';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { AppProps } from 'next/app';
import { MyUserContextProvider } from 'utils/useUser';
import type { Database } from 'types_db';

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
          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
              /** Put your mantine theme override here */
              colorScheme: 'light',
            }}
          >
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </MantineProvider>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}
