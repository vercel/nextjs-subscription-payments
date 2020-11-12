import { useState, useEffect } from 'react';
import { postData } from '../utils/helpers';
import { supabase } from '../utils/initSupabase';
import { getStripe } from '../utils/initStripejs';
import { useAuth } from '../utils/useAuth';
import Pricing from './Pricing';

export default function Account() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    async function getSubscription() {
      // Get the user's active subscription.
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*, prices(*, products(*))')
        .in('status', ['trialing', 'active'])
        .single();
      setSubscription(subscription);
      setLoading(false);
    }
    getSubscription();
  }, []);

  const redirectToCustomerPortal = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { url } = await postData({
      url: '/api/createPortalLink',
      token: session.access_token,
    });
    window.location.assign(url);
  };

  if (!loading && !subscription) return <Pricing />;

  if (subscription)
    return (
      <div>
        <p>{`You're subscribed to the ${
          subscription.prices.products.name
        } pricing plan, paying ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: subscription.prices.currency,
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

  return <p>Loading...</p>;
}
