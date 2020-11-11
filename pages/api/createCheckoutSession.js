import { supabaseAdmin } from '../../utils/initSupabaseAdmin';
import { createOrRetrieveCustomer } from '../../utils/useDatabase';

const createCheckoutSession = async (req, res) => {
  const token = req.headers.token;

  const { data: user, error } = await supabaseAdmin.auth.api.getUser(token);
  const customer = await createOrRetrieveCustomer({
    uuid: user.id,
    email: user.email,
  });

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json({ customer });
};

export default createCheckoutSession;
