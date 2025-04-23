'use client';

import { useState } from 'react';

export default function DepositFunds() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: 'United States',
    cardNumber: '',
    expiry: '',
    cvv: '',
    saveCard: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target;
      
        const { name, value } = target;
      
        const newValue =
          target instanceof HTMLInputElement && target.type === 'checkbox'
            ? target.checked
            : value;
      
        setForm((prev) => ({
          ...prev,
          [name]: newValue,
        }));
      };
      
      const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setForm((prev) => ({ ...prev, [name]: checked }));
      };
      
  const handleSubmit = () => {
    alert(`Funds deposited for: ${form.name}`);
  };

  return (
    <div className="bg-blue-50 py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-3">
        <div className="bg-white p-6 rounded shadow-md lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Billing Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="name" label="Name on card" value={form.name} onChange={handleChange} />
            <Input name="email" label="Email" value={form.email} onChange={handleChange} />
            <div>
              <label className="text-sm text-gray-700 font-medium block mb-1">Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded text-sm"
              >
                <option>United States</option>
                <option>Kenya</option>
                <option>UK</option>
              </select>
            </div>
          </div>

          <h3 className="text-md font-semibold text-gray-700 mt-6">Payment Card Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input name="cardNumber" label="Card Number" value={form.cardNumber} onChange={handleChange} />
            <Input name="expiry" label="Expiration Date" value={form.expiry} onChange={handleChange} placeholder="MM/YY" />
            <Input name="cvv" label="CVV" value={form.cvv} onChange={handleChange} />
          </div>

          <label className="flex items-center text-sm gap-2 mt-4">
          <input type="checkbox" onChange={handleCheckbox} />

            Use this card for future purchases
          </label>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-orange-500 text-white py-2 px-6 rounded-md text-sm font-semibold hover:bg-orange-600"
          >
            Add Funds: $100.00 🔒
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>
          <p className="text-sm text-gray-600">Type of Service: <strong>Payment</strong></p>

          <div className="space-y-2 text-sm text-gray-500 border-t pt-4">
            <p>✅ <strong>Satisfaction Guarantee:</strong> Funds are only released upon delivery.</p>
            <p>🔒 <strong>Privacy Protection:</strong> We never share your data with third parties.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, ...rest }: any) {
  return (
    <div>
      <label className="text-sm text-gray-700 font-medium block mb-1">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        {...rest}
        className="w-full border px-3 py-2 rounded text-sm"
      />
    </div>
  );
}
