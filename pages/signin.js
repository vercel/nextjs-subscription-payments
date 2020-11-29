import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser } from '../components/UserContext';
import LoadingDots from '../components/ui/LoadingDots';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/icons/Logo';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { user, signIn } = useUser();

  const handleSignin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    const { error } = await signIn({ email, password });
    if (error) {
      setMessage(error.message);
    }
    if (!password) {
      setMessage('Check your email for the magic link.');
    }
    setLoading(false);
  };

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    const { error } = await signIn({ provider });
    if (error) {
      setMessage(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      router.replace('/account');
    }
  }, [user]);

  if (!user)
    return (
      <div className="w-80 flex flex-col justify-between p-3 max-w-lg m-auto my-64">
        <form onSubmit={handleSignin}>
          <div className="flex justify-center pb-12 ">
            <Logo width="64px" height="64px" />
          </div>
          <div className="flex flex-col space-y-4">
            {message && (
              <div className="text-pink border border-pink p-3">{message}</div>
            )}
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
              <Button variant="slim" type="submit" loading={loading}>
                {password.length ? 'Sign In' : 'Send Magic Link'}
              </Button>
            </div>

            <span className="pt-1 text-center text-sm">
              <span className="text-accents-7">Don't have an account?</span>
              {` `}
              <Link href="/signup">
                <a className="text-accent-9 font-bold hover:underline cursor-pointer">
                  Sign Up
                </a>
              </Link>
            </span>
          </div>
        </form>

        <div className="flex items-center my-6">
          <div
            className="border-t border-accents-2 flex-grow mr-3"
            aria-hidden="true"
          ></div>
          <div className="text-accents-4 italic">Or</div>
          <div
            className="border-t border-accents-2 flex-grow ml-3"
            aria-hidden="true"
          ></div>
        </div>

        <Button
          variant="slim"
          type="submit"
          loading={loading}
          onClick={() => handleOAuthSignIn('github')}
        >
          Continue with GitHub
        </Button>
      </div>
    );

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
};

export default SignIn;
