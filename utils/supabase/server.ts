import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types_db';
import { cache } from 'react';

// Define a function to create a Supabase client for server-side operations
// The function takes a cookie store created with next/headers cookies as an argument
export const createClient = (cookieStore: ReturnType<typeof cookies>) => {
  return createServerClient<Database>(
    // Pass Supabase URL and anonymous key from the environment to the client
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    
    // Define a cookies object with methods for interacting with the cookie store and pass it to the client
    {
      cookies: {
        // The get method is used to retrieve a cookie by its name
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // The set method is used to set a cookie with a given name, value, and options
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // If the set method is called from a Server Component, an error may occur
            // This can be ignored if there is middleware refreshing user sessions
          }
        },
        // The remove method is used to delete a cookie by its name
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // If the remove method is called from a Server Component, an error may occur
            // This can be ignored if there is middleware refreshing user sessions
          }
        }
      }
    }
  );
};

// createCacheClient is a function that creates a Supabase client with a cookie store
// It uses the 'cache' function from 'react' to memoize the result of the function
// This means that the same Supabase client will be returned on subsequent calls, reducing the overhead of creating a new client each time
const createCacheClient = cache(() => {
  const cookieStore = cookies();
  return createClient(cookieStore);
});

// getSession is an asynchronous function that retrieves the current session from Supabase
// It uses the cached Supabase client to call the 'getSession' method
// If the session retrieval is successful, it returns the session data
// If an error occurs during the session retrieval, it logs the error and returns null
export async function getSession() {
  const supabase = createCacheClient();
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// getUser is an asynchronous function that retrieves the current user from Supabase auth.user
// It uses the cached Supabase client to call the 'getUser' method
// If the user retrieval is successful, it returns the user data
// If an error occurs during the user retrieval, it logs the error and returns null
export async function getUser() {
  const supabase = createCacheClient();
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// getUserDetails is an asynchronous function that retrieves the details of the current user from the 'users' table in Supabase
// It uses the cached Supabase client to select all columns from the 'users' table for the current user
// If the user details retrieval is successful, it returns the user details
// If an error occurs during the user details retrieval, it logs the error and returns null
export async function getUserDetails() {
  const supabase = createCacheClient();
  try {
    const { data: userDetails } = await supabase
      .from('users')
      .select('*')
      .single();
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// getSubscription is an asynchronous function that retrieves the current user's subscription from the 'subscriptions' table in Supabase
// It uses the cached Supabase client to select all columns from the 'subscriptions' table for the current user, including related 'prices' and 'products'
// It only retrieves subscriptions with a status of 'trialing' or 'active'
// If the subscription retrieval is successful, it returns the subscription data
// If an error occurs during the subscription retrieval, it logs the error and returns null
export async function getSubscription() {
  const supabase = createCacheClient();
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .maybeSingle()
      .throwOnError();
    return subscription;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// getActiveProductsWithPrices is an asynchronous function that retrieves all active products with their prices from the 'products' table in Supabase
// It uses the cached Supabase client to select all columns from the 'products' table where 'active' is true, including related 'prices'
// It also filters the 'prices' to only include those where 'active' is true
// The results are ordered by the 'index' metadata of the products and the 'unit_amount' of the prices
// If the products retrieval is successful, it returns the products data
// If an error occurs during the products retrieval, it logs the error and returns an empty array
export const getActiveProductsWithPrices = async () => {
  const supabase = createCacheClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
  }
  return data ?? [];
};