// app/account/manage-subscription/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import Card from '@/components/ui/Card';
import { Database } from '@/types_db';
import ManageSubscriptionForm from '@/components/ui/AccountForms/ManageSubscriptionForm';

export default async function ManageSubscription() {
  const supabase = createServerComponentClient<Database>({
    cookies
  });

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect('/signin');
  }

  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .maybeSingle();

  if (subscriptionError) {
    console.error(subscriptionError);
  }

  if (!subscription) {
    return redirect('/pricing');
  }

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Manage Subscription
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Update your subscription preferences below.
          </p>
        </div>
        <div className="mt-12 space-y-4">
          {/* Current Plan Info */}
          <Card
            title={subscription.prices?.products?.name || 'Current Plan'}
            description={`You are currently on the ${subscription.prices?.interval}ly plan.`}
            footer={
              <div className="flex justify-between items-center">
                <span className="text-zinc-500">
                  Next billing date:{' '}
                  {new Date(
                    subscription.current_period_end
                  ).toLocaleDateString()}
                </span>
                <span className="font-semibold">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: subscription.prices?.currency || 'USD'
                  }).format((subscription.prices?.unit_amount || 0) / 100)}
                  /{subscription.prices?.interval}
                </span>
              </div>
            }
          >
            {/* You can add payment history here by querying your transactions table */}
            <div className="mt-8 space-y-4">
              <ManageSubscriptionForm subscription={subscription} />
            </div>
          </Card>

          {/* Payment History */}
          <Card
            title="Payment History"
            description="Your recent payments and upcoming charges."
          >
            <div className="mt-8 space-y-4">
              {/* You can add payment history here by querying your transactions table */}
            </div>
          </Card>

          {/* Additional Settings */}
          <Card
            title="Subscription Settings"
            description="Manage your subscription preferences."
          >
            <div className="mt-8 space-y-4">
              {/* Add settings like auto-renewal, email notifications, etc. */}
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
