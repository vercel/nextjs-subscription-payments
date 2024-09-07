import Pricing from '@/components/ui/Pricing/Pricing';
import { createClient } from '@/utils/supabase/server';
import {
  getProducts,
  getUser,
  getUserSubscriptions
} from '@/utils/supabase/queries';

export default async function PricingPage() {
  const supabase = createClient();
  const user = await getUser(supabase);

  const [products, subscriptions] = await Promise.all([
    // getUser(supabase),
    getProducts(supabase),
    getUserSubscriptions(supabase, user),
  ]);


console.log(subscriptions);

  return (
    <Pricing
      user={user}
      products={products ?? []}
      subscriptions={subscriptions}  />
  );
}
