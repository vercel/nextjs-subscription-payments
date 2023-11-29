import AuthUI from './AuthUI';
import Logo from '@/components/icons/Logo';
import { getSession } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function SignIn() {
  const session = await getSession();

  if (session) {
    return redirect('/');
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>
        <AuthUI />
      </div>
    </div>
  );
}
