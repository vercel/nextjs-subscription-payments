import Link from 'next/link';
import { useState, useEffect } from 'react';
import { postData } from '../utils/helpers';
import { supabase } from '../utils/initSupabase';
import { useAuth } from '../utils/useAuth';
import LoadingDots from '../components/LoadingDots';
import Button from '../components/Button';
import Text from '../components/Text';

export default function Account() {
  const [userDetails, setUserDetails] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth({ redirectTo: '/signin' });

  // Get the user details.
  const getUserDetails = () => supabase.from('users').select('*').single();

  // Get the user's active subscriptions.
  const getSubscriptions = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active']);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.allSettled([getUserDetails(), getSubscriptions()]).then(
        (results) => {
          setUserDetails(results[0].value.data);
          setSubscriptions(results[1].value.data);
          setLoading(false);
        }
      );
    }
  }, [user]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    const { url } = await postData({
      url: '/api/createPortalLink',
      token: session.access_token
    });
    window.location.assign(url);
  };

  if (user)
    return (
      <div className="m-6">
        <Button
          variant="slim"
          loading={loading}
          onClick={() => {
            setLoading(true);
            supabase.auth.signOut();
          }}
        >
          Sign Out
        </Button>
        <Text variant="pageHeading">My Account</Text>
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-8 pr-4">
            <div>
              <Text variant="sectionHeading">Name</Text>
              <span>
                {userDetails ? (
                  `${userDetails.first_name} ${userDetails.last_name}`
                ) : (
                  <div className="m-6">
                    <LoadingDots />
                  </div>
                )}
              </span>
            </div>
            <div className="mt-5">
              <Text variant="sectionHeading">Email</Text>
              <span>{user.email}</span>
            </div>
            <div className="mt-5">
              <Text variant="sectionHeading">Billing address</Text>
              {userDetails?.billing_address ? (
                <span>
                  <p>{userDetails.billing_address.line1}</p>
                  {userDetails.billing_address.line2 ? (
                    <p>{userDetails.billing_address.line2}</p>
                  ) : (
                    ''
                  )}
                  <p>
                    {userDetails.billing_address.city ??
                      userDetails.billing_address.country}
                  </p>
                  <p>{`${
                    userDetails.billing_address.state ??
                    userDetails.billing_address.country
                  } ${userDetails.billing_address.postal_code}`}</p>
                </span>
              ) : (
                ''
              )}
            </div>
            <div className="mt-5">
              <Text variant="sectionHeading">Card</Text>
              {userDetails?.payment_method ? (
                <span>
                  {`${userDetails.payment_method.brand} ****${userDetails.payment_method.last4}`}
                </span>
              ) : (
                ''
              )}
            </div>
            <div className="mt-5">
              <Text variant="sectionHeading">{`Subscription${
                subscriptions?.length > 1 ? 's' : ''
              }`}</Text>
              {loading ? (
                <div className="m-6">
                  <LoadingDots />
                </div>
              ) : subscriptions?.length >= 1 ? (
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
                <Link href="/">
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
                disabled={loading || !subscriptions?.length}
                onClick={redirectToCustomerPortal}
              >
                Access the customer portal
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
}
