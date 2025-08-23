'use client';

import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import type { ServiceOrder } from '@/app/models/orders.model';

type Props = {
  order: ServiceOrder;
  onClose: () => void;
  onSave: (updated: ServiceOrder) => void;
};

export default function EditOrderModal({ order, onClose, onSave }: Props) {
  const [form, setForm] = useState(order);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
      alert('Only PDF, Word (.doc, .docx), or ZIP files are allowed.');
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/20" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-3xl bg-white rounded shadow-lg p-6 space-y-4">
          <Dialog.Title className="text-xl font-semibold">Edit Order</Dialog.Title>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Service Name</label>
              <input
                name="serviceName"
                value={form.serviceName}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <input
                name="description"
                value={form.description || ''}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Deadline</label>
              <input
                type="date"
                name="endDate"
                value={form.endDate ? form.endDate.substring(0, 10) : ''}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Budget</label>
              <input
                name="budget"
                type="number"
                value={form.budget !== undefined ? form.budget : ''}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded text-sm"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium">Notes</label>
              <textarea
                name="notes"
                value={form.notes || ''}
                onChange={handleChange}
                className="mt-1 w-full border px-3 py-2 rounded text-sm"
                rows={3}
              />
            </div>

            {/* ✅ FILE UPLOAD FIELD */}
            <div className="col-span-2">
              <label className="block text-sm font-medium">Attach Files</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.zip"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-600 file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2 file:text-sm file:font-medium file:bg-white hover:file:bg-gray-100"
              />
              {file && (
                <p className="text-sm text-gray-500 mt-1">Selected: {file.name}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(form)}
              className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
