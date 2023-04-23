import { ReactNode, useState } from 'react';
import { GetServerSidePropsContext, NextPage } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import Dashboard from '@/scenes/dashboard';
import { useUser } from '@/utils/useUser';
import DashboardLayout from '@/components/DashboardLayout';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };

  return {
    props: {
      initialSession: session,
      user: session.user
    }
  };
};

export default function DashboardPage({ user }: { user: User }) {
  const { isLoading, subscription, userDetails } = useUser();

  return <Dashboard />;
}

DashboardPage.getLayout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
