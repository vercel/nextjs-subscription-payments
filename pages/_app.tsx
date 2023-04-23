import { useEffect, useState } from 'react';
import React from 'react';
import { AppProps } from 'next/app';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';

//import Layout from '@/components/Layout';

import { MyUserContextProvider } from '@/utils/useUser';
import type { Database } from 'types_db';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from '../theme';
import { ProSidebarProvider } from 'react-pro-sidebar';

import 'styles/main.css';
import 'styles/chrome-bug.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [theme, colorMode] = useMode();

  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient<Database>()
  );
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <div className="bg-black">
      <SessionContextProvider supabaseClient={supabaseClient}>
        <MyUserContextProvider>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ProSidebarProvider>
                <div className="app">
                  <main className="content">
                    {getLayout(<Component {...pageProps} />)}
                  </main>
                </div>
              </ProSidebarProvider>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </MyUserContextProvider>
      </SessionContextProvider>
    </div>
  );
}
