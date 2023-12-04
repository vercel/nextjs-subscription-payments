'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link'
import React from 'react';
import { useRouter } from 'next/navigation';

export default function PasswordSignIn() {
  const router = useRouter();
  // Handle login with username and password
  async function handlePasswordSignIn(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    // Prevent default form submission refresh
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.currentTarget);

    // Call password_signin API route with the form data
    const response = await fetch('/api/password_signin', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const result = await response.json();
      // Redirect to the account page if successfully logged in
      if (result.success) {
        router.push('/account');
      } else if (result.error) {
        // Redirect to the sign-in page if there was an error
        router.push(`/signin?error=${encodeURI("Sign in failed.")}&error_description=${encodeURI(result.message)}`);
      }
    } else {
      // Handle non-JSON response
      console.log(`API error: Response is not JSON: ${response.statusText}`)
    }
  };

  return (
    <div className="my-8">
      <form noValidate={true} className="mb-4" onSubmit={handlePasswordSignIn}>
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
      <p><Link href="/signin/email_signin" className="font-light text-sm">Sign in with email</Link></p>
      <p><Link href="/signin/signup" className="font-light text-sm">Don't have an account? Sign up</Link></p>
    </div>
  )
};