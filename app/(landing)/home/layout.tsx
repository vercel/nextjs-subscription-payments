import { Inter } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/main.css'
import { type Metadata } from 'next'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    template: '%s - Pocket',
    default: 'Pocket - Invest at the perfect time.',
  },
  description:
    'By leveraging insights from our network of industry insiders, youll know exactly when to buy to maximize profit, and exactly when to sell to avoid painful losses.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx('h-full bg-gray-50 antialiased', inter.variable)}
    >
      <body className="flex h-full flex-col bg-gray-50">
        <Header />
        <main className="flex-auto">
        <div className="flex min-h-full flex-col">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  )
}
