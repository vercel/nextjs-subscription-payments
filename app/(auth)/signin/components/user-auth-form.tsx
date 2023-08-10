"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Auth } from "@supabase/auth-ui-react"

import { Database } from '@/types/types_db'
import { getURL } from "@/lib/utils"

export default function UserAuthForm() {
  const supabase = createClientComponentClient<Database>()

  return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={[]}
        redirectTo={getURL()}
        magicLink={true}
        appearance={{
          className: {
            anchor:
            "!text-sm !text-muted-foreground hover:!text-brand !underline !underline-offset-4",
            button:
              "bg-primary !text-sm text-primary-foreground !border !border-input hover:!bg-accent !rounded-md !h-10 sm:!h-9 sm:!px-3 lg:!h-11 lg:!px-8",
            container: "",
            divider: "!bg-input",
            input:
              "!h-10 !rounded-md !border !border-input !bg-transparent !px-3 !py-2 !text-sm !ring-offset-background file:!border-0 file:!bg-transparent file:!text-sm file:!font-medium placeholder:!text-muted-foreground focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-ring focus-visible:!ring-offset-2 disabled:!cursor-not-allowed disabled:!opacity-50",
            label: "!mb-2 !text-xs hover:!cursor-pointer",
            loader: "w-4 h-4 mr-2 animate-spin",
            message: "!text-xs !text-red-600",
          },
        }}
      />
    </div>
  )
}
