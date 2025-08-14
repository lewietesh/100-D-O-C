// src/components/dashboard/SecurityTab.tsx
import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Smartphone, Monitor, Save } from 'lucide-react';
import { ChangePasswordForm } from './ChangePasswordForm';
import { TwoFactorSetup } from './TwoFactorSetup';
import { SessionList } from './SessionList';

export const SecurityTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState('password');

  const sections = [
    { id: 'password', label: 'Change Password', icon: Shield },
    { id: '2fa', label: 'Two-Factor Authentication', icon: Smartphone },
    { id: 'sessions', label: 'Active Sessions', icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
      
      <div className="flex border-b">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center px-4 py-2 font-medium text-sm border-b-2 ${
                activeSection === section.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {section.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {activeSection === 'password' && <ChangePasswordForm />}
        {activeSection === '2fa' && <TwoFactorSetup />}
        {activeSection === 'sessions' && <SessionList />}
      </div>
    </div>
  );
};