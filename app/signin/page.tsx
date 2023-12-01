import Logo from '@/components/icons/Logo';
import Button from '@/components/ui/Button';
import { createClient } from '@/utils/supabase/server';
import { Github } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { type Provider } from '@supabase/supabase-js';
import Card from '@/components/ui/Card';
import { getURL } from '@/utils/helpers';

type OAuthProviders = {
  name: Provider;
  icon: JSX.Element;
};

const oAuthProviders: OAuthProviders[] = [
  { name: 'github', icon: <Github className="h-5 w-5" /> }
  /* Add desired OAuth providers here */
];

export default async function SignIn() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    return redirect('/');
  }

  const redirectURL = `${getURL()}/auth/callback`;

  const handleOTPLogin = async (formData: FormData) => {
    'use server';

    const email = String(formData.get('email'));
    // Check that the email entered is valid
    function isValidEmail(email: string) {
      var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return regex.test(email);
    }
    if (!isValidEmail(email)) {
      redirect(
        `/signin?error=${encodeURIComponent(
          'Invalid email address.'
        )}&error_description=${encodeURIComponent('Please try again.')}`
      );
    }
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectURL
      }
    });
    if (error) {
      return redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=${encodeURI(
          'Hmm... Something went wrong.'
        )}&error_description=${encodeURI('You could not be signed in.')}`
      );
    } else if (data) {
      redirect(
        `/signin?status=${encodeURI('Success!')}&status_description=${encodeURI(
          'Please check your email for a magic link. You may now close this tab.'
        )}`
      );
    }
  };

  const handleOAuthLogin = async (formData: FormData) => {
    'use server';

    const provider = String(formData.get('provider')) as Provider;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: redirectURL
      }
    });

    if (error) {
      return redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=${encodeURI(
          'Hmm... Something went wrong.'
        )}&error_description=${encodeURI('You could not be signed in.')}`
      );
    }

    redirect(data.url);
  };

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>
        <Card title={'Sign In'}>
          <form noValidate={true} className="my-8">
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
                formAction={handleOTPLogin}
                className="mt-1"
              >
                Continue with Email
              </Button>
            </div>
          </form>
          <div className="relative">
            <div className="relative flex items-center py-1">
              <div className="grow border-t border-zinc-700"></div>
              <span className="mx-3 shrink text-sm leading-8 text-zinc-500">
                OR CONTINUE WITH
              </span>
              <div className="grow border-t border-zinc-700"></div>
            </div>
          </div>
          <div className="mt-8">
            {oAuthProviders.map((provider) => (
              <form key={provider.name} className="pb-2">
                <input type="hidden" name="provider" value={provider.name} />
                <Button
                  variant="slim"
                  formAction={handleOAuthLogin}
                  className="w-full"
                >
                  <span className="mr-2">{provider.icon}</span>
                  <span className="capitalize">{provider.name}</span>
                </Button>
              </form>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
