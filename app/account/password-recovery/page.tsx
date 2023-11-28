import { createClient, getSession } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Card } from '../page';
import Button from '@/components/ui/Button';

export default async function ResetPassword() {
  const session = await getSession();

  if (!session) {
    return redirect('/signin');
  }

  const resetPassword = async (formData: FormData) => {
    'use server';
    const newPassword = formData.get('newPassword') as string;
    const newPasswordConfirm = formData.get('newPasswordConfirm') as string;
    //check that passwords are between 8 and 64 characters
    if (
      newPassword.length < 8 ||
      newPassword.length > 64 ||
      newPasswordConfirm.length < 8 ||
      newPasswordConfirm.length > 64
    ) {
      return redirect(
        `/account/password-recovery?error=${encodeURI(
          'Try again'
        )}&error_description=${encodeURI(
          'Your password must be between 8 and 64 characters.'
        )}`
      );
    }
    //check that passwords match
    if (newPassword !== newPasswordConfirm) {
      return redirect(
        `/account/password-recovery?error=${encodeURI(
          'Try again'
        )}&error_description=${encodeURI('Your passwords do not match.')}`
      );
    }
    //update password
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) {
      console.log(error);
      if (
        error.message ===
        'New password should be different from the old password.'
      ) {
        redirect(
          `/account/password-recovery?error=${encodeURI(
            'Try again'
          )}&error_description=${encodeURI(
            'New password should be different from the old password.'
          )}`
        );
      }
      redirect(
        `/account?error=${encodeURI(
          'Hmm... Something went wrong.'
        )}&error_description=${encodeURI(
          'Your password could not be updated.'
        )}`
      );
    }
    redirect(
      `/account?status=${encodeURI('Success!')}&status_description=${encodeURI(
        'Your password has been updated.'
      )}`
    );
  };

  return (
    <section className="mb-32 bg-black">
      <div className="p-4">
        <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">8 character minimum</p>
              <Button variant="slim" type="submit" form="nameForm">
                Update Password
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form
              id="nameForm"
              action={resetPassword}
              className="flex flex-col gap-y-4"
            >
              <input
                type="password"
                name="newPassword"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                placeholder="New password"
                maxLength={64}
                minLength={8}
              />
              <input
                type="password"
                name="newPasswordConfirm"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                placeholder="Confirm new password"
                maxLength={64}
                minLength={8}
              />
            </form>
          </div>
        </Card>
      </div>
    </section>
  );
}
