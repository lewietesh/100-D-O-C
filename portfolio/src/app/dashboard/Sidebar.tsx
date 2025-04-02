'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, UserIcon, BellIcon, CreditCardIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const links = [
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
  { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
  { name: 'Orders', href: '/dashboard/orders', icon: ClipboardDocumentIcon },
  { name: 'Deposit Funds', href: '/dashboard/deposit', icon: CreditCardIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button (Mobile) */}
      <button
        className="absolute top-4 left-4 z-50 sm:hidden bg-white dark:bg-gray-800 rounded p-2 shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XMarkIcon className="h-5 w-5 text-gray-700 dark:text-white" /> : <Bars3Icon className="h-5 w-5 text-gray-700 dark:text-white" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed sm:static z-40 top-0 left-0 h-full w-64 transform transition-transform duration-300
        bg-white dark:bg-gray-900 border-r dark:border-gray-800 p-4 space-y-2
        ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        `}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Dashboard</h2>

        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}
              `}
            >
              <Icon className="h-5 w-5" />
              {link.name}
            </Link>
          );
        })}
      </aside>
    </>
  );
}
