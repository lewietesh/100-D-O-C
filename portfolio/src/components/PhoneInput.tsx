'use client';

import { useEffect, useState } from 'react';
import { parsePhoneNumberFromString, AsYouType, CountryCode } from 'libphonenumber-js';
import { ChevronDownIcon } from '@heroicons/react/16/solid';

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
                fetch('https://restcountries.com/v3.1/all')
                        .then((res) => {
                                if (!res.ok) throw new Error('Failed to fetch countries');
                                return res.json();
                        })
                        .then((data) => {
                                const list = data
                                        .filter((c: any) => c.idd?.root && c.cca2 && c.name?.common)
                                        .map((c: any) => ({
                                                code: c.cca2,
                                                name: c.name.common,
                                                dialCode: `${c.idd.root}${c.idd.suffixes?.[0] || ''}`,
                                        }))
                                        .sort((a: any, b: any) => a.name.localeCompare(b.name));
                                setCountries(list);
                        })
                        .catch((err) => {
                                console.error('PhoneInput error:', err);
                                setCountries([]); // fallback to empty
                        });
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

        // Add this just before the return statement:
        if (countries.length === 0) return null;
        return (
                <div className="sm:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-semibold text-gray-900">
                                Phone number
                        </label>
                        <div className="mt-2.5 flex rounded-md bg-white outline-1 outline-gray-300 focus-within:outline-2 focus-within:outline-indigo-600">
                                <select
                                        id="country"
                                        name="country"
                                        value={country}
                                        onChange={handleChange}
                                        className="rounded-md py-2 pr-7 pl-3.5 text-base text-gray-500 focus:outline-none sm:text-sm"
                                >
                                        {countries.map((c) => (
                                                <option key={c.code} value={c.code}>
                                                        {c.name} ({c.dialCode})
                                                </option>
                                        ))}
                                </select>
                                <ChevronDownIcon className="pointer-events-none -ml-8 mt-2 size-5 text-gray-500" />
                                <input
                                        type="text"
                                        name="phone"
                                        placeholder="Enter phone number"
                                        value={phone}
                                        onChange={handlePhoneChange}
                                        onBlur={handlePhoneBlur}
                                        className="grow py-1.5 px-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                />
                        </div>
                        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
                </div>
        );
}
