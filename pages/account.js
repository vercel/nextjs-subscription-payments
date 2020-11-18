import Link from 'next/link';
import { useState, useEffect } from 'react';
import { postData } from '../utils/helpers';
import { supabase } from '../utils/initSupabase';
import { useAuth } from '../utils/useAuth';
import SignIn from '../components/SignIn';
import LoadingDots from '../components/LoadingDots';
import Button from '../components/Button';
import Text from '../components/Text';

const SignOut = () => (
  <Button variant="slim" onClick={() => supabase.auth.signOut()}>
    Sign Out
  </Button>
);

export default function Account() {
  const [subscriptions, setSubscriptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    async function getSubscriptions() {
      // Get the user's active subscription.
      setLoading(true);
      const { data: subscriptions } = await supabase
        .from('subscriptions')
        .select('*, prices(*, products(*))')
        .in('status', ['trialing', 'active']);
      setSubscriptions(subscriptions);
      setLoading(false);
    }
    if (user) getSubscriptions();
  }, [user]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    const { url } = await postData({
      url: '/api/createPortalLink',
      token: session.access_token
    });
    window.location.assign(url);
  };

  if (loading)
    return (
      <div className="m-6">
        <LoadingDots />
      </div>
    );

  if (user)
    return (
      <div className="m-6">
        <SignOut />
        <Text variant="pageHeading">My Account</Text>
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-8 pr-4">
            <div>
              <Text variant="sectionHeading">Email</Text>
              <span>{user.email}</span>
            </div>
            <div className="mt-5">
              <Text variant="sectionHeading">{`Subscription${
                subscriptions?.length > 1 ? 's' : ''
              }`}</Text>
              {subscriptions?.length >= 1 ? (
                subscriptions.map((subscription) => (
                  <p key={subscription.id}>{`${
                    subscription.prices.products.name
                  }: ${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: subscription.prices.currency
                  }).format(
                    (subscription.prices.unit_amount / 100).toFixed(2)
                  )} per ${subscription.prices.interval}.`}</p>
                ))
              ) : (
                <Link href="/pricing">
                  <a>See pricing</a>
                </Link>
              )}
            </div>
            <div className="mt-5">
              <Text variant="sectionHeading">Manage Subscription</Text>
              <p>
                View and download your invoices, change your subscription plan,
                or update your payment details:
              </p>
              <Button
                variant="slim"
                disabled={loading || !subscriptions}
                onClick={redirectToCustomerPortal}
              >
                Access the customer portal
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

  return <SignIn />;
}
