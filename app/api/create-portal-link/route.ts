import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { stripe } from '@/utils/stripe';
import { createOrRetrieveCustomer } from '@/utils/supabase/admin';
import { getURL } from '@/utils/helpers';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    // Get basePath from request URL for constructing toast redirects
    const requestUrl = new URL(req.url);
    const basePath = requestUrl.pathname.endsWith('/') ? requestUrl.pathname : requestUrl.pathname + '/';
    
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
            message: `${basePath}?error=${encodeURIComponent(
              'Could not get user session')}&error_description=${encodeURIComponent(
            'Please log out and log back in and try again.')}`
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
              message: `${basePath}?error=${encodeURIComponent(
                err.name)}&error_description=${encodeURIComponent(
              'Unable to access customer record. Please contact a system administrator.')}`
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
            message: `${basePath}?error=${encodeURIComponent(
              'Hmm... Something went wrong.')}&error_description=${encodeURIComponent(
            'Unable to create a billing portal. Please contact a system administrator.')}`
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
