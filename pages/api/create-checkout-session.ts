import { NextApiHandler } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { stripe } from '@/app/(utils)/stripe';
import { createOrRetrieveCustomer } from '@/app/(utils)/supabase-admin';
import { getURL } from '@/app/(utils)/helpers';

const CreateCheckoutSession: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    // 1. Destructure the price and quantity from the POST body
    const { price, quantity = 1, metadata = {} } = req.body;

    try {
      // 2. Get the user from Supabase auth
      const supabase = createServerSupabaseClient({ req, res });
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
          payment_method_types: ['card'],
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
          automatic_tax: {
            enabled: true
          },
          mode: 'subscription',
          allow_promotion_codes: true,
          subscription_data: {
            metadata
          },
          success_url: `${getURL()}/account`,
          cancel_url: `${getURL()}/dashboard`
        });
      } else if (price.type === 'one_time') {
        session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
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
          automatic_tax: {
            enabled: true
          },
          mode: 'payment',
          allow_promotion_codes: true,
          success_url: `${getURL()}/account`,
          cancel_url: `${getURL()}/dashboard`
        });
      }

      if (session) {
        return res.status(200).json({ sessionId: session.id });
      } else {
        return res
          .status(500)
          .json({
            error: { statusCode: 500, message: 'Session is not defined' }
          });
      }
    } catch (err: any) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default CreateCheckoutSession;
