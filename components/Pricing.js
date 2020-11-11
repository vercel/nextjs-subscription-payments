import { useState, useEffect } from 'react';
import { supabase } from '../utils/initSupabase';

export default function Pricing() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      // Load all products and prices.
      const { data: products, error } = await supabase
        .from('products')
        .select('*, prices(*)')
        .eq('active', true)
        // .order('metadata:index')
        .order('unit_amount', { foreignTable: 'prices' });
      if (error) alert(error.message);
      setProducts(products);
    }
    getProducts();
  }, []);

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          {product.image ? <img src={product.image} alt={product.name} /> : ''}
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <form>
            <label htmlFor="price">Choose pricing plan</label>
            <select id="price" name="price">
              {product.prices.map((price) => (
                <option
                  key={price.id}
                  value={price.id}
                >{`${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: price.currency,
                }).format((price.unit_amount / 100).toFixed(2))} per ${
                  price.interval
                }`}</option>
              ))}
            </select>
            <button type="submit">Subscribe</button>
          </form>
        </div>
      ))}
    </div>
  );
}
