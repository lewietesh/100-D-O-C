'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Blog', href: '/blog' },
];

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function Navigation() {
  const { isAuthenticated, logout, user } = useAuth();
  const pathname = usePathname();

  // Helper function to check if nav item is current
  const isCurrentPage = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <Disclosure as="nav" className="bg-neutral-50/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-soft border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-lg p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block size-5 group-data-open:hidden" aria-hidden="true" />
              <XMarkIcon className="hidden size-5 group-data-open:block" aria-hidden="true" />
            </DisclosureButton>
          </div>

          {/* Logo */}
          <div className="flex flex-1 items-center justify-center sm:justify-start">
            <div className="flex shrink-0 items-center">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-600 rounded-lg flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-200">
                  <span className="text-white font-bold text-sm">LC</span>
                </div>
                <span className="hidden sm:block text-xl font-bold text-neutral-900 dark:text-white">
                  Lewis<span className="text-primary">Codes</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Navigation links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={classNames(
                  isCurrentPage(item.href)
                    ? 'bg-primary text-white shadow-medium'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white',
                  'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side: Theme Toggle and CTAs */}
          <div className="absolute inset-y-0 right-0 flex items-center space-x-3 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* CTA: Request a Service */}
            <Link
              href="/request-service"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-accent text-white hover:bg-accent-600 shadow-medium hover:shadow-large transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
            >
              Get Started
            </Link>
            
            {/* Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <DisclosurePanel className="sm:hidden border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="space-y-1 px-4 py-4">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as={Link}
              href={item.href}
              className={classNames(
                isCurrentPage(item.href)
                  ? 'bg-primary text-white'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800',
                'block rounded-lg px-3 py-2 text-base font-medium transition-all duration-200'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}

          {/* Mobile CTAs */}
          <div className="pt-4 space-y-3 border-t border-neutral-200 dark:border-neutral-800">
            <Link
              href="/request-service"
              className="block w-full text-center px-4 py-2 text-base font-semibold rounded-lg bg-accent text-white shadow-medium transition-all duration-200"
            >
              Get Started
            </Link>
            
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="block w-full text-center px-4 py-2 text-base font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth"
                className="block w-full text-center px-4 py-2 text-base font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}