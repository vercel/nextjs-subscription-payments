import useSWR from 'swr';
import { useUser } from '../utils/useUser';
import { supabase } from '../utils/initSupabase';
import SupabaseAuth from '../components/SupabaseAuth';
import Pricing from '../components/Pricing';

const fetcher = (url, token) =>
  fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json', token }),
    credentials: 'same-origin',
    body: JSON.stringify({
      price: 'price_1HmFr0K3BFlKVaHOseYaVud0',
      allow_promotion_codes: true,
      success_url: window.location.origin,
      cancel_url: window.location.origin,
      metadata: {
        tax_rate: 'none',
      },
    }),
  }).then((res) => res.json());

const Index = () => {
  const { user, session } = useUser();
  const { data, error } = useSWR(
    false ? ['/api/createCheckoutSession', session.access_token] : null,
    fetcher
  );
  if (!user) {
    return (
      <>
        <p>Hi there!</p>
        <p>You are not signed in.</p>
        <div>
          <SupabaseAuth />
        </div>
      </>
    );
  }

  return (
    <div>
      <p
        style={{
          display: 'inline-block',
          color: 'blue',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
        onClick={() => supabase.auth.signOut()}
      >
        Log out
      </p>
      <div>
        <p>You're signed in. Email: {user.email}</p>
      </div>
      {error && <div>Failed to fetch user!</div>}
      {data && !error ? (
        <div>
          <span>User data retrieved server-side (in API route):</span>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <div>Loading...</div>
      )}
      <Pricing />
    </div>
  );
};

export default Index;
