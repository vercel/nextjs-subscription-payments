
import SupabaseProvider from './supabase-provider';

import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

import { siteConfig } from "@/config/site"
import "@/styles/globals.css"

import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"

import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"


export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Simulation",
    "AI",
    "Multi-Agents",
    "Game",
    "Sandbox",
    "Storytelling",
    "Artificial Intelligence",
    "Virtual Reality",
  ],
  authors: [
    {
      name: "Philipp Maas",
    },
  ],
  creator: "philippmaas",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og.jpg`],
    creator: "@fablesimulation",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
}

// const meta = {
//   title: 'The Simulation - Showrunner',
//   description: 'Developed by Fable Studio',
//   cardImage: '/og.png',
//   robots: 'follow, index',
//   favicon: '/favicon.ico',
//   url: 'https://www.thesimulation.co/',
//   type: 'website'
// };

// export const metadata = {
//   title: meta.title,
//   description: meta.description,
//   cardImage: meta.cardImage,
//   robots: meta.robots,
//   favicon: meta.favicon,
//   url: meta.url,
//   type: meta.type,
//   openGraph: {
//     url: meta.url,
//     title: meta.title,
//     description: meta.description,
//     cardImage: meta.cardImage,
//     type: meta.type,
//     site_name: meta.title
//   },
//   twitter: {
//     card: 'summary_large_image',
//     site: '@fablesimulation',
//     title: meta.title,
//     description: meta.description,
//     cardImage: meta.cardImage
//   }
// };

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
      
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
        )}
      >
        <SupabaseProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* <MainNav /> */}
            {children}
            
            {/* <Analytics /> */}
            {/* <Toaster />
            <TailwindIndicator /> */}

            {/* <SiteFooter /> */}
          </ThemeProvider>
        </SupabaseProvider>
        
      </body>
    </html>
  )
}

// export default function RootLayout({
//   // Layouts must accept a children prop.
//   // This will be populated with nested layouts or pages
//   children
// }: PropsWithChildren) {
//   return (
//     <html lang="en">
//       <body className="bg-black loading">
//         {/* <ChakraProviders> */}
//           <SupabaseProvider>
//             <Navbar />
//             {/* <Header/> */}
//             <main
//               id="skip"
//               className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
//             >
//               <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//                 {children}
//                 <Toaster />
//                 <TailwindIndicator />
//               </ThemeProvider>
//             </main>

//             {/* <Footer /> */}
//           </SupabaseProvider>
//         {/* </ChakraProviders> */}
//       </body>
//     </html>
//   );
// }
