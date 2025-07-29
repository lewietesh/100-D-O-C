'use client';

import { useEffect, useState } from 'react';
import { parsePhoneNumberFromString, AsYouType, CountryCode } from 'libphonenumber-js';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import staticCountries from '@/data/countries.json';

export default function PhoneInput({
  country,
  phone,
  handleChange,
}: {
  country: string;
  phone: string;
  handleChange: (e: React.ChangeEvent<any>) => void;
}) {
  const [countries, setCountries] = useState<{ code: string; name: string; dialCode: string }[]>([]);
  const [error, setError] = useState('');

useEffect(() => {
  const list = staticCountries
    .filter((c) => c.code && c.name)
    .map((c) => ({
      code: c.code,
      name: c.name,
      dialCode: '', // Optional placeholder
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  setCountries(list);
}, []);


  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = new AsYouType(country as CountryCode).input(input);
    handleChange({ ...e, target: { ...e.target, value: formatted, name: 'phone' } });
  };

  const handlePhoneBlur = () => {
    const phoneNumber = parsePhoneNumberFromString(phone, country as CountryCode);
    if (!phoneNumber?.isValid()) {
      setError('Invalid phone number');
    } else {
      setError('');
    }
  };

  if (countries.length === 0) return null;

  return (
    <div className="sm:col-span-2">
      <label htmlFor="phone" className="block text-sm font-semibold text-gray-900">
        Contact Info
      </label>

      <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center sm:gap-3">
        <div className="relative w-full sm:w-1/3">
          <select
            id="country"
            name="country"
            value={country}
            onChange={handleChange}
            className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3.5 py-2 pr-10 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600"
          >
            {countries.map((c) => (
<option key={c.code} value={c.code}>
  {c.name}
</option>

            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
        </div>

        <input
          type="text"
          name="phone"
          placeholder="Enter phone number"
          value={phone}
          onChange={handlePhoneChange}
          onBlur={handlePhoneBlur}
          className="mt-3 sm:mt-0 w-full sm:flex-1 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
