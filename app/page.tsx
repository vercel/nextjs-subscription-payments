import Pricing from '@/components/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { Product } from 'types';

export default async function PricingPage() {
  const products: Product[] = await getActiveProductsWithPrices();

  return <Pricing products={products} />;
}
