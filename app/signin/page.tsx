// TODO: Manage preferred signin method with a cookie
import { redirect } from 'next/navigation';

export default async function SignIn() {
  return redirect('/signin/password_signin');
};