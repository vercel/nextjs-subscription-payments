'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link'
import React from 'react';
import { signInWithPassword } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function PasswordSignIn({ allowEmail, redirectMethod }: PasswordSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  
  return (
    <div className="my-8">
      <form noValidate={true} className="mb-4" onSubmit={(e) => handleRequest(e, signInWithPassword, router)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-md bg-zinc-800"
            />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            placeholder="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            className="w-full p-3 rounded-md bg-zinc-800"
          />
          </div>
          <Button
            variant="slim"
            type="submit"
            className="mt-1"
          >
            Sign in with Password
          </Button>
        </div>
      </form>
      <p><Link href="/signin/forgot_password" className="font-light text-sm">Forgot your password?</Link></p>
      {allowEmail && <p><Link href="/signin/email_signin" className="font-light text-sm">Sign in with email</Link></p>}
      <p><Link href="/signin/signup" className="font-light text-sm">Don't have an account? Sign up</Link></p>
    </div>
  )
};