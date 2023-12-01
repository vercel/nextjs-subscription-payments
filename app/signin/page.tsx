import GitHub from '@/components/icons/GitHub';
import Logo from '@/components/icons/Logo';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SignIn() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session) {
    return redirect('/');
  }

  const signInWithGitHub = async () => {
    'use server';

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    });

    if (error) {
      return redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=${encodeURI(
          'Hmm... Something went wrong.'
        )}&error_description=${encodeURI('You could not be signed in.')}`
      );
    }

    return redirect(data.url);
  };

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <form action={signInWithGitHub}>
            <button className="flex flex-col items-center">
              <GitHub width="64px" height="64px" className="mb-2" />
              Sign in with GitHub
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
