import { useState, useEffect } from 'react';
import { supabase } from '../utils/initSupabase';

export default function Pricing() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      // Load all products and prices.
      const { data: products, error } = await supabase
        .from('products')
        .select('*, prices(*)');
      if (error) alert(error.message);
      setProducts(products);
    }
    getProducts();
  }, []);

  return <pre>{JSON.stringify(products, null, 2)}</pre>;
}
