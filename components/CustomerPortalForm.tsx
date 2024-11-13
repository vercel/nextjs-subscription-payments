// components/CustomerPortalForm.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { Tables } from '@/types_db';
import { toast } from 'sonner';
import Button from './ui/CustomButton';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices:
    | (Price & {
        products: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleSubscriptionCancel = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: subscription?.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      toast.success('Subscription cancelled successfully');
      router.refresh();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      title="Your Plan"
      description={
        subscription
          ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
          : 'You are not currently subscribed to any plan.'
      }
      footer={
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <p className="pb-4 sm:pb-0">Manage your subscription.</p>
          {subscription && (
            <Button
              variant="slim"
              onClick={handleSubscriptionCancel}
              loading={isSubmitting}
            >
              Cancel subscription
            </Button>
          )}
        </div>
      }
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        {subscription ? (
          <>
            {subscriptionPrice}/{subscription?.prices?.interval}
            <div className="mt-4 text-sm">
              Status: <span className="capitalize">{subscription.status}</span>
              <br />
              Next billing date:{' '}
              {new Date(subscription.current_period_end).toLocaleDateString()}
            </div>
          </>
        ) : (
          <Link href="/">Choose your plan</Link>
        )}
      </div>
    </Card>
  );
}
