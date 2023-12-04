import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { getURL } from '@/utils/helpers';

export async function POST(req: Request) {  
  if (req.method === 'POST') {
    // Extract data from request
    const { email } = await req.json();

    const redirectURL = `${getURL()}auth/password_reset`;
    
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectURL
      })

    if (error) {
      return new Response(JSON.stringify({ success: false, message: error.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else if (data) {
    // Handle successful authentication...
    return new Response(JSON.stringify({ success: true, message: 'Success!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    } else {
      return new Response(JSON.stringify({ success: false, message: 'Something went wrong.' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
}