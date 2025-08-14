// src/components/dashboard/TwoFactorSetup.tsx
import React, { useState } from 'react';
import { Shield, Smartphone, Key, Copy, Check } from 'lucide-react';

export const TwoFactorSetup: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [copied, setCopied] = useState(false);

  const enable2FA = async () => {
    // Mock API call - replace with actual implementation
    setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    setSecretKey('ABCD EFGH IJKL MNOP QRST UVWX YZ12 3456');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secretKey.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const verify2FA = async () => {
    // Mock verification - replace with actual API call
    if (verificationCode.length === 6) {
      setIsEnabled(true);
      setQrCode(null);
      setSecretKey('');
      setVerificationCode('');
    }
  };

  const disable2FA = async () => {
    // Mock API call - replace with actual implementation
    setIsEnabled(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-md">
      <div className="flex items-center mb-6">
        <Shield className="w-6 h-6 text-blue-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
      </div>

      {!isEnabled ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Add an extra layer of security to your account with two-factor authentication.
          </p>

          {!qrCode ? (
            <button
              onClick={enable2FA}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Enable 2FA
            </button>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <img src={qrCode} alt="QR Code" className="mx-auto mb-4 border rounded" />
                <p className="text-sm text-gray-600 mb-2">
                  Scan this QR code with your authenticator app
                </p>
                
                <div className="flex items-center justify-between p-3 bg-gray-100 rounded-md">
                  <span className="text-sm font-mono">{secretKey}</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center text-blue-600 hover:text-blue-700"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={verify2FA}
                disabled={verificationCode.length !== 6}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verify & Enable
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center p-3 bg-green-100 rounded-md">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">Two-factor authentication is enabled</span>
          </div>

          <button
            onClick={disable2FA}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Disable 2FA
          </button>
        </div>
      )}
    </div>
  );
};