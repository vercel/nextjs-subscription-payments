'use client';

import { usePathname, useRouter } from 'next/navigation';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import s from './Navbar.module.css';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';

interface SignInOutLinkProps {
  user?: User | null;
}

export default function SignInOutLink({ user }: SignInOutLinkProps) {
  const router = useRouter();

  return user ? (
    <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
      <input type="hidden" name="pathName" value={usePathname()} />
      <button type="submit" className={s.link}>
        Sign out
      </button>
    </form>
  ) : (
    <Link href="/signin" className={s.link}>
      Sign In
    </Link>
  );
};