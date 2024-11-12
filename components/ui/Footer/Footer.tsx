import Link from 'next/link';
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Globe,
  FileCode,
  Users,
  BookOpen
} from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/farajabien',
      label: 'GitHub'
    },
    {
      icon: Twitter,
      href: 'https://twitter.com/farajabien',
      label: 'Twitter'
    },
    {
      icon: Linkedin,
      href: 'https://linkedin.com/in/bienvenufaraja',
      label: 'LinkedIn'
    },
    {
      icon: Mail,
      href: 'mailto:farajabien@gmail.com',
      label: 'Email'
    }
  ];

  return (
    <footer className="w-full bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 transition-colors duration-150 lg:grid-cols-12">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-3">
            <Link
              href="https://fbien.com"
              className="flex items-center gap-2 font-bold text-lg hover:text-primary transition-colors"
            >
              <Globe className="h-6 w-6" />
              <span>Faraja Bien</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Building SaaS products for African markets with modern tech stack
              and local payment integrations.
            </p>
          </div>

          {/* Services Section */}
          <div className="col-span-1 lg:col-span-3">
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://fbien.com/services/startup-validation"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Startup Validation
                </Link>
              </li>
              <li>
                <Link
                  href="https://fbien.com/services/mvp-development"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  MVP Development
                </Link>
              </li>
              <li>
                <Link
                  href="https://fbien.com/services/saas-template"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  SaaS Template
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div className="col-span-1 lg:col-span-3">
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/resources/supabase-saas-starter"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Free SaaS Template
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/validation-framework"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Validation Framework
                </Link>
              </li>
              <li>
                <Link
                  href="https://github.com/farajabien"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Open Source Projects
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="col-span-1 lg:col-span-3">
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://fbien.com"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="https://fbien.com/services"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/254793643308"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center py-8 border-t">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Faraja Bien. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={link.label}
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
