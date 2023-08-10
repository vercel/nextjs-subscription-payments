import { Database } from '@/types/types_db';
import { Post, User } from "@/types/main"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { cache } from 'react';

export const createServerSupabaseClient = cache(() =>{
  const cookieStore = cookies();
  return createServerComponentClient<Database>({ cookies: () => cookieStore });
});



export async function getSubscription() {
  const supabase = createServerSupabaseClient();
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .single()
      .throwOnError();
    return subscription;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getSupabaseSession() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getAuthUser() {
  const supabase = createServerSupabaseClient()
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getUser() {
  const supabase = createServerSupabaseClient()
  try {
    const { data } = await supabase.from("users").select("*").single()
    return data
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

export async function getPostForUser(postId: Post["id"], userId: User["id"]) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .eq("author_id", userId)
    .single()
  return data ? { ...data, content: data.content as unknown as JSON } : null
}

export const getActiveProductsWithPrices = async () => {
  const supabase = createServerSupabaseClient();
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

// export async function getPostForUser(postId: Post["id"], userId: User["id"]) {
//   const supabase = createServerSupabaseClient()
//   const { data } = await supabase
//     .from("posts")
//     .select("*")
//     .eq("id", postId)
//     .eq("author_id", userId)
//     .single()
//   return data ? { ...data, content: data.content as unknown as JSON } : null
// }