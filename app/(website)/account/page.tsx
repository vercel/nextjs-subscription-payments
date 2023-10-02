import ManageSubscriptionButton from './ManageSubscriptionButton';
import ManageDownloadButton from './ManageDownloadButton';
import {
  getSession,
  getUserDetails,
  getSubscription
} from '@/app/supabase-server';
import Button from '@/components/ui/Button/Button';
import { Database } from '@/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Account() {
  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription()
  ]);

  const user = session?.user;

  if (!session) {
    return redirect('/signin');
  }

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

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
          title={`Hello ${userDetails?.full_name ?? ''}`}
          description={
            subscription
              ? `Active until ${subscription?.current_period_end}.`
              : 'You are not currently subscribed to any plan.'
          }
          footer={<ManageSubscriptionButton session={session} />}
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href="/#pricing"><span className='underline'>Choose your plan</span></Link>
            )}
          </div>
        </Card>
        <Card
          title="Download Henshu Bot"
          description={subscription ? "Get your new best friend." : "Subscribe to any plan to get access"}
          footer={<ManageDownloadButton session={session} sub={subscription} />}
        >
        </Card>
        <Card
          title="Download Browser Extension"
          description="Browser extensions will make it easier to create your lists."
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <Button
                variant="slim"
                type="button"
                disabled={subscription ? false : true}
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Chrome
              </Button>
              <Button
                variant="slim"
                type="button"
                disabled={subscription ? false : true}
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Firefox
              </Button>
              <Button
                variant="slim"
                type="button"
                disabled={subscription ? false : true}
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Opera
              </Button>
              <Button
                variant="slim"
                type="button"
                disabled={subscription ? false : true}
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Safari
              </Button>
              <Button
                variant="slim"
                type="button"
                disabled={subscription ? false : true}
              >
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Edge
              </Button>
            </div>
          }
        >
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
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}
