import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { stripe } from '@/utils/stripe';
import { createOrRetrieveCustomer } from '@/utils/supabase/admin';
import { getURL } from '@/utils/helpers';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    // 1. Destructure the price and quantity from the POST body
    const { price, quantity = 1, metadata = {} } = await req.json();

    try {
      // 2. Get the user from Supabase auth
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);

      const {
        data: { user }
      } = await supabase.auth.getUser();

      // 3. Retrieve or create the customer in Stripe
      const customer = await createOrRetrieveCustomer({
        uuid: user?.id || '',
        email: user?.email || ''
      });

      // 4. Create a checkout session in Stripe
      let session;
      if (price.type === 'recurring') {
        session = await stripe.checkout.sessions.create({
          billing_address_collection: 'required',
          customer,
          customer_update: {
            address: 'auto'
          },
          line_items: [
            {
              price: price.id,
              quantity
            }
          ],
          mode: 'subscription',
          allow_promotion_codes: true,
          subscription_data: {
            metadata
          },
          success_url: `${getURL()}/account`
        });
      } else if (price.type === 'one_time') {
        session = await stripe.checkout.sessions.create({
          billing_address_collection: 'required',
          customer,
          customer_update: {
            address: 'auto'
          },
          line_items: [
            {
              price: price.id,
              quantity
            }
          ],
          mode: 'payment',
          allow_promotion_codes: true,
          success_url: `${getURL()}/account`,
          cancel_url: `${getURL()}/`
        });
      }

      if (session) {
        return new Response(JSON.stringify({ sessionId: session.id }), {
          status: 200
        });
      } else {
        return new Response(
          JSON.stringify({
            error: { statusCode: 500, message: 'Session is not defined' }
          }),
          { status: 500 }
        );
      }
    } catch (err: any) {
      console.log(err);
      return new Response(JSON.stringify(err), { status: 500 });
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
}
