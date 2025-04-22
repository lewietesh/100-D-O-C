'use client';

import { useState } from 'react';

export default function ProfileSection() {
  const [form, setForm] = useState({
    username: 'client123',
    email: 'client@example.com',
    timezone: 'UTC+3',
    firstName: 'Jane',
    lastName: 'Doe',
    gender: 'Female',
    country: 'Kenya',
    state: 'Nairobi',
    city: 'Nairobi',
    institution: 'University of Nairobi',
    interest: 'Computer Science',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Updated profile:', form);
    // TODO: send to backend
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Profile Settings</h2>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="username" label="Username" value={form.username} onChange={handleChange} />
        <Input name="email" label="Email" value={form.email} onChange={handleChange} type="email" />
        <Input name="firstName" label="First Name" value={form.firstName} onChange={handleChange} />
        <Input name="lastName" label="Last Name" value={form.lastName} onChange={handleChange} />
        <Input name="timezone" label="Timezone" value={form.timezone} onChange={handleChange} />
        <Select name="gender" label="Gender" value={form.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
      </div>

      {/* Location & Institution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="country" label="Country" value={form.country} onChange={handleChange} />
        <Input name="state" label="State" value={form.state} onChange={handleChange} />
        <Input name="city" label="City" value={form.city} onChange={handleChange} />
        <Input name="institution" label="Institution" value={form.institution} onChange={handleChange} />
        <Input name="interest" label="Field of Interest" value={form.interest} onChange={handleChange} />
      </div>

      <div className="pt-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange, type = 'text' }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm sm:text-sm"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
