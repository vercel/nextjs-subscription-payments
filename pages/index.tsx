import Pricing from 'components/Pricing';
import { getActiveProductsWithPrices } from 'utils/supabase-client';
import { Product } from 'types';
import { GetStaticPropsResult } from 'next';
import DropzoneUpload from '@/components/DropzoneUpload';

interface Props {
  products: Product[];
}

export default function PricingPage({ products }: Props) {
  return (
    <section className="bg-black">
      <div className="max-w-6xl mx-auto py-8 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center"></div>
        <DropzoneUpload />
        </div>
    </section>

    );
    //<Pricing products={products} />);
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const products = []; //await getActiveProductsWithPrices();

  return {
    props: {
      products
    },
    revalidate: 60
  };
}
