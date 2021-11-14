import Stripe from 'stripe';
export interface PageMeta {
  title: string;
  description: string;
  cardImage: string;
}

export interface Customer {
  id: string /* primary key */;
  stripe_customer_id?: string;
}

export interface Product {
  id: string /* primary key */;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Record<string, string>; // type unknown;
}

export interface ProductWithPrice extends Product {
  prices?: Price[];
}

export interface UserDetails {
  id: string /* primary key */;
  full_name?: string;
  avatar_url?: string;
  billing_address?: any; // type unknown;
  payment_method?: any; // type unknown;
}

export interface Price {
  id: string /* primary key */;
  product_id?: string /* foreign key to products.id */;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: string;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Record<string, string>; // type unknown;
  products?: Product[];
}

export interface PriceWithProduct extends Price {}

export interface Subscription {
  id: string /* primary key */;
  user_id: string;
  status?: any; // type unknown;
  metadata?: any; // type unknown;
  price_id?: string /* foreign key to prices.id */;
  quantity?: any; // type unknown;
  cancel_at_period_end?: boolean;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at?: string;
  cancel_at?: string;
  canceled_at?: string;
  trial_start?: string;
  trial_end?: string;
  prices?: Price;
}
