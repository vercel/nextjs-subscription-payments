'use client';

import Button from '@/components/ui/Button';
import { signInWithOAuth } from '@/utils/auth-helpers/client';
import { type Provider } from '@supabase/supabase-js';
import { Github } from 'lucide-react';

type OAuthProviders = {
  name: Provider;
  icon: JSX.Element;
 };

export default function OauthSignIn() {  
  const oAuthProviders: OAuthProviders[] = [
    { name: 'github', icon: <Github className="h-5 w-5" /> }
    /* Add desired OAuth providers here */
  ];

  return (    
    <div className="mt-8">
      {oAuthProviders.map((provider) => (
        <form key={provider.name} className="pb-2" onSubmit={(e) => signInWithOAuth(e)}>
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
