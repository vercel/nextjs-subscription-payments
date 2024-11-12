'use client';

import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function Terminal() {
  const [terminalStep, setTerminalStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const terminalSteps = [
    '# Clone and install',
    'git clone https://github.com/farajabien/supabase-saas-starter',
    'cd supabase-saas-starter',
    'pnpm install',
    '',
    '# Configure environment',
    'cp .env.example .env.local',
    '',
    '# Set up Supabase',
    'pnpm supabase:start',
    'pnpm supabase:migrate',
    '',
    '# Configure payments',
    '# Add your Stripe keys',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...',
    'STRIPE_SECRET_KEY=sk_test_...',
    '',
    '# Add your Paystack keys (Optional)',
    'NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...',
    'PAYSTACK_SECRET_KEY=sk_test_...',
    '',
    '# Start development',
    'pnpm dev',
    '',
    '# Set up webhooks (in new terminal)',
    'pnpm stripe:listen',
    '',
    '🎉 Ready at http://localhost:3000',
    '',
    '# MPESA Integration',
    '# Coming Soon - Join waitlist on WhatsApp'
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setTerminalStep((prev) =>
        prev < terminalSteps.length - 1 ? prev + 1 : prev
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [terminalStep]);

  const copyToClipboard = () => {
    const commands = terminalSteps
      .filter(
        (step) =>
          !step.startsWith('#') &&
          !step.startsWith('NEXT_PUBLIC') &&
          !step.startsWith('STRIPE_') &&
          !step.startsWith('PAYSTACK_') &&
          !step.startsWith('🎉') &&
          step.trim() !== ''
      )
      .join('\n');
    navigator.clipboard.writeText(commands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLineColor = (step: string) => {
    if (step.startsWith('#')) return 'text-gray-500';
    if (step.includes('Coming Soon')) return 'text-orange-400';
    if (
      step.startsWith('NEXT_PUBLIC') ||
      step.startsWith('STRIPE_') ||
      step.startsWith('PAYSTACK_')
    )
      return 'text-blue-400';
    if (step.startsWith('🎉')) return 'text-green-400';
    return '';
  };

  return (
    <div className="relative">
      <div className="absolute -top-3 right-0 flex gap-2">
        <Badge className="bg-green-100 text-green-700">Paystack Ready</Badge>
        <Badge variant="outline" className="border-orange-200 text-orange-700">
          MPESA Soon
        </Badge>
      </div>
      <div className="w-full rounded-lg shadow-lg overflow-hidden bg-gray-900 text-white font-mono text-sm">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {copied ? 'Copied!' : 'Copy commands'}
              </span>
              <button
                onClick={copyToClipboard}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded hover:bg-gray-800"
                aria-label="Copy to clipboard"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-1">
            {terminalSteps.map((step, index) => (
              <div
                key={index}
                className={`
                  ${index > terminalStep ? 'opacity-0' : 'opacity-100'}
                  transition-opacity duration-300
                  ${getLineColor(step)}
                `}
              >
                {!step.startsWith('#') &&
                  !step.startsWith('NEXT_PUBLIC') &&
                  !step.startsWith('STRIPE_') &&
                  !step.startsWith('PAYSTACK_') &&
                  !step.startsWith('🎉') &&
                  step.trim() !== '' && (
                    <span className="text-green-400">$</span>
                  )}{' '}
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
