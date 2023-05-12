import Pricing from '@/components/Pricing';
import { createServerSupabaseClient, getSession } from '@/app/supabase-server';
import { ProductWithPrice } from 'types';

export default async function PricingPage() {
  const supabase = createServerSupabaseClient();
  const session = await getSession();

  const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
    const { data, error } = await supabase
      .from('products')
      .select('*, prices(*)')
      .eq('active', true)
      .eq('prices.active', true)
      .order('metadata->index')
      .order('unit_amount', { foreignTable: 'prices' });

    if (error) {
      console.log(error.message);
    }
    // TODO: improve the typing here.
    return (data as any) || [];
  };
  const products = await getActiveProductsWithPrices();

  const getSubscription = () =>
    supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single();
  const subscription = await getSubscription();

  return (
    <Pricing
      session={session}
      user={session?.user}
      products={products}
      subscription={subscription}
    />
  );
}
