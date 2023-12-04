'use server';

import Logo from '@/components/icons/Logo';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import PasswordSignIn from '@/components/ui/AuthForms/PasswordSignIn';
import EmailSignIn from '@/components/ui/AuthForms/EmailSignIn';
import Separator from '@/components/ui/AuthForms/Separator';
import OauthSignIn from '@/components/ui/AuthForms/OauthSignIn';
import ForgotPassword from '@/components/ui/AuthForms/ForgotPassword';
import UpdatePassword from '@/components/ui/AuthForms/UpdatePassword';
import SignUp from '@/components/ui/AuthForms/Signup';
import dynamic from 'next/dynamic';

export default async function SignIn({ params }: { params: { id: string } }) {  
  // Define the valid view types
  const ViewTypes = ["password_signin", "email_signin", "forgot_password", "update_password", "signup"];
  
  // Declare 'viewProp' and initialize with a default value
  let viewProp = 'password_signin';

  // Assign 'view' to 'viewProp' if it's a valid string and ViewTypes includes it
  if (typeof params.id === 'string' && ViewTypes.includes(params.id)) {
    viewProp = params.id;
  }
  
  // Check if the user is already logged in and redirect to the account page if so
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session && viewProp !== 'update_password') {
    return redirect('/');
  } else if (!session && viewProp === 'update_password') {
    return redirect('/signin');
  }

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>
        <Card title={
          viewProp === 'signup' ? 'Sign Up' :
          viewProp === 'forgot_password' ? 'Forgot Password' :
          viewProp === 'update_password' ? 'Update Password' :
          'Sign In'
        }>
          {viewProp === 'password_signin' && <PasswordSignIn />}
          {viewProp === 'email_signin' && <EmailSignIn />}
          {viewProp === 'forgot_password' && <ForgotPassword />}
          {viewProp === 'update_password' && <UpdatePassword />}
          {viewProp === 'signup' && <SignUp />}
          {viewProp !== 'update_password' && viewProp !== 'signup' && (
            <>
            <Separator text="Third-party sign-in" />
            <OauthSignIn view={viewProp} />
            </>
          )}
        </Card>
      </div>
    </div>
  );
}