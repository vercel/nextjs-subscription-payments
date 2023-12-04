'use client';

import Button from '@/components/ui/Button';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function UpdatePassword() {  
  const router = useRouter();
  
  async function handlePasswordUpdate(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    // Prevent default form submission refresh
    e.preventDefault();
    console.log('handlePasswordUpdate');

    // Get form data
    const formData = new FormData(e.currentTarget);
    const password = String(formData.get('password'));
    const passwordConfirm = String(formData.get('passwordConfirm'));

    // Check that the password and confirmation match
    if (password !== passwordConfirm) {
      router.push(
        `/signin/update_password?error=${encodeURI(
          'Your password could not be updated.'
        )}&error_description=${encodeURI('Passwords do not match.')}`
      );
    }

    // Call email_signin API route with the form data
    const response = await fetch('/api/update_password', {
      method: 'POST',
      body: JSON.stringify({
        password: formData.get('password')
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const result = await response.json();
      // Display success toast if password was updated
      if (result.success) {
        router.push(
          `/signin?status=${encodeURI('Success!')}&status_description=${encodeURI(
            'Your password has been updated successfully.'
          )}`
        );
      } else if (result.error) {
        router.push(
          `/signin?error=${encodeURI(
            'Hmm... Something went wrong.'
          )}&error_description=${encodeURI('Your password could not be updated.')}`
        );
        
      }
    } else {
      // Handle non-JSON response
      console.log(`API error: Response is not JSON: ${response.statusText}`)
    }
  };

  return (
    <div className="my-8">
      <form noValidate={true} className="mb-4" onSubmit={handlePasswordUpdate}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-md bg-zinc-800"
            />
            <label htmlFor="passwordConfirm">Confirm New Password</label>
            <input
              id="passwordConfirm"
              placeholder="Password"
              type="password"
              name="passwordConfirm"
              autoComplete="current-password"
              className="w-full p-3 rounded-md bg-zinc-800"
            />
          </div>
          <Button
            variant="slim"
            type="submit"
            className="mt-1"
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  )
};