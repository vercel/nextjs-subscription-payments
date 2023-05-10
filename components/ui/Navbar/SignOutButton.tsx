'use client';

import { supabase } from '@/app/(utils)/supabase-client';
import { useRouter } from 'next/navigation';

import s from './Navbar.module.css';

export default function SignOutButton() {
  const router = useRouter();

  return (
    <span
      className={s.link}
      onClick={async () => {
        await supabase.auth.signOut();
        router.push('/signin');
      }}
    >Sign out</span>
  );
}
