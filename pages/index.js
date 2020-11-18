import Router from 'next/router';
import { useAuth } from '../utils/useAuth';
import SignUp from '../components/SignUp';
import Button from '../components/Button/Button';

const Index = () => {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="m-6">
        <p className="text-lg font-semibold mb-4">You are signed in.</p>
        <Button onClick={() => Router.push('/account')}>View Account</Button>
      </div>
    );
  }

  return <SignUp />;
};

export default Index;
