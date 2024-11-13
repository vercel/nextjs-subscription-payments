// app/api/sync-plans/route.ts
import { paystack } from '@/utils/paystack/config';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Verify secret token to prevent unauthorized access
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.SYNC_API_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    const supabase = createClient();

    // Fetch all plans from Paystack
    const { data: plans } = await paystack.listPlans({});
    console.log('Fetched plans from Paystack:', plans);

    for (const plan of plans.data) {
      // Create or update product
      const { data: product, error: productError } = await supabase
        .from('products')
        .upsert({
          id: plan.plan_code,
          active: true,
          name: plan.name,
          description: plan.description,
          metadata: {
            paystack_id: plan.id,
            features: plan.description?.split('\n') || []
          }
        })
        .select()
        .single();

      if (productError) {
        console.error('Error upserting product:', productError);
        continue;
      }

      // Create or update price
      const { error: priceError } = await supabase.from('prices').upsert({
        id: plan.plan_code,
        product_id: plan.plan_code,
        active: true,
        currency: plan.currency,
        type: 'recurring',
        unit_amount: plan.amount,
        interval:
          plan.interval === 'monthly'
            ? 'month'
            : plan.interval === 'annually'
              ? 'year'
              : plan.interval === 'weekly'
                ? 'week'
                : 'month',
        interval_count: 1,
        metadata: {
          paystack_id: plan.id
        }
      });

      if (priceError) {
        console.error('Error upserting price:', priceError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${plans.data.length} plans`
    });
  } catch (error) {
    console.error('Error syncing plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync plans' },
      { status: 500 }
    );
  }
}
