import { stripe } from '../../utils/initStripe';
import { supabaseAdmin } from '../../utils/initSupabaseAdmin';
import { createOrRetrieveCustomer } from '../../utils/useDatabase';

const createCheckoutSession = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const {
      price,
      success_url,
      cancel_url,
      quantity = 1,
      payment_method_types = ['card'],
      metadata = {},
      tax_rates = [],
      allow_promotion_codes = false,
      trial_from_plan = true,
      line_items,
    } = req.body;

    const { data: user, error } = await supabaseAdmin.auth.api.getUser(token);
    if (error) return res.status(401).json({ error: error.message });

    const customer = await createOrRetrieveCustomer({
      uuid: user.id,
      email: user.email,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types,
      customer,
      line_items: line_items
        ? line_items
        : [
            {
              price,
              quantity,
              tax_rates,
            },
          ],
      mode: 'subscription',
      allow_promotion_codes,
      subscription_data: {
        trial_from_plan,
        metadata,
      },
      success_url,
      cancel_url,
    });

    return res.status(200).json({ sessionId: session.id });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default createCheckoutSession;
