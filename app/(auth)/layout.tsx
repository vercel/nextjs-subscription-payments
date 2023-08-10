import { redirect } from "next/navigation"

import { getAuthUser } from '@/app/supabase-server';

interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const user = await getAuthUser();

  if (user) {
    return redirect('/dashboard');
  }

  return <div className="min-h-screen">{children}</div>
}
