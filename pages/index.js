import { useAuth } from '../utils/useAuth';
import { supabase } from '../utils/initSupabase';
import SupabaseAuth from '../components/SupabaseAuth';
import Pricing from '../components/Pricing';

const Index = () => {
  const { user } = useAuth();
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
      <Pricing />
    </div>
  );
};

export default Index;
