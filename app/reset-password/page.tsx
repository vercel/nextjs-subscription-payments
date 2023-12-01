import { createClient, getSession } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Define the main function for resetting the password
export default async function ResetPassword() {
  // Try to get the current user session
  const session = await getSession();

  // Redirect to the sign-in page if no session is found (i.e., user is not logged in)
  if (!session) {
    return redirect('/signin');
  }

  // Define the function to handle password reset
  const resetPassword = async (formData: FormData) => {
    // Enforce server-side execution for security
    'use server';
    
    // Extract new password and its confirmation from the form data
    const newPassword = formData.get('newPassword') as string;
    const newPasswordConfirm = formData.get('newPasswordConfirm') as string;
    
    // Check that new passwords is between 8 and 64 characters
    if (
      newPassword.length < 8 ||
      newPassword.length > 64
    ) {
      // Redirect with an error message if the requirements are not met
      return redirect(
        `/account/password-recovery?error=${encodeURI(
          'Try again'
        )}&error_description=${encodeURI(
          'Your password must be between 8 and 64 characters.'
        )}`
      );
    }
    
    // Ensure that the new password and its confirmation match
    if (newPassword !== newPasswordConfirm) {
      // Redirect with an error message if the passwords do not match
      return redirect(
        `/account/password-recovery?error=${encodeURI(
          'Try again'
        )}&error_description=${encodeURI('Your passwords do not match.')}`
      );
    }
    
    // Update the password in the auth table of the database
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    // Handle errors during the password update
    if (error) {
      console.log(error);
      // Check for a specific error (same new and old password)
      if (
        error.message ===
        'New password should be different from the old password.'
      ) {
        // Redirect with an appropriate error message
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
    
    // Redirect to the account page with a success message upon successful password update
    redirect(
      `/account?status=${encodeURI('Success!')}&status_description=${encodeURI(
        'Your password has been updated.'
      )}`
    );
  };

  // Render the password reset form
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
            {/* Form for the new password and its confirmation */}
            <form
              id="nameForm"
              action={resetPassword}
              className="flex flex-col gap-y-4"
            >
              {/* Input field for the new password */}
              <input
                type="password"
                name="newPassword"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                placeholder="New password"
                maxLength={64}
                minLength={8}
              />
              {/* Input field for confirming the new password */}
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