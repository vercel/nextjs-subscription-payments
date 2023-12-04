// TODO: Manage preferred signin method with a cookie
import { redirect } from 'next/navigation';
import { getDefaultSignInView } from '@/utils/auth-helpers';

export default async function SignIn() {
  const defaultView = await getDefaultSignInView();
  
  return redirect(`/signin/${defaultView}`);
};