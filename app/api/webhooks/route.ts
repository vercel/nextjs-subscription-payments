// app/api/webhooks/route.ts
import { createAdminClient } from '@/utils/supabase/admin';
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

    // Use admin client instead of route handler client
    const supabase = createAdminClient();

    if (relevantEvents.has(event.event)) {
      try {
        switch (event.event) {
          case 'customer.created':
            console.log(
              'Creating/updating customer:',
              event.data.customer_code
            );
            // Upsert customer record
            const { error: customerError } = await supabase
              .from('customers')
              .upsert({
                id: event.data.metadata.user_id,
                paystack_customer_id: event.data.customer_code
              });

            if (customerError) {
              throw new Error(
                `Customer upsert failed: ${customerError.message}`
              );
            }
            break;

          case 'subscription.create':
            console.log('Creating subscription:', event.data.subscription_code);

            // First ensure customer exists
            const { data: existingCustomer, error: customerLookupError } =
              await supabase
                .from('customers')
                .select('id')
                .eq('paystack_customer_id', event.data.customer.customer_code)
                .single();

            if (
              customerLookupError &&
              customerLookupError.code !== 'PGRST116'
            ) {
              throw new Error(
                `Customer lookup failed: ${customerLookupError.message}`
              );
            }

            // Create or update customer if needed
            if (!existingCustomer) {
              const { error: createCustomerError } = await supabase
                .from('customers')
                .upsert({
                  id: event.data.metadata.user_id,
                  paystack_customer_id: event.data.customer.customer_code
                });

              if (createCustomerError) {
                throw new Error(
                  `Customer creation failed: ${createCustomerError.message}`
                );
              }
            }

            // Create subscription
            const { error: subscriptionError } = await supabase
              .from('subscriptions')
              .upsert({
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

            if (subscriptionError) {
              throw new Error(
                `Subscription creation failed: ${subscriptionError.message}`
              );
            }
            break;

          case 'subscription.disable':
            const { error: disableError } = await supabase
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

            if (disableError) {
              throw new Error(
                `Subscription disable failed: ${disableError.message}`
              );
            }
            break;

          case 'subscription.enable':
            const { error: enableError } = await supabase
              .from('subscriptions')
              .update({
                status: 'active',
                metadata: {
                  paystack_status: 'active'
                }
              })
              .eq('id', event.data.subscription_code);

            if (enableError) {
              throw new Error(
                `Subscription enable failed: ${enableError.message}`
              );
            }
            break;

          case 'charge.success':
            if (event.data.plan) {
              const subscriptionCode = event.data.metadata.subscription_code;
              const { error: chargeError } = await supabase
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

              if (chargeError) {
                throw new Error(
                  `Charge success update failed: ${chargeError.message}`
                );
              }
            }
            break;

          default:
            console.log(`🤷‍♂️ Unhandled event type: ${event.event}`);
        }

        return new Response(JSON.stringify({ received: true }));
      } catch (error) {
        console.error('❌ Webhook handler failed:', error);
        // Return 200 to acknowledge receipt but log the error
        // This prevents Paystack from retrying webhooks that fail due to data issues
        return new Response(
          JSON.stringify({
            received: true,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
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
