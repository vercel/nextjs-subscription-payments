import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function UpdatePassword() {  
  // Handle login with username and password
  const handlePasswordUpdate = async (formData: FormData) => {
    'use server';

    const password = String(formData.get('password'));
    const passwordConfirm = String(formData.get('passwordConfirm'));

    if (password !== passwordConfirm) {
      return redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=${encodeURI(
          'Passwords do not match.'
        )}&error_description=${encodeURI('Your password could not be updated.')}`
      );
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error, data } = await supabase.auth.updateUser({
        password
    }
    );

    if (error) {
      return redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/signin?error=${encodeURI(
          'Hmm... Something went wrong.'
        )}&error_description=${encodeURI('Your password could not be updated.')}`
      );
    } else if (data) {
      redirect(
      `/signin?status=${encodeURI('Success!')}&status_description=${encodeURI(
        'Your password has been updated successfully.'
      )}`
      );
    }

    redirect('/');
  };

  return (
    <div className="my-8">
      <form noValidate={true} className="mb-4">
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-md bg-zinc-800"
            />
            <label htmlFor="passwordConfirm">Confirm New Password</label>
            <input
              id="passwordConfirm"
              placeholder="Password"
              type="password"
              name="passwordConfirm"
              autoComplete="current-password"
              className="w-full p-3 rounded-md bg-zinc-800"
            />
          </div>
          <Button
            variant="slim"
            formAction={handlePasswordUpdate}
            className="mt-1"
          >
            Update Password
          </Button>
        </div>
      </form>
    </div>
  )
};