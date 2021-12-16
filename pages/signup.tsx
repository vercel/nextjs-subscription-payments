import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, FormEvent } from 'react';

import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import Logo from 'components/icons/Logo';
import { updateUserName } from 'utils/supabase-client';
import { useUser } from 'utils/useUser';
import { User } from '@supabase/gotrue-js';

const SignUp = () => {
  const [newUser, setNewUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type?: string; content?: string }>({
    type: '',
    content: ''
  });
  const router = useRouter();
  const { signUp, user } = useUser();

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage({});
    const { error, user: createdUser } = await signUp({ email, password });
    if (error) {
      setMessage({ type: 'error', content: error.message });
    } else {
      if (createdUser) {
        await updateUserName(createdUser, name);
        setNewUser(createdUser);
      } else {
        setMessage({
          type: 'note',
          content: 'Check your email for the confirmation link.'
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (newUser || user) {
      router.replace('/account');
    }
  }, [newUser, user]);

  return (
    <div className="flex justify-center height-screen-helper">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>
        <form onSubmit={handleSignup} className="flex flex-col space-y-4">
          {message.content && (
            <div
              className={`${
                message.type === 'error' ? 'text-pink-500' : 'text-green-500'
              } border ${
                message.type === 'error' ? 'border-pink-500' : 'border-green-500'
              } p-3`}
            >
              {message.content}
            </div>
          )}
          <Input placeholder="Name" onChange={setName} />
          <Input
            type="email"
            placeholder="Email"
            onChange={setEmail}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={setPassword}
          />
          <div className="pt-2 w-full flex flex-col">
            <Button
              variant="slim"
              type="submit"
              loading={loading}
              disabled={loading || !email.length || !password.length}
            >
              Sign up
            </Button>
          </div>

          <span className="pt-1 text-center text-sm">
            <span className="text-gray-200">Do you have an account?</span>
            {` `}
            <Link href="/signin">
              <a className="text-accent-9 font-bold hover:underline cursor-pointer">
                Sign in.
              </a>
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
