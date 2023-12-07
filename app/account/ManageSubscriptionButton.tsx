'use client';

import Button from '@/components/ui/Button';
import { postData } from '@/utils/helpers';

import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Props {
  user: User;
}

export default function ManageSubscriptionButton({ user }: Props) {
  const router = useRouter();
  const redirectToCustomerPortal = async () => {
    const { error, url } = await postData({
      url: '/api/create-portal-link'
    });
    if (error) {
      return router.push(error.message);
    } else {
      return router.push(url);
    }
  };

  return (
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <p className="pb-4 sm:pb-0">Manage your subscription on Stripe.</p>
      <Button
        variant="slim"
        disabled={!user}
        onClick={redirectToCustomerPortal}
      >
        Open customer portal
      </Button>
    </div>
  );
}
