// app/actions/paystack.ts
'use server';

import { paystack } from '@/utils/paystack/config';
import { createClient } from '@/utils/supabase/server';
import { getURL, getErrorRedirect } from '@/utils/helpers';
import { Tables } from '@/types_db';
import { randomUUID } from 'crypto';

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

    // Create a unique reference
    const reference = `sub_${randomUUID()}`;

    // Initialize transaction with Paystack
    try {
      const callback_url = getURL(
        `${redirectPath}?session_id={CHECKOUT_SESSION_ID}`
      );
      console.log('Initializing Paystack transaction:', {
        email: user.email,
        amount: price.unit_amount,
        plan: price.id,
        callback_url
      });

      const response = await paystack.initializeTransaction({
        email: user.email!,
        amount: price.unit_amount!, // Amount should be in kobo/cents
        plan: price.id, // Your plan code in Paystack
        callback_url,
        metadata: {
          user_id: user.id,
          price_id: price.id,
          product_id: price.product_id,
          reference,
          custom_fields: [
            {
              display_name: 'User ID',
              variable_name: 'user_id',
              value: user.id
            },
            {
              display_name: 'Price ID',
              variable_name: 'price_id',
              value: price.id
            }
          ]
        }
      });

      console.log('Paystack response:', response);

      // Create a temporary customer record if it doesn't exist
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select()
        .eq('id', user.id)
        .single();

      if (!existingCustomer) {
        await supabase.from('customers').insert({
          id: user.id,
          paystack_customer_id: null // Will be updated by webhook
        });
      }

      return { authorizationUrl: response.data.authorization_url };
    } catch (err) {
      console.error('Paystack initialization error:', err);
      throw new Error('Unable to initialize payment.');
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
