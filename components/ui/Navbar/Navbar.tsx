import Link from 'next/link';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Logo from '@/components/icons/Logo';

import s from './Navbar.module.css';

export default async function Navbar() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const handleSignOut = async () => {
    'use server';

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signOut();

    if (error) {
      return redirect(
        `/?error=${encodeURIComponent(
          'Hmm... Something went wrong.'
        )}&error_description=${encodeURIComponent('You could not be signed out.')}`
      );
    }

    return redirect('/signin');
  };

  // We make this a server function to enforce rehydration on magic link sign in
  const handleSignIn = async () => {
    'use server';
    
    return redirect('/signin');
  };

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex items-center flex-1">
            <Link href="/" className={s.logo} aria-label="Logo">
              <Logo />
            </Link>
            <nav className="hidden ml-6 space-x-2 lg:block">
              <Link href="/" className={s.link}>
                Pricing
              </Link>
              {user && (
                <Link href="/account" className={s.link}>
                  Account
                </Link>
              )}
            </nav>
          </div>
          <div className="flex justify-end flex-1 space-x-8">
            {user ? (
              <form action={handleSignOut}>
                <button className={s.link}>Sign out</button>
              </form>
            ) : (
              <form action={handleSignIn}>
                <button className={s.link}>Sign in</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
