'use client'

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Link from 'next/link'

export default function EmailSignIn() {  
  const router = useRouter();

  async function handleEmailSignIn(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    // Prevent default form submission refresh
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email'));
    
    // Check that the email entered is valid
    function isValidEmail(email: string) {
      var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return regex.test(email);
    }
    
    if (!isValidEmail(email)) {
      router.push(
      `/signin/email_signin?error=${encodeURIComponent(
        'Invalid email address.'
      )}&error_description=${encodeURIComponent('Please try again.')}`
      );
    }

    // Call email_signin API route with the form data
    const response = await fetch('/api/email_signin', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.get('email')
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      const result = await response.json();
      // Display success toast if email was sent
      if (result.success) {
        router.push(`/signin/email_signin?status=${encodeURI('Success!')}&status_description=${encodeURI(
          'Please check your email for a magic link. You may now close this tab.')}`);
      } else if (result.error) {
        // Else display an error toast
        router.push(`/signin/email_signin?error=${encodeURI("Hmm... Something went wrong.")}&error_description=${encodeURI(
          result.message)}`);
      }
    } else {
      // Handle non-JSON response
      console.log(`API error: Response is not JSON: ${response.statusText}`)
    }
  };

  return (
    <div className="my-8">
      <form noValidate={true} className="mb-4" onSubmit={handleEmailSignIn}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-md bg-zinc-800"
            />
          </div>
          <Button
            variant="slim"
            type="submit"
            className="mt-1"
          >
            Sign in with Email
          </Button>
        </div>
      </form>
      <p><Link href="/signin/password_signin" className="font-light text-sm">Sign in with password</Link></p>
      <p><Link href="/signin/signup" className="font-light text-sm">Don't have an account? Sign up</Link></p>
    </div>
  )
};