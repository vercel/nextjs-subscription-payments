import DashboardC from './components/DashboardC';
import {
  getSession,
  getUserDetails,
  getSubscription
} from '@/app/supabase-server';
import React, { useEffect, useRef, useState } from 'react';
import { redirect } from 'next/navigation';



export default async function Dashboard() {
  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription()
  ]);

  const user = session?.user;

  if (!session) {
    return redirect('/hb/signin');
  }

return (
  <>
    <DashboardC
      session={session}
      user={session?.user}
      subscription={subscription}
    />
  </>
  )
}
