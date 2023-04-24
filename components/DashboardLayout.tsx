import { PropsWithChildren } from 'react';
import Head from 'next/head';
import Navbar from '@/components/ui/Navbar';
import { PageMeta } from '../types';
import Topbar from '../scenes/global/Topbar';
import Sidebar from '@/scenes/global/Sidebar';

interface Props extends PropsWithChildren {
  meta?: PageMeta;
}

export default function Layout({ children, meta: pageMeta }: Props) {
  const meta = {
    title: 'Next.js Subscription Starter',
    description: 'Brought to you by Vercel, Stripe, and Supabase.',
    cardImage: '/og.png',
    ...pageMeta
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="robots" content="no-follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta content={meta.description} name="description" />
      </Head>
      <Navbar />
      <Topbar />
      <main className="dashboard-main">
        <Sidebar />
        <div className="dashboard-content">{children}</div>
      </main>
    </>
  );
}
