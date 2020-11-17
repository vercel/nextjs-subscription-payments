import { stripe } from '../../utils/initStripe';
import { supabaseAdmin } from '../../utils/initSupabaseAdmin';
import { createOrRetrieveCustomer } from '../../utils/useDatabase';
import { getURL } from '../../utils/helpers';

const createPortalLink = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;

    const { data: user, error } = await supabaseAdmin.auth.api.getUser(token);
    if (error) return res.status(401).json({ error: error.message });

    const customer = await createOrRetrieveCustomer({
      uuid: user.id,
      email: user.email,
    });

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`,
    });

    return res.status(200).json({ url });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default createPortalLink;
