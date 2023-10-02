import { getSession } from '@/app/supabase-server';

import { redirect } from 'next/navigation';

import Dashboard from './dashboard/page';

export default async function Hb() {
  const session = await getSession();

  if (!session) {
    return redirect('/signinhb');
  }

  return (
    <div className='w-full'>
        <Dashboard />
    </div>
  );
}