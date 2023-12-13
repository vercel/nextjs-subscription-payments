import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { stripe } from '@/utils/stripe/server';
import { createOrRetrieveCustomer } from '@/utils/supabase/admin';
import { getURL, getErrorRedirect } from '@/utils/helpers';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) return new Response(
        JSON.stringify({
          error: { 
            statusCode: 500, 
            message: getErrorRedirect('/', 'Could not get user session',
            'Please log out and log back in and try again.')
          }
        }),
        { status: 500 }
      );

      let customer: string;
      try {
        customer = await createOrRetrieveCustomer({
          uuid: user.id || '',
          email: user.email || ''
        });
      } catch (err: any) {
        console.error(err);
        return new Response(
          JSON.stringify({
            error: { 
              statusCode: 500, 
              message: getErrorRedirect('/', 'Unable to access customer record.',
              'Please try again later or contact a system administrator.')
            }
          }),
          { status: 500 }
        );
      }

      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/account')
      });
      return new Response(JSON.stringify({ url }), {
        status: 200
      });
    } catch (err: any) {
      console.log(err);
      return new Response(
        JSON.stringify({
          error: {
            statusCode: 500,
            message: getErrorRedirect('/', 'Could not create billing portal',
            'Please try again later or contact a system administrator.'),
          }
        }),
        { status: 500 }
      );
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
}
