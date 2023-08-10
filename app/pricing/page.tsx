import Pricing from '@/components/Pricing';
import {
  getAuthUser,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';

export default async function PricingPage() {
  const [user, products, subscription] = await Promise.all([
    getAuthUser(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);

  return (
    <Pricing
      user={user}
      products={products}
      subscription={subscription}
    />
  );
}
