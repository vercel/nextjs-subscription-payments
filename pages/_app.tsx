import 'styles/main.css';
import 'styles/chrome-bug.css';
import { useEffect } from 'react';
import React from 'react';

import Layout from 'components/Layout';
import { UserContextProvider } from 'utils/useUser';
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <div className="bg-black">
      <UserContextProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContextProvider>
    </div>
  );
}
