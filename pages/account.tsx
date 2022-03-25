import Link from 'next/link';
import { useState, ReactNode, useEffect } from 'react';

import LoadingDots from 'components/ui/LoadingDots';
import Button from 'components/ui/Button';
import { useUser } from 'utils/useUser';
import { postData } from 'utils/helpers';

import { withAuthRequired, User } from '@supabase/supabase-auth-helpers/nextjs';
import Input from '@/components/ui/Input';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-zinc-700	max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="border-t border-zinc-700 bg-zinc-900 p-4 text-zinc-500 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}

export const getServerSideProps = withAuthRequired({ redirectTo: '/signin' });

export default function Account({ user }: { user: User }) {
  const [loading, setLoading] = useState(false);
  const { isLoading, subscription, userDetails, updateUserFullname } =
    useUser();
  const [fullName, setFullName] = useState('');
  const [submitingFullName, setSubmitingFullName] = useState(false);
  const [fullNameUpdateResult, setFullNameUpdateResult] = useState<{
    type: string;
    content: string;
  } | null>(null);

  useEffect(() => {
    if (isLoading && userDetails && userDetails.full_name) {
      setFullName(userDetails.full_name);
    }
  }, [isLoading, userDetails, setFullName]);

  async function handleClickUserFullName() {
    setSubmitingFullName(true);

    const error = await updateUserFullname(user.id, fullName);
    setSubmitingFullName(false);

    if (error) {
      setFullNameUpdateResult({
        type: 'error',
        content: 'Something went wrong!'
      });
    } else {
      setFullNameUpdateResult({
        type: 'note',
        content: 'Name updated with success!'
      });
    }
  }

  function handleFullNameChange(fullNameChanged: string) {
    setFullName(fullNameChanged);
    setFullNameUpdateResult(null);
  }

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link'
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  return (
    <section className="bg-black mb-32">
      <div className="max-w-6xl mx-auto pt-8 sm:pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : ''
          }
          footer={
            <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                Manage your subscription on Stripe.
              </p>
              <Button
                variant="slim"
                loading={loading}
                disabled={loading || !subscription}
                onClick={redirectToCustomerPortal}
              >
                Open customer portal
              </Button>
            </div>
          }
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {isLoading ? (
              <div className="h-12 mb-6">
                <LoadingDots />
              </div>
            ) : subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href="/">
                <a>Choose your plan</a>
              </Link>
            )}
          </div>
        </Card>
        <Card
          title="Your Name"
          description="Please enter your full name, or a display name you are comfortable with."
          footer={<p>Please use 64 characters at maximum.</p>}
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Name"
                value={fullName}
                onChange={handleFullNameChange}
              />
              <Button
                variant="slim"
                type="submit"
                onClick={handleClickUserFullName}
                loading={submitingFullName}
                disabled={submitingFullName}
              >
                Update name
              </Button>

              {fullNameUpdateResult && (
                <span
                  className={`text-sm ${
                    fullNameUpdateResult.type === 'note'
                      ? 'text-green-500'
                      : 'text-pink-500'
                  }`}
                >
                  {fullNameUpdateResult.content}
                </span>
              )}
            </div>
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className="text-xl mt-8 mb-4 font-semibold">
            {user ? user.email : undefined}
          </p>
        </Card>
      </div>
    </section>
  );
}
