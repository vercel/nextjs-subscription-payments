// utils/supabase/admin.ts
import { toDateTime } from '@/utils/helpers';
import { createClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert } from 'types_db';

type Product = Tables<'products'>;
type Price = Tables<'prices'>;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function createAdminClient() {
  if (adminClient) return adminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error('Missing Supabase admin credentials');
  }

  adminClient = createClient<Database>(supabaseUrl, supabaseServiceRole, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return adminClient;
}

// Use the admin client for all operations
const supabaseAdmin = createAdminClient();

const upsertProductRecord = async (paystackPlan: any) => {
  const productData: Product = {
    id: paystackPlan.plan_code,
    active: !paystackPlan.is_deleted,
    name: paystackPlan.name,
    description: paystackPlan.description ?? null,
    image: null,
    metadata: {
      paystack_id: paystackPlan.id,
      integration: paystackPlan.integration,
      features: paystackPlan.description?.split('\n') || []
    }
  };

  const { error: upsertError } = await supabaseAdmin
    .from('products')
    .upsert([productData]);

  if (upsertError)
    throw new Error(`Product insert/update failed: ${upsertError.message}`);

  console.log(`Product inserted/updated: ${paystackPlan.plan_code}`);
};

const upsertPriceRecord = async (
  paystackPlan: any,
  retryCount = 0,
  maxRetries = 3
) => {
  const priceData: Price = {
    id: paystackPlan.plan_code,
    product_id: paystackPlan.plan_code,
    active: !paystackPlan.is_deleted,
    currency: paystackPlan.currency,
    type: 'recurring',
    unit_amount: paystackPlan.amount,
    interval:
      paystackPlan.interval === 'annually'
        ? 'year'
        : paystackPlan.interval.replace('ly', ''),
    interval_count: 1,
    trial_period_days: null,
    description: paystackPlan.description || null,
    metadata: {
      paystack_id: paystackPlan.id,
      integration: paystackPlan.integration
    }
  };

  const { error: upsertError } = await supabaseAdmin
    .from('prices')
    .upsert([priceData]);

  if (upsertError?.message.includes('foreign key constraint')) {
    if (retryCount < maxRetries) {
      console.log(
        `Retry attempt ${retryCount + 1} for price ID: ${paystackPlan.plan_code}`
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await upsertPriceRecord(paystackPlan, retryCount + 1, maxRetries);
    } else {
      throw new Error(
        `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`
      );
    }
  } else if (upsertError) {
    throw new Error(`Price insert/update failed: ${upsertError.message}`);
  } else {
    console.log(`Price inserted/updated: ${paystackPlan.plan_code}`);
  }
};

const deleteProductRecord = async (paystackPlan: any) => {
  const { error: deletionError } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', paystackPlan.plan_code);

  if (deletionError)
    throw new Error(`Product deletion failed: ${deletionError.message}`);

  console.log(`Product deleted: ${paystackPlan.plan_code}`);
};

const deletePriceRecord = async (paystackPlan: any) => {
  const { error: deletionError } = await supabaseAdmin
    .from('prices')
    .delete()
    .eq('id', paystackPlan.plan_code);

  if (deletionError)
    throw new Error(`Price deletion failed: ${deletionError.message}`);

  console.log(`Price deleted: ${paystackPlan.plan_code}`);
};

const createOrRetrieveCustomer = async ({
  email,
  uuid
}: {
  email: string;
  uuid: string;
}) => {
  try {
    // Check if customer exists
    const { data: existingCustomer, error: queryError } = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', uuid)
      .maybeSingle();

    if (queryError) {
      throw new Error(`Customer lookup failed: ${queryError.message}`);
    }

    if (existingCustomer?.paystack_customer_id) {
      return existingCustomer.paystack_customer_id;
    }

    // Create new customer record
    const { data: newCustomer, error: insertError } = await supabaseAdmin
      .from('customers')
      .insert([{ id: uuid }])
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create customer: ${insertError.message}`);
    }

    return null; // Will be updated with Paystack customer ID during checkout
  } catch (error) {
    console.error('Error in createOrRetrieveCustomer:', error);
    throw error;
  }
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
  status?: string
) => {
  try {
    // Get customer's UUID from mapping table
    const { data: customerData, error: noCustomerError } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('paystack_customer_id', customerId)
      .single();

    if (noCustomerError) {
      throw new Error(`Customer lookup failed: ${noCustomerError.message}`);
    }

    const { id: uuid } = customerData!;

    // Fetch subscription details from Paystack
    const response = await fetch(
      `https://api.paystack.co/subscription/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch subscription from Paystack');
    }

    const { data: subscription } = await response.json();

    // Upsert the latest status of the subscription object
    const subscriptionData: TablesInsert<'subscriptions'> = {
      id: subscription.subscription_code,
      user_id: uuid,
      status: status || subscription.status,
      price_id: subscription.plan.plan_code,
      quantity: 1,
      cancel_at_period_end: status === 'canceled',
      canceled_at: status === 'canceled' ? new Date().toISOString() : null,
      current_period_start: new Date(
        subscription.current_period_start
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end
      ).toISOString(),
      created: new Date(subscription.createdAt).toISOString(),
      ended_at: status === 'canceled' ? new Date().toISOString() : null,
      trial_start: null,
      trial_end: null,
      metadata: {
        paystack_subscription_id: subscription.id,
        paystack_plan_id: subscription.plan.id,
        paystack_customer_code: subscription.customer.customer_code
      }
    };

    const { error: upsertError } = await supabaseAdmin
      .from('subscriptions')
      .upsert([subscriptionData]);

    if (upsertError) {
      throw new Error(
        `Subscription insert/update failed: ${upsertError.message}`
      );
    }

    console.log(
      `Inserted/updated subscription [${subscription.subscription_code}] for user [${uuid}]`
    );
  } catch (error) {
    console.error('Error in manageSubscriptionStatusChange:', error);
    throw error;
  }
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange
};
