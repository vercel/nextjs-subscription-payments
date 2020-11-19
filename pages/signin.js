import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import { validate } from 'email-validator';
import { supabase } from '../utils/initSupabase';
import { useAuth } from '../utils/useAuth';
import LoadingDots from '../components/LoadingDots';
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../components/Logo';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleSignin = async (e) => {
    e.preventDefault();

    if (!dirty && !disabled) {
      setDirty(true);
      handleValidation();
    }

    try {
      setLoading(true);
      setMessage('');
      const { error } = await supabase.auth.signIn({ email, password });

      if (error) {
        throw error;
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setMessage(e.message);
      setLoading(false);
    }
  };

  const handleValidation = useCallback(() => {
    // Test for Alphanumeric password
    const validPassword = /^(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);

    // Unable to send form unless fields are valid.
    if (dirty) {
      setDisabled(!validate(email) || password.length < 7 || !validPassword);
    }
  }, [email, password, dirty]);

  useEffect(() => {
    handleValidation();
  }, [handleValidation]);

  useEffect(() => {
    if (user) router.push('/account');
  }, [user]);

  if (!user)
    return (
      <form
        onSubmit={handleSignin}
        className="w-80 flex flex-col justify-between p-3 max-w-lg m-auto mt-16"
      >
        <div className="flex justify-center pb-12 ">
          <Logo width="64px" height="64px" />
        </div>
        <div className="flex flex-col space-y-4">
          {message && (
            <div className="text-red border border-red p-3">{message}</div>
          )}
          <Input type="email" placeholder="Email" onChange={setEmail} />
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
              disabled={disabled}
            >
              Sign In
            </Button>
            <div className="pt-1 text-center text-sm">
              <span className="text-accents-7">Don't have an account?</span>
              {` `}
              <Link href="/signup">
                <a className="text-accent-9 font-bold hover:underline cursor-pointer">
                  Sign Up
                </a>
              </Link>
            </div>
          </div>
        </div>
      </form>
    );

  return (
    <div className="m-6">
      <LoadingDots />
    </div>
  );
};

export default SignIn;
