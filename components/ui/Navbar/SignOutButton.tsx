'use client';

import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';

import s from './Navbar.module.css';

export default function SignOutButton() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }
  return (
    <button
      className={s.link}
      onClick={handleSignOut}
    >
      Sign out
    </button>
  );
}
