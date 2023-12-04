import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getURL } from 'utils/helpers';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default async function ForgotPassword() {
  const redirectURL = `${getURL()}auth/password_reset`;

  const handleForgotPasswordRequest = async (formData: FormData) => {
  'use server';

  const email = String(formData.get('email'));
  // Check that the email entered is valid
  function isValidEmail(email: string) {
    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
  if (!isValidEmail(email)) {
    redirect(
    `/signin/forgot_password?error=${encodeURIComponent(
      'Invalid email address.'
    )}&error_description=${encodeURIComponent('Please try again.')}`
    );
  }
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectURL
  });
  if (error) {
    return redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL}/signin/forgot_password?error=${encodeURI(
      'Hmm... Something went wrong.'
    )}&error_description=${encodeURI('You could not be signed in.')}`
    );
  } else if (data) {
    redirect(
    `/signin/forgot_password?status=${encodeURI('Success!')}&status_description=${encodeURI(
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
            formAction={handleForgotPasswordRequest}
            className="mt-1"
          >
            Send Email
          </Button>
        </div>
      </form>
      <p><Link href="/signin/password_signin" className="font-light text-sm">Sign in with password</Link></p>
      <p><Link href="/signin/email_signin" className="font-light text-sm">Sign in with email</Link></p>
      <p><Link href="/signin/signup" className="font-light text-sm">Don't have an account? Sign up</Link></p>
    </div>
  )
};