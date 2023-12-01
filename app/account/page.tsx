import ManageSubscriptionButton from './ManageSubscriptionButton';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function Account() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { data: userDetails } = await supabase
    .from('users')
    .select('*')
    .single();

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .in('status', ['trialing', 'active'])
    .maybeSingle();

  if (error) {
    console.log(error);
  }

  if (!user) {
    return redirect('/signin');
  }

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const updateName = async (formData: FormData) => {
    'use server';

    const newName = formData.get('name') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return redirect('/signin');

    const { error } = await supabase
      .from('users')
      .update({ full_name: newName })
      .eq('id', user.id);

    if (error) {
      return redirect(
        `/account?error=${encodeURI(
          'Hmm... Something went wrong.'
        )}&error_description=${encodeURI('Your name could not be updated.')}`
      );
    }

    return redirect(
      `/account?status=${encodeURI('Success!')}&status_description=${encodeURI(
        'Your name has been updated.'
      )}`
    );
  };

  const updateEmail = async (formData: FormData) => {
    'use server';

    const newEmail = formData.get('email') as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_SITE_URL +
          `/account?status=${encodeURI(
            'Success!'
          )}&status_description=${encodeURI(
            `Your email has been successfully updated to ${newEmail}`
          )}`
      }
    );

    if (error) {
      if (
        error.message ===
        'A user with this email address has already been registered'
      ) {
        return redirect(
          `/account?error=${encodeURI('Oops!')}&error_description=${encodeURI(
            'It looks like that email is already in use. Please try another one.'
          )}`
        );
      }

      return redirect(
        `/account?error=${encodeURI(
          'Hmm... Something went wrong.'
        )}&error_description=${encodeURI('Your email could not be updated.')}`
      );
    }

    return redirect(
      `/account?status=${encodeURI(
        'Confirmation Emails Sent'
      )}&error_description=${encodeURI(
        `You will need to confirm the update by clicking the link sent to both ${user?.email} and ${newEmail}.`
      )}`
    );
  };

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : 'You are not currently subscribed to any plan.'
          }
          footer={<ManageSubscriptionButton user={user} />}
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href="/">Choose your plan</Link>
            )}
          </div>
        </Card>
        <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">64 characters maximum</p>
              <Button variant="slim" type="submit" form="nameForm">
                Update Name
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="nameForm" action={updateName}>
              <input
                type="text"
                name="name"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                defaultValue={userDetails?.full_name ?? ''}
                placeholder="Your name"
                maxLength={64}
              />
            </form>
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                We will email you to verify the change.
              </p>
              <Button variant="slim" type="submit" form="emailForm">
                Update Email
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="emailForm" action={updateEmail}>
              <input
                type="text"
                name="email"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                defaultValue={user ? user.email : ''}
                placeholder="Your email"
                maxLength={64}
              />
            </form>
          </div>
        </Card>
      </div>
    </section>
  );
}
