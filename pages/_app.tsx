import { useEffect } from 'react';
// import 'assets/main.css';
// import 'assets/chrome-bug.css';
import React from 'react';

import Layout from 'components/Layout';
import { UserContextProvider } from 'utils/useUser';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    document.body.classList?.remove('loading');
  }, []);

  return (
    <div>
      <UserContextProvider>
        {router.pathname.includes('video') && (
          // <Layout>
          <Component {...pageProps} />
          // </Layout>
        )}
        {!router.pathname.includes('video') && (
          <div className="">
            {/* <Layout> */}
              <Component {...pageProps} />
            {/* </Layout> */}
          </div>
        )}
      </UserContextProvider>
    </div>
  );
}
