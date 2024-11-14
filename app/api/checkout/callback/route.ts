// app/api/checkout/callback/route.ts
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const headersList = headers();
    const domain = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${domain}`;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');

    if (!reference) {
      console.error('Missing reference');
      return NextResponse.redirect(
        new URL('/pricing?error=missing_reference', baseUrl)
      );
    }

    console.log('Verifying transaction:', reference);

    // Verify transaction with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const verifyData = await verifyResponse.json();
    console.log('Verification response:', JSON.stringify(verifyData, null, 2));

    if (!verifyData.status || verifyData.data?.status !== 'success') {
      console.error('Payment verification failed:', verifyData);
      return NextResponse.redirect(
        new URL(
          `/pricing?error=payment_failed&message=${verifyData.message}`,
          baseUrl
        )
      );
    }

    // Get metadata from transaction
    const { metadata } = verifyData.data;
    console.log('Transaction metadata:', metadata);

    if (!metadata?.user_id || !metadata?.price_id) {
      console.error('Missing metadata:', metadata);
      return NextResponse.redirect(
        new URL('/pricing?error=missing_metadata', baseUrl)
      );
    }

    const supabase = createAdminClient();

    // Update customer record
    const { error: customerError } = await supabase.from('customers').upsert({
      id: metadata.user_id,
      paystack_customer_id: verifyData.data.customer.customer_code
    });

    if (customerError) {
      console.error('Error updating customer:', customerError);
      throw new Error('Failed to update customer record');
    }

    // Create subscription record
    const subscriptionData = {
      id: reference,
      user_id: metadata.user_id,
      status: 'active' as const,
      price_id: metadata.price_id,
      quantity: 1,
      cancel_at_period_end: false,
      created: new Date().toISOString(),
      current_period_start: new Date().toISOString(),
      // Set period end to 30 days from now for monthly, 365 for yearly
      current_period_end: new Date(
        Date.now() +
          (verifyData.data.plan?.interval === 'annually' ? 365 : 30) *
            24 *
            60 *
            60 *
            1000
      ).toISOString(),
      metadata: {
        paystack_reference: reference,
        paystack_customer_code: verifyData.data.customer.customer_code,
        paystack_plan_code: verifyData.data.plan?.plan_code,
        paystack_subscription_code:
          verifyData.data.authorization?.authorization_code
      }
    };

    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert([subscriptionData]);

    if (subscriptionError) {
      console.error('Error creating subscription:', subscriptionError);
      throw new Error('Failed to create subscription record');
    }

    // Create subscription in Paystack
    if (verifyData.data.plan) {
      try {
        const subscriptionResponse = await fetch(
          'https://api.paystack.co/subscription',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              customer: verifyData.data.customer.customer_code,
              plan: verifyData.data.plan.plan_code,
              authorization: verifyData.data.authorization.authorization_code
            })
          }
        );

        const subscriptionResult = await subscriptionResponse.json();
        console.log('Paystack subscription created:', subscriptionResult);

        // Update subscription with Paystack subscription code
        if (subscriptionResult.status) {
          await supabase
            .from('subscriptions')
            .update({
              metadata: {
                ...subscriptionData.metadata,
                paystack_subscription_code:
                  subscriptionResult.data.subscription_code
              }
            })
            .eq('id', reference);
        }
      } catch (error) {
        console.error('Error creating Paystack subscription:', error);
        // Continue anyway as payment was successful
      }
    }

    // Redirect to success page
    return NextResponse.redirect(new URL('/account', baseUrl));
  } catch (error) {
    console.error('Callback error:', error);
    const headersList = headers();
    const domain = headersList.get('host') || '';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${domain}`;

    return NextResponse.redirect(
      new URL(
        '/pricing?error=server_error&message=Something+went+wrong',
        baseUrl
      )
    );
  }
}
