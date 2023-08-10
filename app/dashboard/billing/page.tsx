import { redirect } from "next/navigation"

import { stripe } from "@/lib/stripe"
import { getSubscription } from "@/app/supabase-server"
import { getAuthUser } from "@/app/supabase-server"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
// import { BillingForm } from "@/components/billing-form"
import { DashboardHeader } from "@/components/header"
import { Icons } from "@/components/icons"
import { DashboardShell } from "@/components/shell"

export const metadata = {
  title: "Billing",
  description: "Manage billing and your subscription plan.",
}

export default async function BillingPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect("/signin")
  }

  // const subscriptionPlan = await getSubscription(user.id)

  // If user has a pro plan, check cancel status on Stripe.
  let isCanceled = false
  // if (subscriptionPlan.isPro && subscriptionPlan.stripe_subscription_id) {
  //   const stripePlan = await stripe.subscriptions.retrieve(
  //     subscriptionPlan.stripe_subscription_id
  //   )
  //   isCanceled = stripePlan.cancel_at_period_end
  // }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Billing"
        text="Manage billing and your subscription plan."
      />
      <div className="grid gap-8">
        <Alert className="!pl-14">
          <Icons.warning />
          <AlertTitle>This is a demo app.</AlertTitle>
          <AlertDescription>
            Taxonomy app is a demo app using a Stripe test environment. You can
            find a list of test card numbers on the{" "}
            <a
              href="https://stripe.com/docs/testing#cards"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-8"
            >
              Stripe docs
            </a>
            .
          </AlertDescription>
        </Alert>
        {/* <BillingForm
          subscriptionPlan={{
            ...subscriptionPlan,
            isCanceled,
          }}
        /> */}
      </div>
    </DashboardShell>
  )
}
