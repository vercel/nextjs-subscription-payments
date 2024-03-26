import { stripe } from '@/utils/stripe/config';
import { upsertPriceRecord, upsertProductRecord } from '@/utils/supabase/admin';

async function retrieveStripeProducts() {
  const products = await stripe.products.list();
  return products.data;
}

async function retrieveStripePrices() {
  const prices = await stripe.prices.list();
  return prices.data;
}

async function main() {
  const products = await retrieveStripeProducts();
  await Promise.all(products.map((product) => upsertProductRecord(product)));

  const prices = await retrieveStripePrices();
  await Promise.all(prices.map((price) => upsertPriceRecord(price)));
}

main();
