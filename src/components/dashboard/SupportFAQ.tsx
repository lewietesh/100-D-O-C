// src/components/dashboard/SupportFAQ.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  id: string;
  label: string;
}

export const SupportFAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by clicking the "Forgot Password" link on the login page. Enter your email address and follow the instructions sent to your email. If you\'re already logged in, you can change your password from the Security tab in your dashboard.',
      category: 'account',
    },
    {
      id: '2',
      question: 'How do I update my billing information?',
      answer: 'Go to the Payments tab in your dashboard and select the payment method you want to update. You can update your credit card, billing address, and other payment details. Changes take effect immediately for future payments.',
      category: 'billing',
    },
    {
      id: '3',
      question: 'What payment methods do you accept?',
      answer: 'We accept major credit cards (Visa, MasterCard, American Express), PayPal, M-Pesa (for Kenya), and bank transfers. All payments are processed securely using industry-standard encryption.',
      category: 'billing',
    },
    {
      id: '4',
      question: 'How do I cancel my subscription?',
      answer: 'You can cancel your subscription at any time from the Payments tab in your dashboard. Your access will continue until the end of your current billing period. After cancellation, you won\'t be charged for future periods.',
      category: 'billing',
    },
    {
      id: '5',
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to the Security tab in your dashboard and click "Enable 2FA". You\'ll need to scan a QR code with an authenticator app like Google Authenticator or Authy. Enter the verification code to complete the setup.',
      category: 'security',
    },
    {
      id: '6',
      question: 'Why isn\'t my email verified?',
      answer: 'Check your email inbox (including spam folder) for a verification email. Click the verification link in the email. If you haven\'t received it, you can request a new verification email from your profile settings.',
      category: 'account',
    },
    {
      id: '7',
      question: 'How do I view my order history?',
      answer: 'All your orders are available in the Orders tab of your dashboard. You can view order details, track status, and download receipts. Orders are sorted by date with the most recent first.',
      category: 'account',
    },
    {
      id: '8',
      question: 'What should I do if a payment fails?',
      answer: 'First, check that your payment information is correct and your card has sufficient funds. If the problem persists, try a different payment method or contact your bank. You can also reach out to our support team for assistance.',
      category: 'billing',
    },
    {
      id: '9',
      question: 'How do I contact customer support?',
      answer: 'You can create a support ticket from the Support tab in your dashboard. Include as much detail as possible about your issue. For urgent matters, mark your ticket as high priority. We typically respond within 24 hours.',
      category: 'technical',
    },
    {
      id: '10',
      question: 'Can I change my username?',
      answer: 'Currently, usernames cannot be changed after account creation. However, you can update your display name (first and last name) from the Profile tab. If you need to change your username, please contact support.',
      category: 'account',
    },
  ];

  const categories: FAQCategory[] = [
    { id: 'all', label: 'All Categories' },
    { id: 'account', label: 'Account & Profile' },
    { id: 'billing', label: 'Billing & Payments' },
    { id: 'security', label: 'Security' },
    { id: 'technical', label: 'Technical Support' },
  ];

  // Filter FAQs based on search term and selected category
  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    setExpandedItems(new Set(filteredFAQs.map(faq => faq.id)));
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Frequently Asked Questions</h3>
          <p className="text-sm text-gray-600 mt-1">
            Find answers to common questions about our platform
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={expandAll}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Expand All
          </button>
          <span className="text-gray-300">|</span>
          <button
            onClick={collapseAll}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Results Count */}
        {searchTerm && (
          <p className="text-sm text-gray-600">
            {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''} found
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.label}`}
          </p>
        )}
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No FAQ items found</h4>
            <p className="text-gray-600">
              {searchTerm 
                ? `No results found for "${searchTerm}". Try different keywords or check a different category.`
                : 'No FAQ items available in this category.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Clear search and show all FAQs
              </button>
            )}
          </div>
        ) : (
          filteredFAQs.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleExpanded(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-left">
                    {item.question}
                  </h4>
                  <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {categories.find(c => c.id === item.category)?.label}
                  </span>
                </div>
                <div className="ml-4 flex-shrink-0">
                  {expandedItems.has(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {expandedItems.has(item.id) && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <div className="pt-4">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Help Footer */}
      {filteredFAQs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
          <div className="flex items-start">
            <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h5 className="font-medium text-blue-900 mb-1">
                Still need help?
              </h5>
              <p className="text-blue-800 text-sm">
                If you can't find the answer you're looking for, please create a support ticket 
                and our team will be happy to help you.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};