import { useState, useEffect } from 'react';
import { postData } from '../utils/helpers';
import { supabase } from '../utils/initSupabase';
import { useAuth } from '../utils/useAuth';
import SignIn from '../components/SignIn';
import LoadingDots from '../components/LoadingDots';
import Button from '../components/Button/Button';

const SignOut = () => (
  <Button variant="slim" onClick={() => supabase.auth.signOut()}>
    Sign Out
  </Button>
);

export default function Account() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();

  useEffect(() => {
    async function getSubscription() {
      // Get the user's active subscription.
      setLoading(true);
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*, prices(*, products(*))')
        .in('status', ['trialing', 'active'])
        .single();
      setSubscription(subscription);
      setLoading(false);
    }
    if (user) getSubscription();
  }, [user]);

  const redirectToCustomerPortal = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { url } = await postData({
      url: '/api/createPortalLink',
      token: session.access_token
    });
    window.location.assign(url);
  };

  if (!user || (!loading && !subscription))
    return user ? (
      <div className="m-6">
        <SignOut />
      </div>
    ) : (
      <SignIn />
    );

  if (user && subscription)
    return (
      <div>
        <SignOut />
        <p>{`You're subscribed to the ${
          subscription.prices.products.name
        } pricing plan, paying ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: subscription.prices.currency
        }).format((subscription.prices.unit_amount / 100).toFixed(2))} per ${
          subscription.prices.interval
        }, giving you the access role: ${
          subscription.prices.products.access_role
        }. 🥳`}</p>
        <button
          disabled={loading}
          onClick={redirectToCustomerPortal}
        >{`Access the customer portal`}</button>
      </div>
    );

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
}
