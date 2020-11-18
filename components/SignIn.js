import { useEffect, useState, useCallback } from 'react';
import { validate } from 'email-validator';
import { supabase } from '../utils/initSupabase';
import Input from './Input';
import Button from './Button';
import Logo from './Logo';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dirty, setDirty] = useState(false);
  const [disabled, setDisabled] = useState(false);

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
        <Input type="password" placeholder="Password" onChange={setPassword} />
        <div className="pt-2 w-full flex flex-col">
          <Button
            variant="slim"
            type="submit"
            loading={loading}
            disabled={disabled}
          >
            Sign In
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SignIn;
