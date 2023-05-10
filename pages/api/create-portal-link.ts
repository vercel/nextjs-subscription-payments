import { NextApiHandler } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

import { stripe } from '@/app/(utils)/stripe';
import { createOrRetrieveCustomer } from '@/app/(utils)/supabase-admin';
import { getURL } from '@/app/(utils)/helpers';

const CreatePortalLink: NextApiHandler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const supabase = createServerSupabaseClient({ req, res });
      const {
        data: { user }
      } = await supabase.auth.getUser();
      console.log(user);

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
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default CreatePortalLink;
