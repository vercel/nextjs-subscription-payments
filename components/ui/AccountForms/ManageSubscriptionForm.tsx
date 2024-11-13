// components/ManageSubscriptionForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Tables } from '@/types_db';
import Button from '@/components/ui/CustomButton';

interface Props {
  subscription: Tables<'subscriptions'> & {
    prices:
      | (Tables<'prices'> & {
          products: Tables<'products'> | null;
        })
      | null;
  };
}

export default function ManageSubscriptionForm({ subscription }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription.prices?.currency || 'USD',
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id })
      });

      if (!response.ok) throw new Error('Failed to cancel subscription');

      toast.success('Subscription cancelled successfully');
      router.refresh();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscription/reactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: subscription.id })
      });

      if (!response.ok) throw new Error('Failed to reactivate subscription');

      toast.success('Subscription reactivated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast.error('Failed to reactivate subscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Plan Details */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-zinc-200">
          {subscription.prices?.products?.name} Plan
        </h3>
        <p className="text-zinc-400">
          {formatCurrency(subscription.prices?.unit_amount || 0)}/
          {subscription.prices?.interval}
        </p>
      </div>

      {/* Status and Actions */}
      <div className="space-y-4">
        <div className="text-sm text-zinc-400">
          <p>
            Status:{' '}
            <span className="capitalize text-white">{subscription.status}</span>
          </p>
          <p>
            Next billing date:{' '}
            {new Date(subscription.current_period_end).toLocaleDateString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {subscription.status === 'active' &&
            !subscription.cancel_at_period_end && (
              <Button
                variant="slim"
                onClick={handleCancel}
                loading={isLoading}
                className="w-full"
              >
                Cancel Subscription
              </Button>
            )}

          {subscription.status === 'active' &&
            subscription.cancel_at_period_end && (
              <div className="space-y-2">
                <p className="text-sm text-zinc-400">
                  Your subscription will end on{' '}
                  {new Date(
                    subscription.current_period_end
                  ).toLocaleDateString()}
                </p>
                <Button
                  variant="slim"
                  onClick={handleReactivate}
                  loading={isLoading}
                  className="w-full"
                >
                  Reactivate Subscription
                </Button>
              </div>
            )}

          {subscription.status === 'canceled' && (
            <div className="space-y-2">
              <p className="text-sm text-zinc-400">
                Your subscription has ended. Choose a new plan to continue.
              </p>
              <Button
                variant="slim"
                onClick={() => router.push('/pricing')}
                className="w-full"
              >
                View Plans
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
