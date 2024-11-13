-- Core types
create type pricing_type as enum ('one_time', 'recurring');
create type pricing_plan_interval as enum ('day', 'week', 'month', 'year');
create type subscription_status as enum ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid', 'paused', 'inactive');

/**
* USERS
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table users (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text,
  billing_address jsonb,
  payment_method jsonb,
  paystack_authorization jsonb,
  paystack_card_details jsonb
);
alter table users enable row level security;
create policy "Can view own user data." on users for select using (auth.uid() = id);
create policy "Can update own user data." on users for update using (auth.uid() = id);

/**
* This trigger automatically creates a user entry when a new user signs up via Supabase Auth.
*/
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

/**
* CUSTOMERS
* Note: this is a private table that contains a mapping of user IDs to payment provider customer IDs.
*/
create table customers (
  id uuid references auth.users not null primary key,
  stripe_customer_id text,
  paystack_customer_id text
);
alter table customers enable row level security;
create index idx_customers_paystack_id on customers(paystack_customer_id);

/**
* PRODUCTS
* Note: products are created and managed in payment provider and synced to our DB via webhooks.
*/
create table products (
  id text primary key,
  active boolean,
  name text,
  description text,
  image text,
  metadata jsonb
);
alter table products enable row level security;
create policy "Allow public read-only access." on products for select using (true);

/**
* PRICES
*/
create table prices (
  id text primary key,
  product_id text references products,
  active boolean,
  description text,
  unit_amount bigint,
  currency text check (char_length(currency) = 3),
  type pricing_type,
  interval pricing_plan_interval,
  interval_count integer,
  trial_period_days integer,
  metadata jsonb
);
alter table prices enable row level security;
create policy "Allow public read-only access." on prices for select using (true);

/**
* SUBSCRIPTIONS
*/
create table subscriptions (
  id text primary key,
  user_id uuid references auth.users not null,
  status subscription_status,
  metadata jsonb,
  price_id text references prices,
  quantity integer,
  cancel_at_period_end boolean,
  created timestamp with time zone default timezone('utc'::text, now()) not null,
  current_period_start timestamp with time zone default timezone('utc'::text, now()) not null,
  current_period_end timestamp with time zone default timezone('utc'::text, now()) not null,
  ended_at timestamp with time zone default timezone('utc'::text, now()),
  cancel_at timestamp with time zone default timezone('utc'::text, now()),
  canceled_at timestamp with time zone default timezone('utc'::text, now()),
  trial_start timestamp with time zone default timezone('utc'::text, now()),
  trial_end timestamp with time zone default timezone('utc'::text, now())
);
alter table subscriptions enable row level security;
create policy "Can only view own subs data." on subscriptions for select using (auth.uid() = user_id);
create index idx_subscriptions_user_id on subscriptions(user_id);

/**
* PAYSTACK-SPECIFIC FUNCTIONS AND TRIGGERS
*/
create function handle_paystack_subscription_change()
returns trigger as $$
begin
    if NEW.metadata->>'paystack_status' is not null then
        case NEW.metadata->>'paystack_status'
            when 'active' then
                NEW.status := 'active';
            when 'non-renewing' then
                NEW.status := 'canceled';
            when 'attention' then
                NEW.status := 'past_due';
            when 'completed' then
                NEW.status := 'ended';
            else
                NEW.status := 'inactive';
        end case;
    end if;
    return NEW;
end;
$$ language plpgsql;

create trigger on_paystack_subscription_change
    before insert or update on subscriptions
    for each row
    execute function handle_paystack_subscription_change();

create function get_or_create_paystack_customer(user_id uuid)
returns text as $$
declare
    customer_id text;
begin
    select paystack_customer_id into customer_id
    from customers
    where id = user_id;

    if customer_id is null then
        insert into customers (id)
        values (user_id)
        on conflict (id) do nothing;
    end if;

    return customer_id;
end;
$$ language plpgsql security definer;

/**
* REALTIME SUBSCRIPTIONS
*/
drop publication if exists supabase_realtime;
create publication supabase_realtime for table products, prices;