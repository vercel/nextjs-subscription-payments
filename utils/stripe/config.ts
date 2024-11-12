// lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  appInfo: {
    name: 'Next.js SaaS Starter (by Faraja Bien)',
    version: '1.0.0',
    url: 'https://github.com/farajabien/supabase-saas-starter'
  },
  typescript: true
});

// Helper to handle stripe errors
export async function handleStripeError(error: any) {
  let message = 'An error occurred with the payment';

  if (error instanceof Stripe.errors.StripeError) {
    message = error.message;
  }

  return {
    error: {
      message,
      statusCode: error.statusCode || 500
    }
  };
}

// Type for Stripe webhook events we handle
export type StripeWebhookEvents =
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'customer.updated'
  | 'invoice.paid'
  | 'invoice.payment_failed';

// Validate Stripe webhook
export const validateStripeWebhook = (
  body: string,
  signature: string,
  secret: string
) => {
  try {
    return stripe.webhooks.constructEvent(
      body,
      signature,
      secret
    ) as Stripe.Event;
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    throw new Error('Invalid signature');
  }
};
