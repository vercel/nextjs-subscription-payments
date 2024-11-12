export default function LogoCloud({
  items = [
    {
      logo: '/nextjs.svg',
      name: 'Next.js',
      description: 'Next.js Logo',
      link: 'https://nextjs.org'
    },
    {
      logo: '/vercel.svg',
      name: 'Vercel',
      description: 'Vercel Logo',
      link: 'https://vercel.com'
    },
    {
      logo: '/stripe.svg',
      name: 'Stripe',
      description: 'Stripe Logo',
      link: 'https://stripe.com'
    },
    {
      logo: '/supabase.svg',
      name: 'Supabase',
      description: 'Supabase Logo',
      link: 'https://supabase.io'
    },
    {
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Paystack.png/440px-Paystack.png',
      name: 'Paystack',
      description: 'Paystack Logo',
      link: 'https://paystack.com'
    },
    {
      logo: '/github.svg',
      name: 'GitHub',
      description: 'GitHub Logo',
      link: 'https://github.com'
    }
  ]
}: {
  items?: {
    logo: string;
    name: string;
    description: string;
    link: string;
  }[];
}) {
  return (
    <div>
      <p className="mt-24 text-xs uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">
        Brought to you by
      </p>
      <div className="grid grid-cols-1 place-items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-6">
        {items?.map((item, index) => (
          <div key={index} className="flex items-center justify-start h-12">
            <a href={item.link} aria-label={`${item.name} Link`}>
              <img
                src={item.logo}
                alt={`${item.name} Logo`}
                className="h-6 sm:h-12 text-white"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
