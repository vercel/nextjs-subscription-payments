// app/api/checkout/callback/route.ts
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

// This ensures the API is opted out of static generation
export const runtime = 'edge';

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
      return NextResponse.redirect(
        new URL('/pricing?error=missing_reference', baseUrl)
      );
    }

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

    if (!verifyData.status || verifyData.data.status !== 'success') {
      return NextResponse.redirect(
        new URL(
          `/pricing?error=payment_failed&message=${verifyData.message}`,
          baseUrl
        )
      );
    }

    // Get metadata from transaction
    const { metadata } = verifyData.data;
    const { user_id, price_id } = metadata;

    if (!user_id || !price_id) {
      return NextResponse.redirect(
        new URL('/pricing?error=missing_metadata', baseUrl)
      );
    }

    const supabase = createAdminClient();

    // Update customer record with Paystack customer code
    await supabase
      .from('customers')
      .update({
        paystack_customer_id: verifyData.data.customer.customer_code
      })
      .eq('id', user_id);

    // Create subscription record
    if (verifyData.data.plan) {
      const subscriptionData = {
        id: reference,
        user_id,
        status: 'active' as const,
        price_id,
        quantity: 1,
        cancel_at_period_end: false,
        created: new Date().toISOString(),
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        metadata: {
          paystack_reference: reference,
          paystack_customer_code: verifyData.data.customer.customer_code,
          paystack_plan_code: verifyData.data.plan.plan_code
        }
      };

      await supabase.from('subscriptions').upsert(subscriptionData);
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
