'use client';

import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

const faqs = [
  { question: "Why are we the best company?", answer: "We deliver quality and personalized service for each client." },
  { question: "How the template process works?", answer: "We customize each experience from onboarding to final delivery." },
  { question: "What should be listed on a business card?", answer: "Key information like name, role, and contact." },
  { question: "How long should a business plan be?", answer: "It depends, but it should clearly outline goals and execution." },
];

export default function FAQAccordion() {
  return (
    <div className="w-full space-y-4">
      {faqs.map((faq, index) => (
        <Disclosure key={index}>
          {({ open }) => (
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Disclosure.Button className="flex justify-between w-full px-4 py-3 text-left text-sm font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 focus:outline-none">
                <span>{index + 1}. {faq.question}</span>
                <ChevronUpIcon className={`w-5 h-5 transform transition-transform ${open ? 'rotate-180' : ''}`} />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-2 pb-4 text-sm text-gray-600">
                {faq.answer}
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
