import { useState } from 'react';
import { postData } from '../utils/helpers';
import { getStripe } from '../utils/initStripejs';
import { useAuth } from '../utils/useAuth';
import Button from './Button/Button';

export default function Pricing({ products }) {
  const [loading, setLoading] = useState(false);
  const { user, session } = useAuth();

  const handleCheckout = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const price = formData.get('price');
    const { sessionId } = await postData({
      url: '/api/createCheckoutSession',
      data: { price },
      token: session.access_token
    });
    const stripe = await getStripe();
    const { error } = stripe.redirectToCheckout({ sessionId });
    if (error) alert(error.message);
    setLoading(false);
  };

  return (
    <div className="m-6">
      <h1 className="text-3xl font-black mb-8">Pricing Plans</h1>
      {products.map((product) => (
        <div
          key={product.id}
          className="border-gray-200 border p-8 rounded-lg mb-8 max-w-md"
        >
          {product.image ? <img src={product.image} alt={product.name} /> : ''}
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p>{product.description}</p>
          <form onSubmit={handleCheckout} className="flex flex-col space-y-4">
            <label htmlFor="price">Choose pricing plan</label>
            <select
              id="price"
              name="price"
              className="mt-1 block form-select w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm text-sm"
            >
              {product.prices.map((price) => (
                <option
                  key={price.id}
                  value={price.id}
                >{`${new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: price.currency
                }).format((price.unit_amount / 100).toFixed(2))} per ${
                  price.interval
                }`}</option>
              ))}
            </select>
            <Button variant="slim" type="submit" disabled={!user || loading}>
              Subscribe
            </Button>
          </form>
        </div>
      ))}
    </div>
  );
}
