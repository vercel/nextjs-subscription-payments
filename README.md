# Next.js SaaS Starter for African Markets

The all-in-one starter kit for building SaaS applications with local payment integrations for the African market.

## Features

- Secure user management and authentication with [Supabase](https://supabase.io/docs/guides/auth)
- Powerful data access & management tooling on top of PostgreSQL with [Supabase](https://supabase.io/docs/guides/database)
- Integrated payment processing:
  - [Stripe](https://stripe.com/docs/payments/checkout) for international payments
  - [Paystack](https://paystack.com/docs) for local card payments
  - MPESA integration for mobile money (coming soon)
- Automatic syncing of pricing plans and subscription statuses via webhooks
- Team management and role-based access control
- Dark/light mode support
- Responsive dashboard UI with [shadcn/ui](https://ui.shadcn.com)

## Demo

- https://saas-template.fbien.com

[![Screenshot of demo](./public/demo.png)](https://saas-template.fbien.com)

## Architecture

![Architecture diagram](./public/architecture_diagram.png)

The template uses the following technology stack:

- [Next.js 14](https://nextjs.org) - React framework for building performant apps with the best developer experience
- [Auth.js](https://authjs.dev) - Handle user authentication with ease with providers like GitHub, Twitter, etc.
- [Supabase](https://supabase.io) - Open source Firebase alternative for database and authentication
- [Stripe](https://stripe.com) - International payment processing for subscription business models
- [Paystack](https://paystack.com) - Local payment processing for African markets
- [Vercel](https://vercel.com) - Platform for deploying and scaling Next.js applications

## Step-by-step setup

### 1. Clone and Deploy

#### Option 1: Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffarajabien%2Fsupabase-saas-starter)

The deployment will:

- Create a new repository with this template
- Set up a new Supabase project
- Configure necessary environment variables
- Run database migrations

#### Option 2: Clone Locally

```bash
git clone https://github.com/farajabien/supabase-saas-starter
cd supabase-saas-starter
pnpm install
```

### 2. Configure Supabase

1. Create a new project on [Supabase](https://app.supabase.com)
2. Run the SQL migrations in your [SQL editor](https://app.supabase.com/project/_/sql)
3. Set up authentication providers in [Auth settings](https://app.supabase.com/project/_/auth/providers)
4. Copy environment variables from [API settings](https://app.supabase.com/project/_/settings/api)

### 3. Configure Payment Providers

#### Stripe Setup (International Payments)

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
3. Set up webhook endpoint at `your-domain.com/api/webhooks/stripe`
4. Create products and pricing plans

#### Paystack Setup (Local Payments)

1. Create a [Paystack account](https://paystack.com)
2. Get your API keys from the [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer)
3. Set up webhook endpoint at `your-domain.com/api/webhooks/paystack`
4. Configure supported payment methods (cards, bank transfers, MPESA)

### 4. Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
PAYSTACK_WEBHOOK_SECRET=

# General
NEXT_PUBLIC_SITE_URL=
```

### 5. Run Locally

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## Payment Flow

The template supports two payment flows:

### International Payments (Stripe)

- Credit/debit cards
- Automatic subscription management
- Customer portal for subscription management

### Local Payments (Paystack)

- Local credit/debit cards
- Bank transfers
- MPESA mobile money (coming soon)
- Subscription management through dashboard

## Contributing

This is an open-source project. Feel free to contribute by:

- Reporting bugs
- Suggesting features
- Submitting pull requests

## Support

For questions, feature requests, or support:

- Email: farajabien@gmail.com
- WhatsApp: +254793643308

## License

MIT License
