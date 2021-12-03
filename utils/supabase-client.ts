import { createClient, User } from '@supabase/supabase-js';
import { Product, ProductWithPrice, UserDetails } from 'types';

export const supabase = createClient('https://jxqgwmmjxrrknnegarmt.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODI4ODI2OCwiZXhwIjoxOTUzODY0MjY4fQ.UwfQYhN5KAkIT6qCkVgds9hep1m7dcW7NJiVTCF3l4s');

export const getActiveProductsWithPrices = async (): Promise<ProductWithPrice[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data || [];
};

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from<UserDetails>('users')
    .update({
      full_name: name
    })
    .eq('id', user.id);
};
