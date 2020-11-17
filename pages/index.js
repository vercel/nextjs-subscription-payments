import Link from 'next/link';
import { useAuth } from '../utils/useAuth';
import Pricing from '../components/Pricing';

const Index = () => {
  const { user } = useAuth();
  return (
    <div>
      <Link href="/account">
        <a>{user ? 'My account' : 'Sign up'}</a>
      </Link>
      <Pricing />
    </div>
  );
};

export default Index;
