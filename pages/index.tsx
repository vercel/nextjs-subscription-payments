// @ts-nocheck
import { GetStaticPropsResult } from 'next';

import Pricing from '@/components/Pricing';
import { getActiveProductsWithPrices } from '@/utils/supabase-client';
import { Product } from 'types';
import DefaultLayout from '@/components/Layout';

interface Props {
  products: Product[];
}

export default function PricingPage({ products }: Props) {
  return <Pricing products={products} />;
}

PricingPage.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const products = await getActiveProductsWithPrices();

  return {
    props: {
      products
    },
    revalidate: 60
  };
}
