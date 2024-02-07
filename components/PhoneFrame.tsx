import Image from 'next/image'
import clsx from 'clsx'

import frame from '@/images/phone-frame.svg'

function PlaceholderFrame(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 366 729" aria-hidden="true" {...props}>
      <path
        fill="#F2F2F2"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M300.092 1c41.22 0 63.223 21.99 63.223 63.213V184.94c-.173.184-.329.476-.458.851.188-.282.404-.547.647-.791.844-.073 2.496.257 2.496 2.157V268.719c-.406 2.023-2.605 2.023-2.605 2.023a7.119 7.119 0 0 1-.08-.102v394.462c0 41.213-22.001 63.212-63.223 63.212h-95.074c-.881-.468-2.474-.795-4.323-.838l-33.704-.005-.049.001h-.231l-.141-.001c-2.028 0-3.798.339-4.745.843H66.751c-41.223 0-63.223-21.995-63.223-63.208V287.739c-.402-.024-2.165-.23-2.524-2.02v-.973A2.039 2.039 0 0 1 1 284.62v-47.611c0-.042.001-.084.004-.126v-.726c0-1.9 1.652-2.23 2.496-2.157l.028.028v-16.289c-.402-.024-2.165-.23-2.524-2.02v-.973A2.039 2.039 0 0 1 1 214.62v-47.611c0-.042.001-.084.004-.126v-.726c0-1.9 1.652-2.23 2.496-2.157l.028.028v-26.041a2.26 2.26 0 0 0 .093-.236l-.064-.01a3.337 3.337 0 0 1-.72-.12l-.166-.028A2 2 0 0 1 1 135.62v-24.611a2 2 0 0 1 1.671-1.973l.857-.143v-44.68C3.528 22.99 25.53 1 66.75 1h233.341ZM3.952 234.516a5.481 5.481 0 0 0-.229-.278c.082.071.159.163.228.278Zm89.99-206.304A4.213 4.213 0 0 0 89.727 24H56.864C38.714 24 24 38.708 24 56.852v618.296C24 693.292 38.714 708 56.864 708h250.272c18.15 0 32.864-14.708 32.864-32.852V56.852C340 38.708 325.286 24 307.136 24h-32.864a4.212 4.212 0 0 0-4.213 4.212v2.527c0 10.235-8.3 18.532-18.539 18.532H112.48c-10.239 0-18.539-8.297-18.539-18.532v-2.527Z"
      />
      <rect x="154" y="29" width="56" height="5" rx="2.5" fill="#D4D4D4" />
    </svg>
  )
}

export function PhoneFrame({
  className,
  children,
  priority = false,
  ...props
}: React.ComponentPropsWithoutRef<'div'> & { priority?: boolean }) {
  return (
    <div className={clsx('relative aspect-[366/729]', className)} {...props}>
      <div className="absolute inset-y-[calc(1/729*100%)] left-[calc(7/729*100%)] right-[calc(5/729*100%)] rounded-[calc(58/366*100%)/calc(58/729*100%)] shadow-2xl" />
      <div className="absolute left-[calc(23/366*100%)] top-[calc(23/729*100%)] grid h-[calc(686/729*100%)] w-[calc(318/366*100%)] transform grid-cols-1 overflow-hidden bg-gray-900 pt-[calc(23/318*100%)]">
        {children}
      </div>
      <PlaceholderFrame className="pointer-events-none absolute inset-0 h-full w-full fill-gray-100" />
      <Image
        src={frame}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full"
        unoptimized
        priority={priority}
      />
    </div>
  )
}
