import { Database } from '@/types_db';

type Price = Database['public']['Tables']['prices']['Row'];

export const getURL = () => {
  // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
  let url = process?.env?.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
    ? process.env.NEXT_PUBLIC_SITE_URL
    : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
    process?.env?.NEXT_PUBLIC_VERCEL_URL && process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
    ? process.env.NEXT_PUBLIC_VERCEL_URL
    : // If neither is set, default to localhost for local development.
    'http://localhost:3000/';

  url = url.trim();

  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;

  // Make sure to include trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`;

  return url;
};

export const postData = async ({
  url,
  data
}: {
  url: string;
  data?: { price: Price };
}) => {
  console.log('posting,', url, data);

  const res = await fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    credentials: 'same-origin',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    console.log('Error in postData', { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const toDateTime = (secs: number) => {
  const t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};
