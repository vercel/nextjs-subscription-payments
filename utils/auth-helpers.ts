'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getURL } from 'utils/helpers';

const allowOauth = true;
const allowEmail = true;
const allowPassword = true;

// Check that at least one of allowPassword and allowEmail is true
if (!allowPassword && !allowEmail) throw new Error(
  'At least one of allowPassword and allowEmail must be true'
);

export async function getAuthTypes() {
  return { allowOauth, allowEmail, allowPassword };
}

export async function getViewTypes() {  
  // Define the valid view types
  let viewTypes: string[] = [];
  if (allowEmail) {
    viewTypes = [...viewTypes, "email_signin"];
  }
  if (allowPassword) {
    viewTypes = [...viewTypes, "password_signin", "forgot_password", "update_password", "signup"];
  }

  return viewTypes;
}

export async function getDefaultSignInView() {
  // Define the default sign in view
  let defaultView = "email_signin";
  if (allowPassword) {
    defaultView = "password_signin";
  }

  return defaultView;
}

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function signInWithEmail (formData: FormData) {
  const redirectURL = getURL('/auth/callback');
  
  const email = String(formData.get('email'));

  if (!isValidEmail(email)) {
    redirect(
    `/signin/email_signin?error=${encodeURIComponent(
      'Invalid email address.'
    )}&error_description=${encodeURIComponent('Please try again.')}`
    );
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectURL
    }
  });

  if (error) {
    return `/signin/email_signin?error=${encodeURIComponent('You could not be signed in.'
      )}&error_description=${encodeURIComponent(error.message)}`;
  } else if (data.user) {
    return `/signin/email_signin?status=${encodeURIComponent('Success!')}&status_description=${encodeURIComponent(
      'Please check your email for a magic link. You may now close this tab.')}`;
  } else {
    return `/signin/email_signin?error=${encodeURIComponent('Hmm... Something went wrong.'
      )}&error_description=${encodeURIComponent('You could not be signed in.')}`;
  }
  };

export async function requestPasswordUpdate (formData: FormData) {
  const redirectURL = getURL('/auth/reset_password');

  // Get form data
  const email = String(formData.get('email'));

  if (!isValidEmail(email)) {
    return `/signin/forgot_password?error=${encodeURIComponent('Invalid email address.'
      )}&error_description=${encodeURIComponent('Please try again.')}`;
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectURL
    })

  if (error) {
    return `/signin/forgot_password?error=${encodeURIComponent(error.message)
      }&error_description=${encodeURIComponent('Please try again.')}`;
  } else if (data) {
    return `/signin/forgot_password?status=${encodeURIComponent('Success!')}&status_description=${encodeURIComponent(
      'Please check your email for a password reset link. You may now close this tab.')}`;
  } else {
    return `/signin/forgot_password?error=${encodeURIComponent('Hmm... Something went wrong.'
      )}&error_description=${encodeURIComponent('Password reset email could not be sent.')}`;
  }
};

export async function signInWithPassword(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    return `/signin/password_signin?error=${encodeURIComponent('Sign in failed.')
      }&error_description=${encodeURIComponent(error.message)}`;
  } else if (data.user) {
    return `/?status=${encodeURIComponent('Success!')}&status_description=${encodeURIComponent(
      'You are now signed in.')}`;
  } else {
    return `/signin/password_signin?error=${encodeURIComponent('Hmm... Something went wrong.'
      )}&error_description=${encodeURIComponent('You could not be signed in.')}`;
  }
}

export async function signUp(formData: FormData) {
  const redirectURL = getURL('/auth/callback');
  
  const fullName = String(formData.get('fullName'));
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  
  if (!isValidEmail(email)) {
    return `/signin/signup?error=${encodeURIComponent('Invalid email address.'
    )}&error_description=${encodeURIComponent('Please try again.')}`
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectURL,
      data: {full_name: fullName}
    }
  });

  if (error) {
    return `/signin/signup?error=${encodeURIComponent('Sign up failed.')
      }&error_description=${encodeURIComponent(error.message)}`;
  } else if (data.user) {
    return `/signin/signup?status=${encodeURIComponent('Success!')}&status_description=${encodeURIComponent(
      'Please check your email for a confirmation link. You may now close this tab.')}`;
  } else {
    return `/signin/signup?error=${encodeURIComponent('Hmm... Something went wrong.'
      )}&error_description=${encodeURIComponent('You could not be signed up.')}`;
  }
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password'));
  const passwordConfirm = String(formData.get('passwordConfirm'));

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
      return `/signin/update_password?error=${encodeURIComponent('Your password could not be updated.'
        )}&error_description=${encodeURIComponent('Passwords do not match.')}`
    }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error, data } = await supabase.auth.updateUser({
      password
  }
  );

  if (error) {
      return `/signin/update_password?error=${encodeURIComponent('Your password could not be updated.'
        )}&error_description=${encodeURIComponent(error.message)}`;
    } else if (data.user) {
    return `/?status=${encodeURIComponent('Success!')}&status_description=${encodeURIComponent(
      'Your password has been updated.')}`;
    } else {
      return `/signin/update_password?error=${encodeURIComponent('Hmm... Something went wrong.'
        )}&error_description=${encodeURIComponent('Your password could not be updated.')}`;
    }
}