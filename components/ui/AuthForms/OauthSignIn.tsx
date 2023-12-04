'use client';

import { Github } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { type Provider } from '@supabase/supabase-js';
import { getURL } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

type OAuthProviders = {
  name: Provider;
  icon: JSX.Element;
 };
  
const oAuthProviders: OAuthProviders[] = [
  { name: 'github', icon: <Github className="h-5 w-5" /> }
  /* Add desired OAuth providers here */
];

type Props = {
  view: string;
};

export default function OauthSignIn({ view }: Props) {
  const router = useRouter();

  async function handleOAuthSignIn(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    // Prevent default form submission refresh
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.currentTarget);
    const provider = String(formData.get('provider')) as Provider;
    
    // Create client-side supabase client and call signInWithOAuth
    const supabase = createClient();
    const redirectURL = `${getURL()}auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: redirectURL
      }
    });

    if (error) {
      return router.push(
        `/signin/${view}?error=${encodeURI('Hmm... Something went wrong.'
        )}&error_description=${encodeURI('You could not be signed in.')}`
      );
    }

    router.push('/account');
  };

  return (
    <div className="mt-8">
      {oAuthProviders.map((provider) => (
        <form key={provider.name} className="pb-2" onSubmit={handleOAuthSignIn}>
          <input type="hidden" name="provider" value={provider.name} />
          <Button
            variant="slim"
            type="submit"
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