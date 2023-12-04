'use client';

import Button from '@/components/ui/Button';
import React from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/utils/auth-helpers';

export default function UpdatePassword() {  
  const router = useRouter();
  
  async function handlePasswordUpdate(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    // Prevent default form submission refresh
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const redirectURL = await updatePassword(formData);
    return router.push(redirectURL);
  }

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