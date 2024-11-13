// app/account/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Card from '@/components/ui/Card';
import AccountForm from '@/components/ui/AccountForms/AccountForm';
import ManageSubscriptionForm from '@/components/ui/AccountForms/ManageSubscriptionForm';

export default async function Account() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect('/signin');
  }

  // Get user details from Supabase
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Get active subscription
  const { data: subscription, error: subscriptionError } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing'])
    .maybeSingle();

  if (subscriptionError) {
    console.error('Error fetching subscription:', subscriptionError);
  }

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Manage your account and subscription here.
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Account Details Card */}
          <Card
            title="Account Details"
            description="Update your account information."
          >
            <div className="mt-8 mb-4 space-y-4">
              <AccountForm user={userData} subscription={subscription} />
            </div>
          </Card>

          {/* Subscription Management */}
          {subscription ? (
            <Card
              title="Subscription Plan"
              description="Manage your subscription here."
              footer={
                <div className="text-sm">
                  For any billing issues, please contact support.
                </div>
              }
            >
              <div className="mt-8 mb-4">
                <ManageSubscriptionForm subscription={subscription} />
              </div>
            </Card>
          ) : (
            <Card
              title="No Active Subscription"
              description="Choose a plan to get started."
              footer={
                <div className="text-sm">
                  View our pricing plans to subscribe.
                </div>
              }
            >
              <div className="mt-8 mb-4">
                <a
                  href="/pricing"
                  className="text-blue-500 hover:text-blue-600"
                >
                  View Pricing Plans →
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
