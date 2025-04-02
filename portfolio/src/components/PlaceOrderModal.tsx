'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';

type Props = {
  onClose: () => void;
};

export default function PlaceOrderModal({ onClose }: Props) {
  const [form, setForm] = useState({
    topic: '',
    subject: '',
    type: 'Writing',
    dueDate: '',
    pages: 1,
    format: 'APA',
    level: 'Standard',
    instructions: '',
  });
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (
      selected &&
      ['application/pdf', 'application/zip', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(selected.type)
    ) {
      setFile(selected);
    } else {
      alert('Only PDF, Word, or ZIP files are allowed.');
    }
  };

  const handleSubmit = () => {
    console.log('New Order Submitted:', form, file);
    onClose();
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
        <Dialog.Panel className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 space-y-6">
          <Dialog.Title className="text-xl font-bold text-gray-800">Place New Order</Dialog.Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="topic" label="Topic" value={form.topic} onChange={handleChange} />
            <Input name="subject" label="Subject" value={form.subject} onChange={handleChange} />
            <Select name="type" label="Order Type" value={form.type} onChange={handleChange} options={['Writing', 'Editing']} />
            <Input name="dueDate" label="Deadline" type="datetime-local" value={form.dueDate} onChange={handleChange} />
            <Input name="pages" label="Pages" type="number" value={form.pages} onChange={handleChange} />
            <Select name="format" label="Formatting Style" value={form.format} onChange={handleChange} options={['APA', 'MLA', 'Chicago', 'Harvard']} />
            <Select name="level" label="Writer Level" value={form.level} onChange={handleChange} options={['Standard', 'Advanced', 'Top']} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Instructions</label>
              <textarea
                name="instructions"
                value={form.instructions}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Attach Files</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.zip"
                onChange={handleFileChange}
                className="mt-1 w-full text-sm text-gray-600 file:px-4 file:py-2 file:border file:border-gray-300 file:rounded file:bg-white hover:file:bg-gray-100"
              />
              {file && <p className="text-sm text-gray-500 mt-1">Selected: {file.name}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button onClick={onClose} className="px-4 py-2 text-sm border rounded hover:bg-gray-100">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm"
            >
              Submit Order
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
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
        className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
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
        className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm"
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
