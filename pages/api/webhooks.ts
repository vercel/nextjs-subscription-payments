import { NextApiRequest, NextApiResponse } from 'next';

import {
  upsertProductRecord,
  upsertPriceRecord,
  manageSubscriptionStatusChange
} from '@/utils/supabase-admin';

// esm.sh is used to compile stripe-node to be compatible with ES modules.
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient()
});
// This is needed in order to use the Web Crypto API in Deno.
const cryptoProvider = Stripe.createSubtleCryptoProvider();

console.log('Hello from Stripe Webhook!');

const webhookSecret =
  process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false
  }
};

const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'price.created',
  'price.updated',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);

const processEvent = async (event: Stripe.Event, response: NextApiResponse) => {
  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProductRecord(event.data.object as Stripe.Product);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPriceRecord(event.data.object as Stripe.Price);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          {
            const subscription = event.data.object as Stripe.Subscription;
            await manageSubscriptionStatusChange(
              subscription.id,
              subscription.customer as string,
              event.type === 'customer.subscription.created'
            );
          }
          break;
        case 'checkout.session.completed':
          {
            const checkoutSession = event.data
              .object as Stripe.Checkout.Session;
            if (checkoutSession.mode === 'subscription') {
              const subscriptionId = checkoutSession.subscription;
              await manageSubscriptionStatusChange(
                subscriptionId as string,
                checkoutSession.customer as string,
                true
              );
            }
          }
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.log(error);
      return response
        .status(400)
        .send('Webhook error: "Webhook handler failed. View logs."');
    }
  }
};

const webhookHandler = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  if (request.method === 'POST') {
    const signature = request.headers['Stripe-Signature'] || '';

    const body = await request.body;
    let receivedEvent: Stripe.Event;
    try {
      receivedEvent = await stripe.webhooks.constructEventAsync(
        body,
        signature,
        webhookSecret as string,
        undefined,
        cryptoProvider
      );
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`);
      //return res.status(400).send(`Webhook Error: ${err.message}`);
      return new Response(err.message, { status: 400 });
    }

    console.log(receivedEvent);
    await processEvent(receivedEvent, response);
    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method Not Allowed');
  }
};

export default webhookHandler;
