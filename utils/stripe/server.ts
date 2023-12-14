'use server';

import Stripe from 'stripe';
import { stripe } from '@/utils/stripe/config';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { createOrRetrieveCustomer } from '@/utils/supabase/admin';
import { getURL, calculateTrialEndUnixTimestamp } from '@/utils/helpers';
import { Tables } from '@/types_db';

type Price = Tables<'prices'>;

export async function stripeCheckout(price: Price, redirectPath: string) {
  // Get the user from Supabase auth
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error, data: { user } } = await supabase.auth.getUser();

  if (error) {
      throw new Error(error.message);
  } else if (!user) {
    throw new Error('Could not get user session.');
  }

  // Retrieve or create the customer in Stripe
  let customer: string;
  try {
    customer = await createOrRetrieveCustomer({
      uuid: user?.id || '',
      email: user?.email || ''
    });
  } catch {
    throw new Error('Unable to access customer record.');
  }

  let params: Stripe.Checkout.SessionCreateParams = {
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    customer,
    customer_update: {
      address: 'auto'
    },
    line_items: [
      {
        price: price.id,
        quantity: 1,
      }
    ],
    cancel_url: getURL(),
    success_url: getURL('/account')
  }

  if (price.type === 'recurring') {
    params = {
      ...params,
      mode: 'subscription',
      subscription_data: {
        trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days)
      }
    }
  } else if (price.type === 'one_time') {
    params = {
      ...params,
      mode: 'payment'
    }
  }

  // Create a checkout session in Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.create(params);
  } catch {
    throw new Error('Unable to create checkout session.');
  }

  // Instead of returning a Response, just return the data or error.
  if (session) {
    return session.id;
  } else {
    throw new Error('Unable to create checkout session.');
  }
}