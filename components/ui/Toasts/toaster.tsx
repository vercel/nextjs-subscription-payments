'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@/components/ui/Toasts/toast';
import { useToast } from '@/components/ui/Toasts/use-toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export function Toaster() {
  const { toast, toasts } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get('status');
    const error = searchParams.get('error');
    const message = searchParams.get('message');
    if (error || status) {
      toast({
        title: error
          ? error ?? 'Hmm... Something went wrong.'
          : status ?? 'Alright!',
        description: message,
        variant: error ? 'destructive' : undefined
      });
      // Clear the search params so that the toast doesn't show up again on refresh
      router.replace(pathname, { replace: true, scroll: false });
    }
  }, [searchParams]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}