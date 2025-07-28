// src/components/services/FAQAccordion.tsx
'use client';

import { Disclosure, Transition } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { ServiceFAQ } from '@/app/models/services.model';

interface FAQAccordionProps {
  faqs: ServiceFAQ[];
}

export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  if (!faqs || faqs.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h3>
      {faqs.map((faq, index) => (
        <Disclosure key={index}>
          {({ open }) => (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-left text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 focus:outline-none">
                <span>{faq.question}</span>
                <ChevronUpIcon className={`w-5 h-5 transform transition-transform ${open ? 'rotate-180' : ''}`} />
              </Disclosure.Button>
              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="px-4 pt-2 pb-4 text-sm text-gray-600">
                  {faq.answer}
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}