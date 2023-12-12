'use client';

import Link from 'next/link';
import { SignOut, redirectToSignIn } from '@/utils/auth-helpers/server'
import Logo from '@/components/icons/Logo';
import { usePathname } from 'next/navigation';
import s from './Navbar.module.css';

interface NavlinksProps {
    user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
    return (
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
              <form action={SignOut}>
                <input type="hidden" name="pathName" value={usePathname()} />
                <button className={s.link}>Sign out</button>
              </form>
            ) : (
              <form action={redirectToSignIn}>
                <button className={s.link}>Sign in</button>
              </form>
            )}
          </div>
        </div>
    );
}