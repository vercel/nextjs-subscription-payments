import Link from 'next/link';

import LogoFull from '@/components/icons/LogoFull';
import Twitter from '@/components/icons/Twitter';
import Discord from '@/components/icons/Discord';
import Youtube from '@/components/icons/Youtube';

export default function Footer() {
  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-zinc-900">
      <div className="grid grid-cols-1 gap-5 py-12 text-white transition-colors duration-150 border-b lg:grid-cols-8 border-zinc-600 bg-zinc-900">
        <div className="col-span-1 lg:col-span-2 lg:flex lg:justify-center flex-col">
          <Link
            href="/"
            className="flex flex-col items-center flex-initial font-bold"
          >
            <span className="mr-2">
              <LogoFull />
            </span>
            <span className='ml-7 text-neutral-400'>Edit More, Work Less</span>
          </Link>     
          <div className="flex items-start col-span-1 text-white lg:col-span-6 lg:justify-center lg:mt-5">
            <div className="flex items-center h-10 space-x-6 mr-4">
              <a
                aria-label="Github Repository"
                href="https://github.com/vercel/nextjs-subscription-payments"
              >
                <Twitter />
              </a>
            </div>
            <div className="flex items-center h-10 space-x-6 mr-4">
              <a
                aria-label="Github Repository"
                href="https://discord.gg/PZR8sQApU"
              >
                <Discord />
              </a>
            </div>
            <div className="flex items-center h-10 space-x-6">
              <a
                aria-label="Github Repository"
                href="https://discord.gg/PZR8sQApU"
              >
                <Youtube />
              </a>
            </div>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-logoColor"
              >
                Home
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/about"
                className="text-white transition duration-150 ease-in-out hover:text-logoColor"
              >
                About
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/#pricing"
                className="text-white transition duration-150 ease-in-out hover:text-logoColor"
              >
                Pricing
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/docs"
                className="text-white transition duration-150 ease-in-out hover:text-logoColor"
              >
                Documentation
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/faq"
                className="text-white transition duration-150 ease-in-out hover:text-logoColor"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="font-bold text-white transition duration-150 ease-in-out">
                LEGAL
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/privacy-policy"
                className="text-white transition duration-150 ease-in-out hover:text-logoColor"
              >
                Privacy Policy
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/terms-of-use"
                className="text-white transition duration-150 ease-in-out hover:text-logoColor"
              >
                Terms of Use
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between py-12 space-y-4 md:flex-row bg-zinc-900">
        <div>
          <span>
            &copy; {new Date().getFullYear()} IVORY NODE, Inc. All rights reserved.
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-[rgba(225,225,225,0.5)]">All trademarks and copyrighted materials appearing on this website belong to their respective owners.</span>
        </div>
      </div>
    </footer>
  );
}
