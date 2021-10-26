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

type Join<K, P> = K extends string | number ? (P extends string | number ? `${K}${'' extends P ? '' : '.'}${P}` : never) : never;

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];

type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number ? `${K}` | Join<K, Paths<T[K], Prev[D]>> : never;
    }[keyof T]
  : '';

type NestedObjectType = {
  a: string;
  b: string;
  nest: {
    c: string;
  };
  otherNest: {
    c: string;
  };
};

type NestedObjectPaths = Paths<ProductWithPrice>;
// type NestedObjectPaths = "a" | "b" | "nest" | "otherNest" | "nest.c" | "otherNest.c"

interface Tree {
  left: Tree;
  right: Tree;
  data: string;
}

// type TreeLeaves = Leaves<Tree>; // sorry, compiler 💻⌛😫
// type TreeLeaves = "data" | "left.data" | "right.data" | "left.left.data" |
// "left.right.data" | "right.left.data" | "right.right.data" | "left.left.left.data" |
// "left.left.right.data" | "left.right.left.data" | ... 1012 more ... |
// "right.right.right.right.right.right.right.right.right.data"

type MyGenericType<T extends object> = {
  keys: Array<Paths<T>>;
};

const test: MyGenericType<NestedObjectType> = {
  keys: ['a', 'nest.c']
};
