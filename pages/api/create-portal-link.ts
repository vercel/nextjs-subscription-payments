import { stripe } from 'utils/stripe';
import { getUser } from 'utils/supabase-admin';
import { createOrRetrieveCustomer } from 'utils/useDatabase';
import { getURL } from 'utils/helpers';
import { NextApiRequest, NextApiResponse } from 'next';

const createPortalLink = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const token = req.headers.token as string;

    try {
      const user = await getUser(token);
      if (!user) throw Error('Could not get user');
      const customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || ''
      });

      if (!customer) throw Error('Could not get customer');
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: `${getURL()}/account`
      });

      return res.status(200).json({ url });
    } catch (err: any) {
      console.log(err);
      res.status(500).json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default createPortalLink;
