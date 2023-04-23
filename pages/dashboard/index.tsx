import { ReactNode, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';

import Dashboard from '@/scenes/Dashboard';
import { useUser } from '@/utils/useUser';
import Sidebar from '../../scenes/global/Sidebar';
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
  const [isSidebar, setIsSidebar] = useState(true);
  return (
    <div className="dashboard-main">
      <Sidebar isSidebar={isSidebar} />
      <Dashboard />
    </div>
  );
}

DashboardPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
