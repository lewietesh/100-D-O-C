'use client';

import { notifications } from '@/data/notifications';

export default function Notifications() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
      <ul className="space-y-4">
        {notifications.map((note) => (
          <li
            key={note.id}
            className={`border-l-4 pl-4 py-2 bg-white rounded shadow-sm ${
              note.type === 'success'
                ? 'border-green-500'
                : note.type === 'error'
                ? 'border-red-500'
                : note.type === 'warning'
                ? 'border-yellow-500'
                : 'border-blue-500'
            }`}
          >
            <p className="text-sm text-gray-700">{note.message}</p>
            <p className="text-xs text-gray-400 mt-1">{note.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
