'use client';

import Button from '@/components/ui/Button';
import { User } from '@supabase/supabase-js';
import { useRouter, usePathname } from 'next/navigation';
import { getErrorRedirect } from '@/utils/helpers';
import { createStripePortal } from '@/utils/stripe/server';

interface Props {
  user: User;
}

export default function ManageSubscriptionButton({ user }: Props) {
  const router = useRouter();
  const currentPath = usePathname();

  const handleStripePortalRequest = async () => {
    try {
      const url = await createStripePortal();
      return router.push(url);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return router.push(getErrorRedirect(currentPath, error.message, 'Please try again later or contact a system administrator.'));
      } else {
        return router.push(getErrorRedirect(currentPath, 'An unknown error occurred.', 'Please try again later or contact a system administrator.'));
      }
    }
  };

  return (
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <p className="pb-4 sm:pb-0">Manage your subscription on Stripe.</p>
      <Button
        variant="slim"
        disabled={!user}
        onClick={handleStripePortalRequest}
      >
        Open customer portal
      </Button>
    </div>
  );
}
