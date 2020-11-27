# Next.js Subscription Payments Starter

The all-in-one starter kit for high-performance SaaS applications. With a few clicks, Next.js developers can clone, deploy and fully customize their own SaaS subscription application.

## Features

- Secure user management and authentication with [Supabase](https://supabase.io/docs/guides/auth).
- Powerful data access & management tooling on top of PostgreSQL with [Supabase](https://supabase.io/docs/guides/database).
- Integration with [Stripe Checkout](https://stripe.com/docs/payments/checkout) and the [Stripe customer portal](https://stripe.com/docs/billing/subscriptions/customer-portal), all plumbing already set up.
- Automatic syncing of pricing plans, and subscription statuses via [Stripe webhooks](https://stripe.com/docs/webhooks).

## Demo

- https://nextjs-subscription-payments-starter.vercel.app/

[![Screenshot of demo](./public/demo.png)](https://nextjs-subscription-payments-starter.vercel.app/)

## Architecture

![Architecture diagram](./public/architecture_diagram.svg)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) or [npx](https://github.com/zkat/npx#readme) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel/nextjs-subscription-payments my-saas-app
# or
yarn create next-app --example https://github.com/vercel/nextjs-subscription-payments my-saas-app
```

## Configuration

### 1. Create new Supabase project

Sign up to Supabase - [https://app.supabase.io](https://app.supabase.io) and create a new project. Wait for your database to start.

### 2. Set up your database tables and auth policies

In your Supabase dashboard, go to the SQL editor. There, the welcome tab has a "Quick Start" section. Select the "Stripe Subscriptions" quick start (it has the same content as the [`schema.sql` file](./schema.sql)) and hit the "RUN" button.

#### [Optional] - Set up OAuth providers

You can use third-party login providers like GitHub or Google. Refer to the [docs](https://supabase.io/docs/guides/auth#third-party-logins) to learn how to configure these.

### 3. Get your Supabase credentials

Create a copy of `.env.local.example`:

```bash
cp .env.local.example .env.local
```

In your [Supabase Dashboard](https://app.supabase.io/), go to the Project Settings (the cog icon), open the API tab, and find your API URL, the public `anon` key, and the secret `service_role` key and set them in your newly created `.env.local` file.

### 4. Get your Stripe credentials

In your [Stripe Dashboard](https://dashboard.stripe.com/apikeys), go to Developers > API keys, and copy the publishable key and the secret key to your `.env.local` file.

The webhook secret differs for local testing vs. when deployed to Vercel. Follow the instructions below to get the corresponding webhook secret.

## Test locally with the Stripe CLi

### Install dependencies and run the Next.js client

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

### Use the Stripe CLI to test webhooks

First [install the CLI](https://stripe.com/docs/stripe-cli) and [link your Stripe account](https://stripe.com/docs/stripe-cli#login-account).

Next, start the webhook forwarding:

```bash
stripe listen --forward-to=localhost:3000/api/webhooks
```

The CLI will print a webhook secret (such as, `whsec_***`) to the console. Set `STRIPE_WEBHOOK_SECRET` to this value in your `.env.local` file.

## Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnextjs-subscription-payments&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,STRIPE_SECRET_KEY,STRIPE_WEBHOOK_SECRET&envDescription=Add%20your%20API%20keys%20from%20the%20Supabase%20and%20Stripe%20Dashboards&project-name=nextjs-subscription-payments&repo-name=nextjs-subscription-payments&demo-title=Next.js%20Subscription%20Payments%20Starter%20Demo&demo-url=https%3A%2F%2Fnextjs-subscription-payments-starter.vercel.app%2F&demo-image=https%3A%2F%2Fnextjs-subscription-payments-starter.vercel.app%2Fdemo.png)

### Configure Supabase Auth

After deploying, copy the deployment URL and navigate to your Supabase project settings (Authentication > Settings) and set your site url.

## Configure Stripe

### Configure Stripe webhooks

You need to set up a webhook that synchronizes relevant details from Stripe with your Supabase Database. This includes product and pricing data from the Stripe Dashboard, as well as customers' subscription details.

Here's how to set up the webhook and configure your project to use it:

1. Configure your webhook:

   1. Go to the [Stripe dashboard.](https://dashboard.stripe.com/webhooks)

   1. Set your endpoint URL: https://your-project.vercel.app/api/webhooks

   1. Select the following events:

   - `product.created`
   - `product.updated`
   - `price.created`
   - `price.updated`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

1. Once created, you can click to reveal your webhook signing secret. Copy the webhook secret (`whsec_***`) and add it to the environment variables in your [Vercel Dashboard](https://vercel.com/dashboard): Project > Settings > Environment Variables.

**NOTE:** After adding an environment variable, you will need to rebuild your project for it to become available within your code. In your project Dashboard, navigate to the "Deployments" tab, select the most recent deployment, click the overflow menu button (next to the "Visit" button) and select "Redeploy".

### Create product and pricing information

For Stripe to automatically bill your users for recurring payments, you need to create your product and pricing information in the [Stripe Dashboard](https://dashboard.stripe.com/test/products). When you create or update your product and price information, the changes are automatically synced with your Supabase database, as long as the webhook is configured correctly as described above.

Stripe Checkout currently supports pricing plans that bill a predefined amount at a specific interval. More complex plans (e.g. different pricing tiers or seats) are not yet supported.

For example, you can create business models with different pricing tiers, e.g.:

- Product 1: Hobby
  - Price 1: 10 USD per month
  - Price 2: 100 USD per year
  - Price 3: 8 GBP per month
  - Price 4: 80 GBP per year
  - [...]: additional currency and interval combinations
- Product 2: Freelancer
  - Price 1: 20 USD per month
  - Price 2: 20 USD per year
  - Price 3: 16 GBP per month
  - Price 4: 160 GBP per year
  - [...]: additional currency and interval combinations

### Configure the Stripe customer portal

1. Set your custom branding in the [settings](https://dashboard.stripe.com/settings/branding).
1. Configure the Customer Portal [settings](https://dashboard.stripe.com/test/settings/billing/portal).
1. Toggle on "Allow customers to update their payment methods".
1. Toggle on "Allow customers to update subscriptions".
1. Toggle on "Allow customers to cancel subscriptions".
1. Add the products and prices that you want to allow customer to switch between.
1. Set up the required business information and links.

## That's it

That's it, you're now ready to earn recurring revenue from your customers \o/
