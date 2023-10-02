import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { PropsWithChildren } from 'react';
import 'styles/main.css';

export default function RootLayout({
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children
  }: PropsWithChildren) {
    return (
      <html lang="en">
        <body className="bg-black loading">
            {/* @ts-expect-error */}
            <Navbar />
            <main
             id="skip"
             className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
            >
            {children}
            </main>
            <Footer />
        </body>
      </html>
    );
  }