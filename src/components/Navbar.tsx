'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle'; // Import this at the top


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
  return (
    <Disclosure as="nav" className="bg-alternate dark:bg-black-custom shadow-sm w-full">
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
                    ? 'bg-brand text-amber-700 font-semibold'
                    : 'font-semibold text-primary dark:text-gray-300 hover:bg-surface-light dark:hover:bg-surface-dark hover:text-brand dark:hover:text-white',
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
  
            {/* CTA Button */}
            <Link
              href="/contact"
              className="hidden sm:block px-4 py-2 rounded-md bg-cta text-white hover:bg-cta-dark transition font-semibold text-sm"
            >
              Get in Touch
            </Link>
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
                  ? 'bg-brand text-brand'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-surface-light dark:hover:bg-surface-dark hover:text-brand dark:hover:text-white',
                'block rounded-md px-3 py-2 text-base font-medium transition'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
  
          <DisclosureButton
            as="a"
            href="/contact"
            className="block w-full text-left mt-2 rounded-md bg-cta text-white px-3 py-2 text-base font-semibold hover:bg-cta-dark transition"
          >
            Get in Touch
          </DisclosureButton>
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
  
}
