// app/api/webhooks/route.ts
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import crypto from 'crypto';

// Validate Paystack webhook signature
function validatePaystackWebhook(
  requestBody: string,
  paystackSignature: string
): boolean {
  try {
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error('PAYSTACK_SECRET_KEY is not set');
      return false;
    }

    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(requestBody)
      .digest('hex');

    return hash === paystackSignature;
  } catch (error) {
    console.error('Error validating webhook signature:', error);
    return false;
  }
}

const relevantEvents = new Set([
  'subscription.create',
  'subscription.disable',
  'subscription.enable',
  'plan.create',
  'plan.update',
  'charge.success'
]);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature') as string;

  try {
    if (!signature) {
      console.error('No Paystack signature found in headers');
      return new Response('No signature found.', { status: 400 });
    }

    // Validate webhook signature
    if (!validatePaystackWebhook(body, signature)) {
      console.error('Invalid Paystack signature');
      return new Response('Invalid signature.', { status: 400 });
    }

    const event = JSON.parse(body);
    console.log(`🔔 Webhook received: ${event.event}`);
    console.log('Event data:', JSON.stringify(event.data, null, 2));

    if (relevantEvents.has(event.event)) {
      try {
        // Create a Supabase client that works with Route Handlers
        const supabase = createRouteHandlerClient<Database>({ cookies });

        switch (event.event) {
          case 'plan.create':
          case 'plan.update':
            console.log('Processing plan create/update:', event.data.name);
            // Handle plan creation/update
            await supabase.from('products').upsert({
              id: event.data.plan_code,
              name: event.data.name,
              description: event.data.description,
              active: true,
              metadata: {
                paystack_id: event.data.id,
                integration: event.data.integration,
                features: event.data.description?.split('\n') || []
              }
            });

            await supabase.from('prices').upsert({
              id: event.data.plan_code,
              product_id: event.data.plan_code,
              active: true,
              currency: event.data.currency,
              type: 'recurring',
              unit_amount: event.data.amount,
              interval:
                event.data.interval === 'annually'
                  ? 'year'
                  : event.data.interval.replace('ly', ''),
              interval_count: 1,
              metadata: {
                paystack_id: event.data.id,
                integration: event.data.integration
              }
            });
            console.log('Plan synced successfully');
            break;

          case 'subscription.create':
            console.log(
              'Processing subscription create:',
              event.data.subscription_code
            );
            // Get customer data
            const { data: customerData } = await supabase
              .from('customers')
              .select('id')
              .eq('paystack_customer_id', event.data.customer.customer_code)
              .single();

            if (!customerData) {
              console.error(
                'Customer not found:',
                event.data.customer.customer_code
              );
              throw new Error('Customer not found');
            }

            await supabase.from('subscriptions').upsert({
              id: event.data.subscription_code,
              user_id: customerData.id,
              status: 'active',
              metadata: {
                paystack_status: event.data.status,
                paystack_subscription_id: event.data.id
              },
              price_id: event.data.plan.plan_code,
              quantity: 1,
              cancel_at_period_end: false,
              created: new Date(event.data.createdAt).toISOString(),
              current_period_start: new Date(
                event.data.current_period_start
              ).toISOString(),
              current_period_end: new Date(
                event.data.current_period_end
              ).toISOString()
            });
            console.log('Subscription created successfully');
            break;

          case 'subscription.disable':
            console.log(
              'Processing subscription disable:',
              event.data.subscription_code
            );
            await supabase
              .from('subscriptions')
              .update({
                status: 'canceled',
                metadata: {
                  paystack_status: 'canceled',
                  canceled_reason: event.data.reason
                },
                canceled_at: new Date().toISOString()
              })
              .eq('id', event.data.subscription_code);
            console.log('Subscription disabled successfully');
            break;

          case 'subscription.enable':
            console.log(
              'Processing subscription enable:',
              event.data.subscription_code
            );
            await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                metadata: {
                  paystack_status: 'active'
                }
              })
              .eq('id', event.data.subscription_code);
            console.log('Subscription enabled successfully');
            break;

          case 'charge.success':
            console.log('Processing charge success');
            if (event.data.plan) {
              await supabase
                .from('subscriptions')
                .update({
                  status: 'active',
                  current_period_end: new Date(
                    event.data.paid_at * 1000 +
                      event.data.plan.interval * 86400000
                  ).toISOString()
                })
                .eq('price_id', event.data.plan.plan_code)
                .eq('user_id', event.data.metadata.user_id);
              console.log('Charge processed successfully');
            }
            break;

          default:
            console.log(`🤷‍♂️ Unhandled event type: ${event.event}`);
        }
      } catch (error) {
        console.error('❌ Webhook handler failed:', error);
        return new Response(
          'Webhook handler failed. View your Next.js function logs.',
          { status: 400 }
        );
      }
    }

    return new Response(JSON.stringify({ received: true }));
  } catch (err) {
    if (err instanceof Error) {
      console.error(`❌ Error message: ${err.message}`);
    } else {
      console.error('❌ Unknown error occurred');
    }
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }
}
