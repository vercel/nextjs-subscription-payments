import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Terminal } from '@/components/terminal';
import {
  ArrowRight,
  Calendar,
  CreditCard,
  Laptop,
  Shield,
  Smartphone,
  Zap,
  Github
} from 'lucide-react';
import LogoCloud from '@/components/ui/LogoCloud';

export default function Component() {
  const features = [
    {
      icon: Zap,
      title: 'Next.js and React',
      description:
        'Built with Next.js 14 and App Router for optimal performance and developer experience'
    },
    {
      icon: Shield,
      title: 'Supabase Backend',
      description:
        'Secure authentication and PostgreSQL database with powerful management tools'
    },
    {
      icon: CreditCard,
      title: 'Dual Payment Integration',
      description:
        'Stripe for international payments and Paystack for local African market payments'
    }
  ];

  return (
    <main className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <div className="flex items-center gap-2 mb-4 lg:justify-start justify-center">
                <Badge className="bg-orange-500/10 text-orange-500">
                  Now Available
                </Badge>
                <Badge
                  variant="outline"
                  className="border-green-500/20 bg-green-400"
                >
                  MPESA Coming Soon
                </Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Build Your SaaS
                <span className="block text-orange-500">
                  For African Markets
                </span>
              </h1>
              <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                Production-ready SaaS starter with international and local
                payment integrations. Built for businesses targeting the African
                market.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0 flex gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <a
                    href="https://github.com/farajabien/next-saas-starter"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-5 w-5" />
                    View on GitHub
                  </a>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                >
                  <a
                    href="https://saas-template.fbien.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Laptop className="h-5 w-5" />
                    Live Demo
                  </a>
                </Button>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {features.map((feature) => (
              <div key={feature.title}>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="mt-5">
                  <h2 className="text-lg font-semibold">{feature.title}</h2>
                  <p className="mt-2 text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Built With Modern Stack
          </h2>
          <LogoCloud />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Ready to Build Your SaaS?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-muted-foreground">
                Get started with our template and launch your SaaS product with
                support for both international and local African payment
                methods.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <a
                  href="https://github.com/farajabien/next-saas-starter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  Clone Template
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              >
                <a
                  href="https://wa.me/254793643308"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Smartphone className="h-5 w-5" />
                  Get Support
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Banner */}
      <section className="bg-orange-500 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-4 text-white">
            <Calendar className="h-5 w-5" />
            <p className="text-sm font-medium">
              MPESA Integration Coming Soon - Get Early Access!
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white text-orange-500 hover:bg-orange-100"
              asChild
            >
              <a
                href="https://wa.me/254793643308"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Waitlist
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
