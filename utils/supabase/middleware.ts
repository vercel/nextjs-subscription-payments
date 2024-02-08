import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

// Define a function to create a Supabase client for server-side operations
// The function takes a Next.js request object as an argument
export const createClient = (request: NextRequest) => {
  // Create an unmodified response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Create a Supabase client with the Supabase URL and anonymous key from the environment
  // Define a cookies object with methods for interacting with the request's cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // The get method is used to retrieve a cookie by its name
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        // The set method is used to set a cookie with a given name, value, and options
        // If the cookie is updated, the cookies for the request and response are also updated
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        // The remove method is used to delete a cookie by its name
        // If the cookie is removed, the cookies for the request and response are also updated
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Return the Supabase client and the response object
  return { supabase, response }
}