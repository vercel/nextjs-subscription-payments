'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/app/(utils)/supabase-client';
import { getURL } from '@/app/(utils)/helpers';

export default function AuthUI() {
  return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={['github', 'google']}
        redirectTo={getURL()}
        magicLink={true}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#404040',
                brandAccent: '#52525b'
              }
            }
          }
        }}
        theme="dark"
      />
    </div>
  );
}
