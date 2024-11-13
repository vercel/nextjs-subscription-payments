// app/api/webhooks/route.ts
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types_db';
import crypto from 'crypto';

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
  'charge.success',
  'transfer.success',
  'transfer.failed',
  'customer.created'
]);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature') as string;

  try {
    if (!signature) {
      console.error('No Paystack signature found');
      return new Response('No signature found.', { status: 400 });
    }

    if (!validatePaystackWebhook(body, signature)) {
      console.error('Invalid Paystack signature');
      return new Response('Invalid signature.', { status: 400 });
    }

    const event = JSON.parse(body);
    console.log(`🔔 Webhook received: ${event.event}`);
    console.log('Event data:', JSON.stringify(event.data, null, 2));

    const supabase = createRouteHandlerClient<Database>({ cookies });

    if (relevantEvents.has(event.event)) {
      try {
        switch (event.event) {
          case 'customer.created':
            console.log(
              'Creating/updating customer:',
              event.data.customer_code
            );
            // Upsert customer record
            await supabase.from('customers').upsert({
              id: event.data.metadata.user_id,
              paystack_customer_id: event.data.customer_code
            });
            break;

          case 'subscription.create':
            console.log('Creating subscription:', event.data.subscription_code);
            // Ensure customer exists
            const { data: customerData } = await supabase
              .from('customers')
              .select('id')
              .eq('paystack_customer_id', event.data.customer.customer_code)
              .single();

            if (!customerData) {
              console.log('Customer not found, creating...');
              // Create customer record if it doesn't exist
              await supabase.from('customers').insert({
                id: event.data.metadata.user_id,
                paystack_customer_id: event.data.customer.customer_code
              });
            }

            // Create subscription
            await supabase.from('subscriptions').upsert({
              id: event.data.subscription_code,
              user_id: event.data.metadata.user_id,
              status: 'active',
              price_id: event.data.plan.plan_code,
              quantity: 1,
              cancel_at_period_end: false,
              created: new Date(event.data.createdAt).toISOString(),
              current_period_start: new Date(
                event.data.current_period_start
              ).toISOString(),
              current_period_end: new Date(
                event.data.current_period_end
              ).toISOString(),
              metadata: {
                paystack_subscription_id: event.data.id,
                paystack_status: event.data.status,
                plan_name: event.data.plan.name,
                customer_code: event.data.customer.customer_code
              }
            });
            break;

          case 'subscription.disable':
            await supabase
              .from('subscriptions')
              .update({
                status: 'canceled',
                canceled_at: new Date().toISOString(),
                metadata: {
                  paystack_status: 'canceled',
                  canceled_reason: event.data.reason
                }
              })
              .eq('id', event.data.subscription_code);
            break;

          case 'subscription.enable':
            await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                metadata: {
                  paystack_status: 'active'
                }
              })
              .eq('id', event.data.subscription_code);
            break;

          case 'charge.success':
            if (event.data.plan) {
              const subscriptionCode = event.data.metadata.subscription_code;
              await supabase
                .from('subscriptions')
                .update({
                  status: 'active',
                  current_period_end: new Date(
                    event.data.paid_at * 1000 +
                      event.data.plan.interval * 86400000
                  ).toISOString()
                })
                .eq('id', subscriptionCode)
                .eq('user_id', event.data.metadata.user_id);
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
    console.error('Webhook Error:', err);
    return new Response(
      `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`,
      { status: 400 }
    );
  }
}
