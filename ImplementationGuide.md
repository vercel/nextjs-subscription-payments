# Next.js Subscription Payments with Paystack - Implementation Guide

## 1. Initial Setup

### 1.1 Clone and Install

```bash
# Clone the repository
git clone https://github.com/vercel/nextjs-subscription-payments
cd nextjs-subscription-payments

# Install dependencies
pnpm install

# Create environment files
cp .env.example .env.local
```

### 1.2 Set Up Supabase

1. Create a new project at supabase.com
2. Get your project URL and anon key
3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 1.3 Set Up Paystack

1. Create account at paystack.com
2. Get your test API keys
3. Add to `.env.local`:

```env
PAYSTACK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
```

## 2. Database Setup

### 2.1 Run Migrations

```sql
-- Execute in Supabase SQL Editor
-- Create necessary enums
CREATE TYPE pricing_type AS ENUM ('one_time', 'recurring');
CREATE TYPE pricing_plan_interval AS ENUM ('day', 'week', 'month', 'year');
CREATE TYPE subscription_status AS ENUM (
  'trialing', 'active', 'canceled', 'incomplete',
  'incomplete_expired', 'past_due', 'unpaid', 'paused'
);

-- Create tables
CREATE TABLE products (
  id text PRIMARY KEY,
  active boolean,
  name text,
  description text,
  image text,
  metadata jsonb
);

CREATE TABLE prices (
  id text PRIMARY KEY,
  product_id text REFERENCES products(id),
  active boolean,
  description text,
  unit_amount bigint,
  currency text CHECK (char_length(currency) = 3),
  type pricing_type,
  interval pricing_plan_interval,
  interval_count integer,
  trial_period_days integer,
  metadata jsonb
);

CREATE TABLE customers (
  id uuid REFERENCES auth.users PRIMARY KEY,
  paystack_customer_id text
);

CREATE TABLE subscriptions (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  status subscription_status,
  metadata jsonb,
  price_id text REFERENCES prices(id),
  quantity integer,
  cancel_at_period_end boolean,
  created timestamp with time zone DEFAULT timezone('utc'::text, now()),
  current_period_start timestamp with time zone DEFAULT timezone('utc'::text, now()),
  current_period_end timestamp with time zone DEFAULT timezone('utc'::text, now()),
  ended_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  cancel_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  canceled_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  trial_start timestamp with time zone DEFAULT timezone('utc'::text, now()),
  trial_end timestamp with time zone DEFAULT timezone('utc'::text, now())
);
```

### 2.2 Set Up Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read-only access" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access" ON prices FOR SELECT USING (true);
CREATE POLICY "Can only view own subscription data" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
```

## 3. Initialize Paystack Integration

### 3.1 Create Plans in Paystack

1. Run the plan creation script:

```bash
pnpm paystack:create-plans
```

### 3.2 Set Up Webhook

1. Set up ngrok for local testing:

```bash
ngrok http 3000
```

2. Configure webhook URL in Paystack dashboard:

```
https://your-domain/api/webhooks
```

3. Select events to listen for:

- subscription.create
- subscription.disable
- subscription.enable
- plan.create
- plan.update
- charge.success

## 4. Set Up GitHub Actions

### 4.1 Add Secrets

Add these secrets to your GitHub repository:

- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- PAYSTACK_SECRET_KEY
- NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

### 4.2 Create Workflow

Create `.github/workflows/sync-plans.yml` for automatic plan syncing.

## 5. Deploy

### 5.1 Deploy to Vercel

```bash
vercel deploy
```

### 5.2 Add Environment Variables

Add all environment variables to your Vercel project.

### 5.3 Update Webhook URL

Update Paystack webhook URL to your production domain.

## 6. Testing

### 6.1 Test Subscription Flow

1. Create a test account
2. Subscribe to a plan
3. Verify webhook receives events
4. Check database for subscription record

### 6.2 Test Plan Sync

1. Create a new plan in Paystack dashboard
2. Wait for webhook or trigger manual sync
3. Verify plan appears in database

## 7. Monitoring

### 7.1 Set Up Logging

1. Add logging to webhook handler
2. Monitor webhook events in Vercel logs
3. Set up error notifications

### 7.2 Regular Maintenance

1. Run plan sync daily via GitHub Actions
2. Monitor webhook health
3. Check for failed payments
4. Verify subscription statuses

## Common Issues and Solutions

1. **Webhook Errors**

- Check signature validation
- Verify environment variables
- Check Paystack webhook logs

2. **Subscription Issues**

- Verify customer creation
- Check payment authorization
- Validate webhook events

3. **Database Sync Issues**

- Check Supabase connection
- Verify RLS policies
- Monitor sync script logs
