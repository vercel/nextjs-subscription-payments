'use client';

import Button from '@/components/ui/Button';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  
  // Handle signup with username and password
  async function handleSignUp(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    // Prevent default form submission refresh
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.currentTarget);
    const fullName = String(formData.get('fullName'));
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    // Check that the email entered is valid
    function isValidEmail(email: string) {
      var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return regex.test(email);
    }
    
    if (!isValidEmail(email)) {
      router.push(
      `/signin/signup?error=${encodeURIComponent(
        'Invalid email address.'
      )}&error_description=${encodeURIComponent('Please try again.')}`
      );
    }
    
    // Call password_signin API route with the form data
    const response = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({
        fullName: fullName,
        email: email,
        password: password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const result = await response.json();
      // Display success toast if email was sent
      if (result.success) {
        return router.push(
          `/signin/signup?status=${encodeURI(
            'Success!'
          )}&status_description=${encodeURI(
            'Please check your email for a magic link. You may now close this tab.'
          )}`
        );
      } else if (result.error) {
        return router.push(
          `/signin/signup?error=${encodeURI(
            'You could not be signed up.'
          )}&error_description=${encodeURI(result.message)}`
        );
      } else {
        // Handle non-JSON response
        console.log(`API error: Response is not JSON: ${response.statusText}`)
      }
    }
  };

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
      <p><Link href="/signin/email_signin" className="font-light text-sm">Sign in with email</Link></p>
    </div>
  )
};