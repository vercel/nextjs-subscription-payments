'use client'

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link'
import { signInWithEmail } from '@/utils/auth-helpers';

export default function EmailSignIn() {  
  const router = useRouter();

  async function handleEmailSignIn(e: React.FormEvent<HTMLFormElement>) {
    // Prevent default form submission refresh
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const redirectURL = await signInWithEmail(formData);
    return router.push(redirectURL);
  }

  return (
    <div className="my-8">
      <form noValidate={true} className="mb-4" onSubmit={handleEmailSignIn}>
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
          </div>
          <Button
            variant="slim"
            type="submit"
            className="mt-1"
          >
            Sign in with Email
          </Button>
        </div>
      </form>
      <p><Link href="/signin/password_signin" className="font-light text-sm">Sign in with password</Link></p>
      <p><Link href="/signin/signup" className="font-light text-sm">Don't have an account? Sign up</Link></p>
    </div>
  )
};