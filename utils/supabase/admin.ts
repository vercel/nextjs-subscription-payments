import { toDateTime } from '../helpers';
import { stripe } from '../stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import type { Database, Tables, TablesInsert } from 'types_db';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata
  };

  const { error } = await supabaseAdmin.from('products').upsert([productData]);
  if (error) throw error;
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? null,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata
  };

  const { error } = await supabaseAdmin.from('prices').upsert([priceData]);
  if (error) throw error;
  console.log(`Price inserted/updated: ${price.id}`);
};

const deleteProductRecord = async (product: Stripe.Product) => {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', product.id);
  if (error) throw error;
  console.log(`Product deleted: ${product.id}`);
};

const deletePriceRecord = async (price: Stripe.Price) => {
  const { error } = await supabaseAdmin
    .from('prices')
    .delete()
    .eq('id', price.id);
  if (error) throw error;
  console.log(`Price deleted: ${price.id}`);
};

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  // Check if the customer already exists in Supabase
  const { data: existingSupabaseCustomer, error: supabaseQueryError } =
    await supabaseAdmin
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', uuid)
      .single();

  if (supabaseQueryError) console.error(supabaseQueryError); // Log error but continue

  // Check if the customer already exists in Stripe
  const existingStripeCustomer = await stripe.customers.list({ email: email });
  const stripeCustomerId =
    existingStripeCustomer.data.length > 0
      ? existingStripeCustomer.data[0].id
      : null;

  // Reconcile and update records as needed
  if (existingSupabaseCustomer && stripeCustomerId) {
    // If customer IDs do not match, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', uuid);

      if (updateError) throw updateError;
      console.log(
        `Supabase customer record updated with Stripe ID: ${stripeCustomerId}`
      );
    }
    return stripeCustomerId;
  } else if (!existingSupabaseCustomer && stripeCustomerId) {
    // Customer exists in Stripe but not in Supabase, insert into Supabase
    const { error: insertError } = await supabaseAdmin
      .from('customers')
      .insert([{ id: uuid, stripe_customer_id: stripeCustomerId }]);

    if (insertError) throw insertError;
    console.log(`Customer ID inserted into the Supabase customers table.`);
    return stripeCustomerId;
  } else if (!stripeCustomerId) {
    // Customer does not exist in Stripe, create a new customer in Stripe
    const customerData = { metadata: { supabaseUUID: uuid }, email: email };
    const newCustomer = await stripe.customers.create(customerData);

    if (existingSupabaseCustomer) {
      // Update any existing Supabase record with the new Stripe customer ID
      const { error: updateError } = await supabaseAdmin
        .from('customers')
        .update({ stripe_customer_id: newCustomer.id })
        .eq('id', uuid);

      if (updateError) throw updateError;
      console.log(
        `Existing Supabase customer record updated with new Stripe ID: ${newCustomer.id}.`
      );
    } else {
      // Insert a new record in Supabase if no existing record is found
      const { error: supabaseInsertError } = await supabaseAdmin
        .from('customers')
        .insert([{ id: uuid, stripe_customer_id: newCustomer.id }]);
      if (supabaseInsertError) throw supabaseInsertError;

      console.log(
        `New customer created in Stripe and inserted into Supabase for ${uuid}.`
      );
    }

    return newCustomer.id;
  }

  // Fallback in case of unforeseen scenarios
  throw new Error('Unhandled scenario in createOrRetrieveCustomer function');
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] }
    })
    .eq('id', uuid);
  if (error) throw error;
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();
  if (noCustomerError) throw noCustomerError;

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method']
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: TablesInsert<'subscriptions'> = {
    id: subscription.id,
    user_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at).toISOString()
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at).toISOString()
      : null,
    current_period_start: toDateTime(
      subscription.current_period_start
    ).toISOString(),
    current_period_end: toDateTime(
      subscription.current_period_end
    ).toISOString(),
    created: toDateTime(subscription.created).toISOString(),
    ended_at: subscription.ended_at
      ? toDateTime(subscription.ended_at).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end).toISOString()
      : null
  };

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .upsert([subscriptionData]);
  if (error) throw error;
  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    );
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange
};
