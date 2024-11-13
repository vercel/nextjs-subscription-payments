// utils/paystack/subscription.ts
import { createClient } from '@/utils/supabase/server';

export async function disableSubscription(
  subscriptionCode: string,
  emailToken: string
) {
  try {
    const response = await fetch(
      `https://api.paystack.co/subscription/disable`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: subscriptionCode,
          token: emailToken
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to disable subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error disabling subscription:', error);
    throw error;
  }
}

export async function enableSubscription(
  subscriptionCode: string,
  emailToken: string
) {
  try {
    const response = await fetch(
      `https://api.paystack.co/subscription/enable`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: subscriptionCode,
          token: emailToken
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to enable subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error enabling subscription:', error);
    throw error;
  }
}

export async function getSubscription(subscriptionCode: string) {
  try {
    const response = await fetch(
      `https://api.paystack.co/subscription/${subscriptionCode}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch subscription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
}

export async function updateSubscriptionInDatabase(
  subscriptionId: string,
  data: any
) {
  const supabase = createClient();
  const { error } = await supabase
    .from('subscriptions')
    .update(data)
    .eq('id', subscriptionId);

  if (error) {
    throw error;
  }
}

export async function getSubscriptionByUserId(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Helper function to update subscription status after payment
export async function handleSuccessfulPayment(
  subscriptionCode: string,
  userId: string
) {
  const supabase = createClient();

  try {
    // Get subscription details from Paystack
    const subscriptionData = await getSubscription(subscriptionCode);

    // Update subscription in database
    await updateSubscriptionInDatabase(subscriptionCode, {
      status: 'active',
      current_period_start: new Date(
        subscriptionData.data.current_period_start
      ).toISOString(),
      current_period_end: new Date(
        subscriptionData.data.current_period_end
      ).toISOString(),
      metadata: {
        paystack_status: 'active',
        last_payment_date: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error handling successful payment:', error);
    throw error;
  }
}
