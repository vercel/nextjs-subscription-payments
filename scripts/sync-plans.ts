// scripts/sync-plans.ts
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types_db';

type TypedSupabaseClient = SupabaseClient<Database>;

// Load environment variables
async function loadEnvFiles() {
  const envFiles = ['.env', '.env.local'];
  envFiles.forEach((file) => {
    const envPath = path.resolve(process.cwd(), file);
    if (fs.existsSync(envPath)) {
      const envConfig = dotenv.parse(fs.readFileSync(envPath));
      Object.assign(process.env, envConfig);
    }
  });
}

interface PaystackPlan {
  id: number;
  name: string;
  plan_code: string;
  description: string | null;
  amount: number;
  interval: 'monthly' | 'annually';
  currency: string;
  is_deleted: boolean;
  is_archived: boolean;
  integration: number;
}

// Initialize Supabase client
function initSupabase(): TypedSupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}

// Function to fetch plans from Paystack
async function fetchPaystackPlans(): Promise<PaystackPlan[]> {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error('Missing PAYSTACK_SECRET_KEY environment variable');
  }

  const response = await fetch('https://api.paystack.co/plan', {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Paystack plans: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data;
}

// Function to sync plans to database
async function syncPlansToDatabase(
  supabase: TypedSupabaseClient,
  paystackPlans: PaystackPlan[]
) {
  console.log(`Syncing ${paystackPlans.length} plans to database...`);

  for (const plan of paystackPlans) {
    try {
      if (plan.is_deleted) {
        console.log(`Skipping deleted plan: ${plan.name}`);
        continue;
      }

      // First, create or update the product
      const { data: product, error: productError } = await supabase
        .from('products')
        .upsert({
          id: plan.plan_code,
          active: !plan.is_deleted && !plan.is_archived,
          name: plan.name,
          description: plan.description,
          metadata: {
            paystack_id: plan.id,
            integration: plan.integration,
            features: plan.description?.split('\n') || []
          }
        } as Database['public']['Tables']['products']['Insert'])
        .select()
        .single();

      if (productError) {
        console.error(`Error upserting product ${plan.name}:`, productError);
        continue;
      }

      console.log(`Upserted product: ${product.name}`);

      // Then, create or update the price
      const { error: priceError } = await supabase.from('prices').upsert({
        id: plan.plan_code,
        product_id: plan.plan_code,
        active: !plan.is_deleted && !plan.is_archived,
        currency: plan.currency,
        type: 'recurring',
        unit_amount: plan.amount,
        interval:
          plan.interval === 'annually'
            ? 'year'
            : plan.interval.replace('ly', ''),
        interval_count: 1,
        metadata: {
          paystack_id: plan.id,
          integration: plan.integration
        }
      } as Database['public']['Tables']['prices']['Insert']);

      if (priceError) {
        console.error(`Error upserting price for ${plan.name}:`, priceError);
        continue;
      }

      console.log(`Upserted price for: ${plan.name}`);
    } catch (error) {
      console.error(`Error processing plan ${plan.name}:`, error);
    }
  }
}

async function main() {
  try {
    console.log('Starting plan sync...');

    // Load environment variables
    await loadEnvFiles();

    // Initialize Supabase client
    const supabase = initSupabase();

    // Fetch plans from Paystack
    console.log('Fetching plans from Paystack...');
    const paystackPlans = await fetchPaystackPlans();
    console.log(`Found ${paystackPlans.length} plans in Paystack`);

    // Sync to database
    await syncPlansToDatabase(supabase, paystackPlans);

    console.log('Sync completed successfully!');
  } catch (error) {
    console.error('Error syncing plans:', error);
    process.exit(1);
  }
}

// Execute main function
main().catch(console.error);
