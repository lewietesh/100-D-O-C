'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle'; // Import this at the top
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Services', href: '/services', current: false },
  { name: 'About', href: '/about', current: false },
  { name: 'Projects', href: '/projects', current: false },
  { name: 'Blog', href: '/blog', current: false },
];

function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export default function Navigation() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <Disclosure as="nav" className="bg-primary-50 dark:bg-dark-primary shadow-sm w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-500 dark:text-gray-300 hover:bg-surface-light dark:hover:bg-surface-dark hover:text-gray-900 dark:hover:text-white focus:ring-2 focus:ring-brand focus:outline-none focus:ring-inset">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block size-6 group-data-open:hidden" aria-hidden="true" />
              <XMarkIcon className="hidden size-6 group-data-open:block" aria-hidden="true" />
            </DisclosureButton>
          </div>

          {/* Logo */}
          <div className="flex flex-1 items-center justify-center sm:justify-start">
            <div className="flex shrink-0 items-center">
              <img
                alt="Logo"
                src="https://cdn.pixabay.com/photo/2017/03/19/20/19/ball-2157465_1280.png"
                className="h-8 w-auto"
              />
            </div>
          </div>

          {/* Navigation links */}
          <div className="hidden sm:flex sm:space-x-6 ml-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current
                    ? 'bg-primary-500 text-white font-semibold'
                    : 'font-semibold text-primary-700 dark:text-light-primary hover:bg-primary-100 dark:hover:bg-dark-secondary hover:text-primary-600 dark:hover:text-light-primary',
                  'rounded-md px-3 py-2 text-sm transition'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side: Theme Toggle and CTA */}
          <div className="absolute inset-y-0 right-0 flex items-center gap-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Theme Toggle */}
            <div className="flex-shrink-0">
              <ThemeToggle />
            </div>
            {/* CTA: Request a Service */}
            <Link
              href="/request-service"
              className="hidden sm:block px-4 py-2 rounded-md bg-cta dark:bg-cta text-white dark:text-primary hover:bg-cta-600 dark:hover:bg-cta-300 shadow-lg font-bold text-sm focus:outline-none focus:ring-2 focus:ring-cta-400 dark:focus:ring-cta-200 transition duration-200"
              aria-label="Request a Service"
            >
              Request a Service
            </Link>
            {/* Auth Button */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="hidden sm:block px-4 py-2 rounded-md bg-dark-primary dark:bg-warning-400 text-white dark:text-gray-900 hover:bg-warning-600 dark:hover:bg-warning-300 shadow-lg font-bold text-sm focus:outline-none focus:ring-2 focus:ring-warning-400 dark:focus:ring-warning-200 transition duration-200"
                aria-label="Logout"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth"
                className="hidden sm:block px-4 py-2 rounded-md bg-primary dark:bg-brand-secondary text-white dark:text-white hover:bg-primary-600 dark:hover:bg-primary-300 shadow-lg font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-200 transition duration-200"
                aria-label="Sign In"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current
                  ? 'bg-primary-100 text-primary-700 dark:bg-dark-secondary dark:text-light-primary'
                  : 'text-primary-700 dark:text-light-primary hover:bg-primary-50 dark:hover:bg-dark-tertiary hover:text-primary-600 dark:hover:text-light-primary',
                'block rounded-md px-3 py-2 text-base font-medium transition'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}

          <Link
            href="/request-service"
            className="block w-full text-left mt-2 rounded-md bg-cta-500 dark:bg-cta-400 text-white dark:text-gray-900 px-3 py-2 text-base font-bold hover:bg-cta-600 dark:hover:bg-cta-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-cta-400 dark:focus:ring-cta-200 transition duration-200"
            aria-label="Request a Service"
          >
            Request a Service
          </Link>
          {isAuthenticated ? (
            <DisclosureButton
              as="button"
              onClick={logout}
              className="block w-full text-left mt-2 rounded-md bg-warning-500 dark:bg-warning-400 text-white dark:text-gray-900 px-3 py-2 text-base font-bold hover:bg-warning-600 dark:hover:bg-warning-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-warning-400 dark:focus:ring-warning-200 transition duration-200"
              aria-label="Logout"
            >
              Logout
            </DisclosureButton>
          ) : (
            <DisclosureButton
              as="a"
              href="/auth/signin"
              className="block w-full text-left mt-2 rounded-md bg-primary-500 dark:bg-primary-400 text-white dark:text-gray-900 px-3 py-2 text-base font-bold hover:bg-primary-600 dark:hover:bg-primary-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-200 transition duration-200"
              aria-label="Sign In"
            >
              Sign In
            </DisclosureButton>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
