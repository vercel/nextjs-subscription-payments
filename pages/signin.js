import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useUser } from '../components/UserContext';
import LoadingDots from '../components/ui/LoadingDots';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Logo from '../components/icons/Logo';
import GitHub from '../components/icons/GitHub';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { user, signIn } = useUser();

  const handleSignin = async (e) => {
    if (e.preventDefault) e.preventDefault();

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
              <div
                className={`${
                  password.length ? 'text-pink' : 'text-green'
                } border ${
                  password.length ? 'border-pink' : 'border-green'
                } p-3`}
              >
                {message}
              </div>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
              required
            />
            <div
              className={`w-full flex flex-col ${
                showPasswordInput || password.length ? 'hidden' : ''
              }`}
            >
              <Button
                variant="slim"
                type={!password.length ? 'submit' : 'button'}
                loading={!password.length && loading}
                disabled={!email.length}
                onClick={handleSignin}
              >
                Send magic link
              </Button>
            </div>

            <div
              className={`flex flex-col space-y-4 ${
                showPasswordInput || password.length ? '' : 'hidden'
              }`}
            >
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
              />
              <Button
                className="mt-1"
                variant="slim"
                type={password.length ? 'submit' : 'button'}
                loading={!!password.length && loading}
                disabled={!password.length}
              >
                Sign in
              </Button>
            </div>

            <span className="pt-1 text-center text-sm">
              <a
                href="#"
                className="text-accents-7 text-accent-9 hover:underline cursor-pointer"
                onClick={() => {
                  if (showPasswordInput) setPassword('');
                  setShowPasswordInput(!showPasswordInput && !password.length);
                  setMessage('');
                }}
              >
                {`Or sign in with ${
                  showPasswordInput || !!password.length
                    ? 'magic link'
                    : 'password'
                }.`}
              </a>
            </span>

            <span className="pt-1 text-center text-sm">
              <span className="text-accents-7">Don't have an account?</span>
              {` `}
              <Link href="/signup">
                <a className="text-accent-9 font-bold hover:underline cursor-pointer">
                  Sign up.
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
          disabled={loading}
          onClick={() => handleOAuthSignIn('github')}
        >
          <GitHub />
          <span className="ml-2">Continue with GitHub</span>
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
