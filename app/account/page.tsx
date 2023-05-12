import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  createServerSupabaseClient,
  getSession,
  getUserDetails,
  getSubscription
} from '@/app/supabase-server';
import ManageSubscriptionButton from './ManageSubscriptionButton';
import Button from '@/components/ui/Button';
import { revalidatePath } from 'next/cache';

export default async function Account() {
  const supabase = createServerSupabaseClient();
  const session = await getSession();
  const user = session?.user;
  const userDetails = await getUserDetails();
  const subscription = await getSubscription();

  if (!session) {
    redirect('/signin');
  }

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  async function updateName(formData: FormData) {
    'use server';

    if (user) {
      await supabase
        .from('users')
        .update({
          full_name: formData.get('name')?.toString()
        })
        .eq('id', user.id);
    }
    revalidatePath('/account');
  }

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 pt-8 pb-8 mx-auto sm:pt-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
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
          footer={<ManageSubscriptionButton session={session} />}
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {subscription ? (
              `${subscriptionPrice}/$
            {subscription?.prices?.interval}`
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
              <Button variant="slim" type="submit" form="name">
                Update Name
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="nameForm">
              <input
                type="text"
                id="name"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                defaultValue={userDetails?.full_name}
                placeholder="Your name"
                maxLength={64}
                formAction={updateName}
              />
            </form>
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className="mt-8 mb-4 text-xl font-semibold">
            {user ? user.email : undefined}
          </p>
        </Card>
      </div>
    </section>
  );
}

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md border-zinc-700 p">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="p-4 border-t border-zinc-700 bg-zinc-900 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}
