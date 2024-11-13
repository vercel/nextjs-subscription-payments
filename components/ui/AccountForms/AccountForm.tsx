// components/AccountForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/CustomButton';
import { toast } from 'sonner';
import { Tables } from '@/types_db';

interface Props {
  user: Tables<'users'>;
  subscription:
    | (Tables<'subscriptions'> & {
        prices:
          | (Tables<'prices'> & {
              products: Tables<'products'> | null;
            })
          | null;
      })
    | null;
}

export default function AccountForm({ user, subscription }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.id || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update account');
      }

      toast.success('Account updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-zinc-200"
        >
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, fullName: e.target.value }))
          }
          maxLength={64}
          className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-200"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-white shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
        />
      </div>

      {subscription && (
        <div className="mt-4 text-sm text-zinc-400">
          <p>
            Subscription Status:{' '}
            <span className="font-semibold capitalize text-white">
              {subscription.status}
            </span>
          </p>
          <p>
            Current Plan:{' '}
            <span className="font-semibold text-white">
              {subscription.prices?.products?.name}
            </span>
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="slim"
          type="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          Update Account
        </Button>
      </div>
    </form>
  );
}
