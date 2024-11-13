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
    // Get the user from Supabase auth
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error('Could not get user session.');
    }

    // Retrieve or create the customer in Paystack
    let customer: string;
    try {
      const customerResult = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });

      if (!customerResult) {
        throw new Error('Customer record is null.');
      }

      customer = customerResult;
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    // Initialize transaction with Paystack
    try {
      const response = await fetch(
        'https://api.paystack.co/transaction/initialize',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: user.email,
            amount: price.unit_amount, // Amount should be in kobo/cents
            plan: price.id, // This is your plan code in Paystack
            callback_url: getURL(
              `${redirectPath}?session_id={CHECKOUT_SESSION_ID}`
            ),
            metadata: {
              user_id: user.id,
              price_id: price.id
            }
          })
        }
      );

      const data = await response.json();

      if (!data.status) {
        throw new Error(data.message);
      }

      // Return the authorization URL where the customer will complete payment
      return { authorizationUrl: data.data.authorization_url };
    } catch (err) {
      console.error(err);
      throw new Error('Unable to initialize payment.');
    }
  } catch (error) {
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

export async function createPaystackPortal(currentPath: string) {
  try {
    const supabase = createClient();
    const {
      error,
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error('Could not get user session.');
    }

    // For Paystack, we'll need to create a custom management page
    // as they don't have a direct equivalent to Stripe's customer portal
    return getURL('/account/manage-subscription');
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        'Please try again later or contact a system administrator.'
      );
    } else {
      return getErrorRedirect(
        currentPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.'
      );
    }
  }
}
