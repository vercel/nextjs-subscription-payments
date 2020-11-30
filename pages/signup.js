import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/initSupabase';
import { useUser } from '../components/UserContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/icons/Logo';

const SignUp = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { signUp } = useUser();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage('');
      const { error, user } = await signUp({ email, password });

      if (error) {
        throw error;
      }

      await supabase
        .from('users')
        .update({
          full_name: name
        })
        .eq('id', user.id);
      setUser(user);
      setLoading(false);
    } catch (e) {
      setMessage(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      router.replace('/account');
    }
  }, [user]);

  return (
    <form
      onSubmit={handleSignup}
      className="w-80 flex flex-col justify-between p-3 max-w-lg m-auto my-64"
    >
      <div className="flex justify-center pb-12 ">
        <Logo width="64px" height="64px" />
      </div>
      <div className="flex flex-col space-y-4">
        {message && (
          <div className="text-red border border-red p-3">{message}</div>
        )}
        <Input placeholder="Name" onChange={setName} />
        <Input type="email" placeholder="Email" onChange={setEmail} required />
        <Input type="password" placeholder="Password" onChange={setPassword} />
        <div className="pt-2 w-full flex flex-col">
          <Button
            variant="slim"
            type="submit"
            loading={loading}
            disabled={loading}
          >
            Sign Up
          </Button>
        </div>

        <span className="pt-1 text-center text-sm">
          <span className="text-accents-7">Do you have an account?</span>
          {` `}
          <Link href="/signin">
            <a className="text-accent-9 font-bold hover:underline cursor-pointer">
              Sign In
            </a>
          </Link>
        </span>
      </div>
    </form>
  );
};

export default SignUp;
