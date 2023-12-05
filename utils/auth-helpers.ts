'use server';

import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getURL } from 'utils/helpers';

function isValidEmail(email: string) {
  var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

export async function signInWithEmail (formData: FormData) {
  const redirectURL = `${getURL()}auth/callback`;
  
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

  if (data) {
    return `/signin/email_signin?status=${encodeURI('Success!')}&status_description=${encodeURI(
      'Please check your email for a magic link. You may now close this tab.')}`;
  } else if (error) {
    return `/signin/email_signin?error=${encodeURI('You could not be signed in.'
      )}&error_description=${encodeURI(error.message)}`;
  } else {
    return `/signin/email_signin?error=${encodeURI('Hmm... Something went wrong.'
      )}&error_description=${encodeURI('You could not be signed in.')}`;
  }
  };

export async function requestPasswordUpdate (formData: FormData) {
  const redirectURL = `${getURL()}auth/password_reset`;

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
    return `/signin/forgot_password?status=${encodeURI('Success!')}&status_description=${encodeURI(
      'Please check your email for a password reset link. You may now close this tab.')}`;
  } else {
    return `/signin/forgot_password?error=${encodeURI('Hmm... Something went wrong.'
      )}&error_description=${encodeURI('Password reset email could not be sent.')}`;
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
  } else if (data) {
    return `/signin/password_signin?status=${encodeURI('Success!')}&status_description=${encodeURI(
      'You are now signed in.')}`;
  } else {
    return `/signin/password_signin?error=${encodeURI('Hmm... Something went wrong.'
      )}&error_description=${encodeURI('You could not be signed in.')}`;
  }
}

export async function signUp(formData: FormData) {
  const redirectURL = `${getURL()}auth/callback`;
  
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
  } else if (data) {
    return `/signin/signup?status=${encodeURI('Success!')}&status_description=${encodeURI(
      'Please check your email for a confirmation link. You may now close this tab.')}`;
  } else {
    return `/signin/signup?error=${encodeURI('Hmm... Something went wrong.'
      )}&error_description=${encodeURI('You could not be signed up.')}`;
  }
}

export async function updatePassword(formData: FormData) {
  const password = String(formData.get('password'));
  const passwordConfirm = String(formData.get('passwordConfirm'));

  // Check that the password and confirmation match
  if (password !== passwordConfirm) {
      return `/signin/update_password?error=${encodeURI('Your password could not be updated.'
        )}&error_description=${encodeURI('Passwords do not match.')}`
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
    } else if (data) {
    // Handle successful authentication...
    return `/signin/update_password?status=${encodeURI('Success!')}&status_description=${encodeURI(
      'Your password has been updated.')}`;
    } else {
      return `/signin/update_password?error=${encodeURI('Hmm... Something went wrong.'
        )}&error_description=${encodeURI('Your password could not be updated.')}`;
    }
}