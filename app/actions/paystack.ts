// app/actions/paystack.ts
'use server';

import { paystack } from '@/utils/paystack/config';
import { createClient } from '@/utils/supabase/server';
import { createOrRetrieveCustomer } from '@/utils/supabase/admin';
import { getURL, getErrorRedirect } from '@/utils/helpers';
import { Tables } from '@/types_db';

type Price = Tables<'prices'>;

type CheckoutResponse = {
  errorRedirect?: string;
  authorizationUrl?: string;
};

export async function checkoutWithPaystack(
  price: Price,
  redirectPath: string = '/account'
): Promise<CheckoutResponse> {
  try {
    // Log incoming price data
    console.log('Incoming price data:', JSON.stringify(price, null, 2));

    // Get the user from Supabase auth
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error('Auth error:', error);
      throw new Error('Could not get user session.');
    }

    // Initialize transaction with Paystack directly without plan
    try {
      console.log('Initializing Paystack transaction');

      // Format amount - ensure it's in the smallest currency unit
      const amount = price.unit_amount || 0;
      console.log('Amount:', amount);

      const callbackUrl = getURL(
        `${redirectPath}?session_id={CHECKOUT_SESSION_ID}`
      );
      console.log('Callback URL:', callbackUrl);

      // Initialize transaction without a plan, just a one-time payment
      const response = await paystack.initializeTransaction({
        email: user.email!,
        amount: amount,
        callback_url: callbackUrl,
        metadata: {
          user_id: user.id,
          price_id: price.id,
          product_id: price.product_id,
          interval: price.interval,
          currency: price.currency
        }
      });

      console.log('Paystack initialization response:', response);

      if (!response.data?.authorization_url) {
        throw new Error('No authorization URL received from Paystack');
      }

      return { authorizationUrl: response.data.authorization_url };
    } catch (err: any) {
      console.error('Paystack initialization error:', err);
      console.error('Error response:', err.response?.data);
      throw new Error(
        err.response?.data?.message || 'Unable to initialize payment.'
      );
    }
  } catch (error) {
    console.error('Checkout error:', error);
    if (error instanceof Error) {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          error.message,
          'Please try again later or contact a system administrator.'
        )
      };
    } else {
      return {
        errorRedirect: getErrorRedirect(
          redirectPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      };
    }
  }
}
