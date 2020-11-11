import { useState, useEffect } from 'react';
import { postData } from '../utils/helpers';
import { supabase } from '../utils/initSupabase';
import { getStripe } from '../utils/initStripejs';
import { useAuth } from '../utils/useAuth';
import Pricing from './Pricing';

export default function Account() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();

  useEffect(() => {
    async function getSubscription() {
      // Get the user's active subscription.
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('*')
        .in('status', ['trialing', 'active'])
        .single();
      if (error) return;
      setSubscription(subscription);
    }
    getSubscription();
  }, []);

  const redirectToCustomerPortal = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const price = formData.get('price');
    const { sessionId } = await postData({
      url: '/api/createCheckoutSession',
      data: { price },
      token: session.access_token,
    });
    const stripe = await getStripe();
    const { error } = stripe.redirectToCheckout({ sessionId });
    if (error) alert(error.message);
    setLoading(false);
  };

  if (!subscription) return <Pricing />;

  return <pre>{JSON.stringify(subscription, null, 2)}</pre>;
}
