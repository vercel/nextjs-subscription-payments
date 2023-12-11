import type { Tables } from '@/types_db';

type Price = Tables<'prices'>;

export const getURL = (path: string = '') => {
  // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
  let url = process?.env?.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
    ? process.env.NEXT_PUBLIC_SITE_URL
    : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
    process?.env?.NEXT_PUBLIC_VERCEL_URL && process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
    ? process.env.NEXT_PUBLIC_VERCEL_URL
    : // If neither is set, default to localhost for local development.
    'http://localhost:3000/';

  // Trim the URL and remove trailing slash if exists.
  url = url.replace(/\/+$/, '');

  // Ensure path starts without a slash to avoid double slashes in the final URL.
  path = path.replace(/^\/+/, '');

  // Concatenate the URL and the path.
  return path ? `${url}/${path}` : url;
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

  return res.json();
};

export const toDateTime = (secs: number) => {
  var t = new Date(+0); // Unix epoch start.
  t.setSeconds(secs);
  return t;
};

const getToastRedirect = (
  path: string,
  toastType: string,
  toastName: string,
  toastDescription: string = ''
) => {
  let redirectPath = path;
  let nameKey = '';
  let descriptionKey = '';

  if (toastType === 'status') {
    nameKey = 'status';
    descriptionKey = 'status_description';
  } else if (toastType === 'error') {
    nameKey = 'error';
    descriptionKey = 'error_description';
  } else if (toastType !== '') {
    console.error('Invalid toast type');;
  }

  if (toastName) {
    redirectPath += `?${nameKey}=${encodeURIComponent(toastName)}`;
  } else {
    console.error('Toast name is required');
  }

  if (toastDescription) {
    redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`;
  }

  return redirectPath;
}

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription: string = ''
) => getToastRedirect(path, 'status', statusName, statusDescription);

export const getErrorRedirect = (
  path: string,
  errorName: string,
  errorDescription: string = ''
) => getToastRedirect(path, 'error', errorName, errorDescription);