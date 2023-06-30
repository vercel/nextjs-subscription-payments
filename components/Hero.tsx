'use client';

import { Session, User } from '@supabase/supabase-js';
import Button from "./ui/Button/Button";
import { useRouter } from 'next/navigation';

interface Props {
    session: Session | null;
    user: User | null | undefined;
  }

export default function Hero({
    session,
    user
  }: Props) {
    const router = useRouter();
    const handleGettingStarted = async () => {
        if (!user) {
            return router.push('/signin');
        }
        if (user) {
            return router.push('/account');
        }
    }
    return (
        <section>
            <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
            <div className="sm:flex sm:flex-col sm:align-center"></div>
            <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl lg:text-8xl">
                <span
                className="text-logoColor underline"
                >
                Automate
                </span>
                Your Edits
            </p>
            </div>
            <p className="max-w-3xl m-auto mb-8 text-xl font-bold text-zinc-200 sm:text-center sm:text-4xl">
                This bot is able to automate <span className="text-logoColor">downloading</span>, <span className="text-logoColor">editing</span> and <span className="text-logoColor">uploading</span> of videos from any platform to any platform.
            </p>

            <div className={`ss:hidden flex justify-center items-center`}>
                <Button
                    variant="slim"
                    type="button"
                    disabled={false}
                    className="block py-2 mt-12 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 "
                    onClick={handleGettingStarted}
                >
                    Get Started
                </Button>
            </div>
        </section>
    );
};
