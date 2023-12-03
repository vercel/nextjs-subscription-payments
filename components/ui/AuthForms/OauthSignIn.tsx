import { createClient } from '@/utils/supabase/server';
import { Github } from 'lucide-react';
import { cookies } from 'next/headers';
import { type Provider } from '@supabase/supabase-js';
import { getURL } from '@/utils/helpers';
import { redirect } from 'next/navigation';
import Button from '@/components/ui/Button';

type OAuthProviders = {
  name: Provider;
  icon: JSX.Element;
 };
  
const oAuthProviders: OAuthProviders[] = [
  { name: 'github', icon: <Github className="h-5 w-5" /> }
  /* Add desired OAuth providers here */
];

export default function OauthSignIn() {
  const redirectURL = `${getURL()}auth/callback`;

  const handleOAuthSignIn = async (formData: FormData) => {
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
    <div className="mt-8">
      {oAuthProviders.map((provider) => (
        <form key={provider.name} className="pb-2">
          <input type="hidden" name="provider" value={provider.name} />
          <Button
            variant="slim"
            formAction={handleOAuthSignIn}
            className="w-full"
          >
            <span className="mr-2">{provider.icon}</span>
            <span className="capitalize">{provider.name}</span>
          </Button>
        </form>
      ))}
    </div>
  )
};
