const getURL = () => {
  const url =
    process?.env?.URL ?? process?.env?.VERCEL_URL ?? 'http://localhost:3000';
  return url.includes('http') ? url : `https://${url}`;
};

const postData = ({ url, token, data }) =>
  fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body: JSON.stringify(data),
  }).then((res) => res.json());

export { getURL, postData };
