import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, ReactNode } from 'react';

import LoadingDots from 'components/ui/LoadingDots';
import Button from 'components/ui/Button';
import { useUser } from 'utils/useUser';
import { postData } from 'utils/helpers';

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="border border-gray-700	max-w-3xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-gray-300">{description}</p>
        {children}
      </div>
      <div className="border-t border-gray-700 bg-gray-900 p-4 text-gray-500 rounded-b-md">{footer}</div>
    </div>
  );
}

export default function Account() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userLoaded, user, session, userDetails, subscription } = useUser();

  useEffect(() => {
    if (!user) router.replace('/signin');
  }, [user]);

  const redirectToCustomerPortal = async () => {
    setLoading(true);
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link',
        token: session.access_token
      });
      window.location.assign(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
    setLoading(false);
  };

  const subscriptionName = subscription && subscription?.prices?.products?.[0]?.name;
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
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">Account</h1>
          <p className="mt-5 text-xl text-gray-200 sm:text-center sm:text-2xl max-w-2xl m-auto">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <Card
          title="Your Plan"
          description={subscriptionName && `You are currently on the ${subscriptionName} plan.`}
          footer={
            <div className="flex items-start justify-between flex-col sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">Manage your subscription on Stripe.</p>
              <Button variant="slim" loading={loading} disabled={loading || !subscription} onClick={redirectToCustomerPortal}>
                Open customer portal
              </Button>
            </div>
          }
        >
          <div className="text-xl mt-8 mb-4 font-semibold">
            {!userLoaded ? (
              <div className="h-12 mb-6">
                <LoadingDots />
              </div>
            ) : subscriptionPrice ? (
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
            {userDetails ? (
              `${userDetails?.full_name ?? ''}`
            ) : (
              <div className="h-8 mb-6">
                <LoadingDots />
              </div>
            )}
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Please enter the email address you want to use to login."
          footer={<p>We will email you to verify the change.</p>}
        >
          <p className="text-xl mt-8 mb-4 font-semibold">{user ? user.email : undefined}</p>
        </Card>
      </div>
    </section>
  );
}
