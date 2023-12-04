import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link'

export default function PasswordSignIn() {
  // Handle login with username and password
  const handlePasswordSignIn = async (formData: FormData) => {
    'use server';

    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=${encodeURI(
          'You could not be signed in.'
        )}&error_description=${encodeURI(error.message)}`
      );
    }

    redirect('/');
  };

  return (
    <div className="my-8">
      <form noValidate={true} className="mb-4">
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            placeholder="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            className="w-full p-3 rounded-md bg-zinc-800"
          />
          <Button
            variant="slim"
            formAction={handlePasswordSignIn}
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