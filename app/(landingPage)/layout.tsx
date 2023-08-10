import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

import { getAuthUser } from "../supabase-server"
import { landingPageConfig } from "@/config/landingpage"

interface LandingPageLayoutProps {
  children: React.ReactNode
}

export default async function landingPageLayout({
  children,
}: LandingPageLayoutProps) {
  const user = await getAuthUser()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <MainNav items={landingPageConfig.mainNav} />
          <nav>
            <Link
              href={user ? "/dashboard" : "/login"}
              className={cn(
                buttonVariants({ variant: "secondary", size: "sm" }),
                "px-4"
              )}
            >
              {user ? "Dashboard" : "Login"}
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
