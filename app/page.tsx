import Pricing from '@/components/Pricing';
import {
  getActiveProductsWithPrices,
  getSession,
  getSubscription
} from '@/utils/supabase/server';

export default async function PricingPage() {
  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);

  return (
    <Pricing
      session={session}
      user={session?.user}
      products={products}
      subscription={subscription}
    />
  );
}
