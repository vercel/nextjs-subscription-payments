// app/api/subscription/cancel/route.ts
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return new NextResponse(
        JSON.stringify({
          error: 'subscriptionId is required'
        }),
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Get current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new NextResponse(
        JSON.stringify({
          error: 'Unauthorized'
        }),
        { status: 401 }
      );
    }

    // Get subscription details
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*, prices(*)')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      return new NextResponse(
        JSON.stringify({
          error: 'Subscription not found'
        }),
        { status: 404 }
      );
    }

    // Make request to Paystack to cancel subscription
    const response = await fetch(
      `https://api.paystack.co/subscription/disable`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: subscription.id,
          token: (subscription.metadata as { email_token?: string })
            ?.email_token // This should be stored in metadata during subscription creation
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel subscription');
    }

    // Update subscription status in database
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        cancel_at_period_end: true,
        canceled_at: new Date().toISOString(),
        metadata: {
          ...(subscription.metadata as Record<string, unknown>),
          paystack_status: 'canceled'
        }
      })
      .eq('id', subscriptionId);

    if (updateError) {
      throw updateError;
    }

    return new NextResponse(
      JSON.stringify({
        message: 'Subscription cancelled successfully'
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { status: 500 }
    );
  }
}
