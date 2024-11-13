# Next.js SaaS Starter for African Markets

The all-in-one starter kit for building SaaS applications with local payment integrations for the African market.

## Features

- Secure user management and authentication with [Supabase](https://supabase.io/docs/guides/auth)
- Powerful data access & management tooling on top of PostgreSQL with [Supabase](https://supabase.io/docs/guides/database)
- Integrated payment processing with [Paystack](https://paystack.com/docs) for:
  - Local card payments
  - Bank transfers
  - USSD payments
  - Mobile money (coming soon)
- Automatic syncing of pricing plans and subscription statuses via webhooks
- Team management and role-based access control
- Dark/light mode support
- Responsive dashboard UI with [shadcn/ui](https://ui.shadcn.com)

## Architecture

The template uses the following technology stack:

- [Next.js 14](https://nextjs.org)
- [Auth.js](https://authjs.dev)
- [Supabase](https://supabase.io)
- [Paystack](https://paystack.com)
- [Vercel](https://vercel.com)

## Setup

<<<<<<< HEAD
### 1. Clone and Install

```bash
git clone https://github.com/yourusername/your-repo
cd your-repo
=======
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
>>>>>>> main
pnpm install
```

### 2. Configure Supabase

1. Create a project at [Supabase](https://app.supabase.com)
2. Run database migrations
3. Set up auth providers
4. Copy environment variables

### 3. Configure Paystack

1. Create a [Paystack account](https://paystack.com)
2. Get your API keys
3. Set up webhook endpoint at `your-domain.com/api/webhooks`
4. Configure payment methods

### 4. Environment Variables

Create a `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=

# General
NEXT_PUBLIC_SITE_URL=
```

### 5. Run Locally

```bash
pnpm dev
```

## Payment Flow

The template handles payments through Paystack:

1. User selects a plan
2. Redirected to Paystack checkout
3. Payment processing through:
   - Local credit/debit cards
   - Bank transfers
   - USSD
   - Mobile money (coming soon)
4. Webhook handles subscription events
5. Customer portal for subscription management

## Webhooks

Paystack webhooks handle:

- Subscription creation
- Subscription updates
- Payment success/failure
- Subscription cancellation

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a PR

## Support

For questions, features, or support:

- Email: your.email@example.com
- Twitter: @yourhandle

## License

MIT License
