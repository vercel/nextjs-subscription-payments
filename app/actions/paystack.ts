// app/actions/paystack.ts
'use server';

import { createAdminClient } from '@/utils/supabase/admin';
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

    // Create a reference ID for this transaction
    const reference = `sub_${randomUUID()}`;

    // Use admin client for customer operations
    const adminClient = createAdminClient();

    // Check if customer exists
    const { data: customerData, error: customerError } = await adminClient
      .from('customers')
      .select('paystack_customer_id')
      .eq('id', user.id)
      .single();

    if (customerError && customerError.code !== 'PGRST116') {
      console.error('Error fetching customer:', customerError);
      throw new Error('Failed to check customer record.');
    }

    // If no customer exists, create one
    if (!customerData) {
      const { error: insertError } = await adminClient
        .from('customers')
        .insert([
          {
            id: user.id,
            paystack_customer_id: null // Will be updated by webhook
          }
        ]);

      if (insertError) {
        console.error('Error creating customer:', insertError);
        throw new Error('Failed to create customer record.');
      }
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
            callback_url: getURL(`${redirectPath}?reference=${reference}`),
            metadata: {
              user_id: user.id,
              price_id: price.id,
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
          })
        }
      );

      const data = await response.json();
      console.log('Paystack initialization response:', data);

      if (!data.status) {
        throw new Error(data.message);
      }

      return { authorizationUrl: data.data.authorization_url };
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
