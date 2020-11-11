import { supabaseAdmin } from './initSupabaseAdmin';

const upsertProductRecord = async (product) => {
  const { accessRole, ...rawMetadata } = product.metadata;

  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description,
    access_role: accessRole ?? null,
    image: product.images?.[0] ?? null,
    metadata: rawMetadata,
  };

  const { error } = await supabaseAdmin
    .from('products')
    .insert([productData], { upsert: true });
  if (error) throw error;
  console.log(`Product inserted/updated: ${product.id}`);
};

const upsertPriceRecord = async (price) => {
  const priceData = {
    id: price.id,
    product_id: price.product,
    active: price.active,
    currency: price.currency,
    description: price.nickname,
    type: price.type,
    unit_amount: price.unit_amount,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    metadata: price.metadata,
  };

  const { error } = await supabaseAdmin
    .from('prices')
    .insert([priceData], { upsert: true });
  if (error) throw error;
  console.log(`Price inserted/updated: ${price.id}`);
};

export { upsertProductRecord, upsertPriceRecord };
