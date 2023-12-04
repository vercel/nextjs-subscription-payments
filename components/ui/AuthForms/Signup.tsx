'use client';

import Button from '@/components/ui/Button';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '@/utils/auth-helpers'

// Define prop type with allowEmail boolean
interface SignUpProps {
  allowEmail: boolean;
}

export default function SignUp({ allowEmail }: SignUpProps) {
  const router = useRouter();
  
  // Handle signup with username and password
  async function handleSignUp(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    // Prevent default form submission refresh
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const redirectURL = await signUp(formData);
    return router.push(redirectURL);
  }

  return (
    <div className="my-8">
      <form noValidate={true} className="mb-4" onSubmit={handleSignUp}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              placeholder="Full Name"
              type="text"
              name="fullName"
              autoCapitalize="none"
              autoComplete="name"
              autoCorrect="off"
              className="w-full p-3 rounded-md bg-zinc-800"
            />
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
            Sign up
          </Button>
        </div>
      </form>
      <p>Already have an account?</p>
      <p><Link href="/signin/password_signin" className="font-light text-sm">Sign in with password</Link></p>
      {allowEmail && <p><Link href="/signin/email_signin" className="font-light text-sm">Sign in with email</Link></p>}
    </div>
  )
};