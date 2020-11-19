# Next.js SaaS Starter

The all-in-one starter kit for high-performance SaaS applications. With a few clicks, Next.js developers can clone, deploy and fully customize their own SaaS subscription application.

## Features

- Secure user management and authentication with [Supabase](https://supabase.io/docs/guides/auth).
- Powerful data access & management tooling on top of PostgreSQL with [Supabase](https://supabase.io/docs/guides/database).
- Integration with Stripe Checkout and the Stripe customer portal, all plumbing already set up.
- Automatic syncing of pricing plans, and subscription statuses via Stripe webhooks.

## Demo

- TODO

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) or [npx](https://github.com/zkat/npx#readme) to bootstrap the example:

```bash
npx create-next-app --example saas-starter my-saas-app
# or
yarn create next-app --example saas-starter my-saas-app
```

## Configuration

### 1. Create new Supabase project

Sign up to Supabase - [https://app.supabase.io](https://app.supabase.io) and create a new project. Wait for your database to start.

### 2. Set up your database tables and auth policies

TODO

#### [Optional] - Set up OAuth providers

You can use third-party login providers like GitHub or Google. Refer to the [docs](https://supabase.io/docs/guides/auth#third-party-logins) to learn how to configure these.

### 3. Get your Supabase credentials

Create a copy of `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Go to the Project Settings (the cog icon), open the API tab, and find your API URL, the public `anon` key, and the secret `service_role` key and set them in your newly created `.env.local` file.

### 4. Get your Stripe credentials

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

## Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/git?s=https%3A%2F%2Fgithub.com%2Fsupabase%2Fsupabase%2Ftree%2Fmaster%2Fexamples%2Fnextjs-with-supabase-auth&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_KEY&envDescription=Find%20the%20Supabase%20URL%20and%20key%20in%20your%20auto-generated%20docs%20at%20app.supabase.io&project-name=nextjs-with-supabase-auth&repo-name=nextjs-with-supabase-auth)

You will be asked for the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_KEY` from step 2 above.

### Configure Supabase Auth

After deploying, copy the deployment URL and navigate to your Supabase project settings (Authentication > Settings) and set your site url.

## Configure Stripe

### Configure Stripe webhooks

You need to set up a webhook that synchronizes relevant details from Stripe with your Cloud Firestore. This includes product and pricing data from the Stripe Dashboard, as well as customer's subscription details.

Here's how to set up the webhook and configure your extension to use it:

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

1. Update your webhook’s signing secret (such as, `whsec_12345678`) in Vercel: Project > Settings > Environment Variables.

### Create product and pricing information

For Stripe to automatically bill your users for recurring payments, you need to create your product and pricing information in the [Stripe Dashboard](https://dashboard.stripe.com/test/products). When you create or update your product and price information in the Stripe Dashboard these details are automatically synced with your Supabase database, as long as the webhook is configured correctly as described above.

Stripe Checkout currently supports pricing plans that bill a predefined amount at a specific interval. More complex plans (e.g. different pricing tiers or seats) are not yet supported.

For example, this extension works well for business models with different pricing tiers, e.g.:

- Product 1: Basic membership
  - Price 1: 10 USD per month
  - Price 2: 100 USD per year
  - Price 3: 8 GBP per month
  - Price 4: 80 GBP per year
  - [...]: additional currency and interval combinations
- Product 2: Premium membership
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

That's it, you're now ready to earn recurring revenue from your users \o/
