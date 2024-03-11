'use client';

import { useState, useEffect } from 'react';
import Hamburger from 'hamburger-react';
import Link from 'next/link';
import SignInOutLink from './SignInOutLink';
import Logo from '@/components/icons/Logo';
import s from './Navbar.module.css';
import { User } from '@supabase/supabase-js';

interface NavbarProps {
  user: User | null;
}

export default function Navbar({user}: NavbarProps) {
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      let path = event.composedPath ? event.composedPath() : [];
      const hamburgerElement = document.querySelector(".hamburger-react");

      if (hamburgerElement && path.includes(hamburgerElement)) {
        return; // Click was inside the Hamburger, so do nothing
      }

      const dropdown = document.querySelector(`.${s.dropdownMenu}`) as HTMLElement;
      if (dropdown && !dropdown.contains(event.target as Node) && isOpen) {
        setOpen(false);
      }
    };

    // Listen for mouse and touch events
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);
  
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
            <div className="hidden ml-6 space-x-2 lg:block">
              <Link href="/" className={s.link}>
                Pricing
              </Link>
              {user && (
                <Link href="/account" className={s.link}>
                  Account
                </Link>
              )}
            </div>
            <div className="hidden lg:flex justify-end flex-1 space-x-8">
              <SignInOutLink user={user} />
            </div>
          </div>
          <div className="flex justify-end flex-1 lg:hidden">
            <Hamburger
              size={24}
              color="#fff"
              toggled={isOpen}
              toggle={setOpen}
            />
          </div>
        </div>
      </div>
      {isOpen && (
      <div className={s.dropdownMenu}>
        <Link href="/" className={s.link}>
          Pricing
        </Link>
        {user && (
          <Link href="/account" className={s.link}>
            Account
          </Link>
        )}
        <SignInOutLink user={user} />
      </div>
      )}
    </nav>
  );
};