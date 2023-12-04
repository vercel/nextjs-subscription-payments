import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { getURL } from '@/utils/helpers';

export default function SignUp() {
  // Handle signup with username and password
  const handleSignUp = async (formData: FormData) => {
    'use server';

    const fullName = String(formData.get('fullName'));
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));
    
    const redirectURL = `${getURL()}auth/callback`;

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectURL,
        data: {full_name: fullName}
      }
    });

    if (error) {
      return redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/signup?error=${encodeURI(
          'You could not be signed up.'
        )}&error_description=${encodeURI(error.message)}`
      );
    } else if (data) {
      return redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/account?status=${encodeURI(
          'Success!'
        )}&status_description=${encodeURI(
          'Please check your email for a magic link. You may now close this tab.'
        )}`
      );
    }
  };

  return (
    <div className="my-8">
      <form noValidate={true} className="mb-4">
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
            formAction={handleSignUp}
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