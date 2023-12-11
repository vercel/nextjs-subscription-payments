'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getURL, getErrorRedirect, getStatusRedirect } from 'utils/helpers';
import { getAuthTypes } from 'utils/auth-helpers/settings';

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

export async function redirectToPath(path: string) {
  return redirect(path);
};

export async function signInWithEmail (formData: FormData) {
  const callbackURL = getURL('/auth/callback');
  
  const email = String(formData.get('email'));
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/email_signin', 'Invalid email address.', 'Please try again.'
      );
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let options = {
    emailRedirectTo: callbackURL,
    shouldCreateUser: true
  };

  // If allowPassword is false, do not create a new user
  const { allowPassword } = getAuthTypes();
  if (allowPassword) options.shouldCreateUser = false;
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: options
  });

  if (error) {
    redirectPath = getErrorRedirect('/signin/email_signin', 'You could not be signed in.', error.message);
  } else if (data) {
    cookies().set('preferredSignInView', 'email_signin', { path: '/' });
    redirectPath = getStatusRedirect('/signin/email_signin', 'Success!',
    'Please check your email for a magic link. You may now close this tab.');
  } else {
    redirectPath = getErrorRedirect('/signin/email_signin', 'Hmm... Something went wrong.',
      'You could not be signed in.');
  }

  return redirectPath;
};

export async function requestPasswordUpdate (formData: FormData) {
  const callbackURL = getURL('/auth/reset_password');

  // Get form data
  const email = String(formData.get('email'));
  let redirectPath: string;

  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/forgot_password', 'Invalid email address.', 'Please try again.'
      );
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: callbackURL
    })

  if (error) {
    redirectPath = getErrorRedirect('/signin/forgot_password', error.message, 'Please try again.');
  } else if (data) {
    redirectPath = getStatusRedirect('/signin/forgot_password', 'Success!',
      'Please check your email for a password reset link. You may now close this tab.');
  } else {
    redirectPath = getErrorRedirect('/signin/forgot_password', 'Hmm... Something went wrong.',
      'Password reset email could not be sent.');
  }

  return redirectPath;
};

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  let redirectPath: string;
  
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    redirectPath = getErrorRedirect('/signin/password_signin', 'Sign in failed.', error.message);
  } else if (data.user) {
    cookies().set('preferredSignInView', 'password_signin', { path: '/' });
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
  } else {
    redirectPath = getErrorRedirect('/signin/password_signin', 'Hmm... Something went wrong.',
      'You could not be signed in.');
  }

  return redirectPath;
};

export async function signUp(formData: FormData) {
  const callbackURL = getURL('/auth/callback');
  
  const fullName = String(formData.get('fullName'));
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  let redirectPath: string;
  
  if (!isValidEmail(email)) {
    redirectPath = getErrorRedirect(
      '/signin/signup', 'Invalid email address.', 'Please try again.'
      );
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: callbackURL,
      data: {full_name: fullName}
    }
  });

  if (error) {
    redirectPath = getErrorRedirect('/signin/signup', 'Sign up failed.', error.message);
  } else if (data.session) {
    redirectPath = getStatusRedirect('/', 'Success!', 'You are now signed in.');
  } else if (data.user && data.user.identities && data.user.identities.length == 0) {
    redirectPath = getErrorRedirect('signin/signup', 'Sign up failed.', 
      'There is already an account associated with this email address. Try resetting your password.');
  } else if (data.user) { 
    redirectPath = getStatusRedirect('/signin/signup', 'Success!',
      'Please check your email for a confirmation link. You may now close this tab.');
  } else {
    redirectPath = getErrorRedirect('/signin/signup', 'Hmm... Something went wrong.',
      'You could not be signed up.');
  }

  return redirectPath;
};

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password'));
  const passwordConfirm = String(formData.get('passwordConfirm'));
  let redirectPath: string;

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
    redirectPath = getErrorRedirect('/signin/update_password', 'Your password could not be updated.',
      'Passwords do not match.');
    }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error, data } = await supabase.auth.updateUser({
      password
  }
  );

  if (error) {
    redirectPath = getErrorRedirect('/signin/update_password', 'Your password could not be updated.',
      error.message);  
  } else if (data.user) {
    redirectPath = getStatusRedirect('/', 'Success!', 'Your password has been updated.');
  } else {
    redirectPath = getErrorRedirect('/signin/update_password', 'Hmm... Something went wrong.',
      'Your password could not be updated.');
  }

  return redirectPath;
};