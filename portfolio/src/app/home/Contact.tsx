'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { Field, Label, Switch } from '@headlessui/react';
import PhoneInput from '../../components/PhoneInput'; // or wherever it's located

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: 'US',
    phone: '',
    message: '',
  });

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, message } = formData;
    if (!firstName || !lastName || !email || !message) {
      return 'Please fill out all required fields.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    const res = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ ...formData, agreed }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      setSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '', country: 'US' });
      setAgreed(false);
    } else {
      setError('Failed to submit. Try again.');
    }
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Contact Us</h2>
        <p className="mt-2 text-lg text-gray-600">Reach out and we’ll get back to you shortly.</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {submitted && <p className="text-green-600 text-center mb-4">Message sent successfully!</p>}

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <Input label="First name" name="firstName" value={formData.firstName} onChange={handleChange} />
          <Input label="Last name" name="lastName" value={formData.lastName} onChange={handleChange} />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} full />
          <PhoneInput
            country={formData.country}
            phone={formData.phone}
            handleChange={handleChange}
          />

          <Textarea label="Message" name="message" value={formData.message} onChange={handleChange} full />
          <Field className="flex gap-x-4 sm:col-span-2">
            <div className="flex h-6 items-center">
              <Switch
                checked={agreed}
                onChange={setAgreed}
                className="group flex w-8 flex-none cursor-pointer rounded-full bg-gray-200 p-px ring-1 ring-gray-900/5 transition-colors duration-200 ease-in-out ring-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 data-checked:bg-indigo-600"
              >
                <span className="sr-only">Agree to policies</span>
                <span
                  aria-hidden="true"
                  className="size-4 transform rounded-full bg-white ring-1 shadow-xs ring-gray-900/5 transition duration-200 ease-in-out group-data-checked:translate-x-3.5"
                />
              </Switch>
            </div>
            <Label className="text-sm text-gray-600">
              By selecting this, you agree to our{' '}
              <a href="#" className="font-semibold text-indigo-600">
                privacy policy
              </a>
              .
            </Label>
          </Field>
        </div>

        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Let's talk
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, name, value, onChange, type = 'text', full = false }: any) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-900">
        {label}
      </label>
      <div className="mt-2.5">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
        />
      </div>
    </div>
  );
}



function Textarea({ label, name, value, onChange, full = false }: any) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label htmlFor={name} className="block text-sm font-semibold text-gray-900">
        {label}
      </label>
      <div className="mt-2.5">
        <textarea
          id={name}
          name={name}
          rows={4}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
        />
      </div>
    </div>
  );
}
