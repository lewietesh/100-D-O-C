'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { ServiceOrder } from '@/app/models/orders.model';
import EditOrderModal from './EditOrderModal';

type Props = {
  order: ServiceOrder;
};

export default function OrderCard({ order }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="grid grid-cols-6 items-center bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="col-span-2">
          <Link href={`/orders/${order.id}`} className="text-indigo-600 font-medium hover:underline">
            {order.serviceName}
          </Link>
          <p className="text-xs text-gray-500">Order ID: {order.id}</p>
        </div>

        <div className="text-gray-700">{order.timeline || '-'}</div>
        <div className="text-gray-700">{order.budget !== undefined ? `$${order.budget}` : '-'}</div>
        <div className="text-orange-600 text-sm flex items-center gap-1">
          {order.status} <span className="animate-spin">⭮</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="border border-gray-300 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Edit
          </button>
          <button
            className="border border-gray-300 text-sm px-3 py-1 rounded hover:bg-gray-100 transition"
          >
            Assign writer
          </button>
        </div>
      </div>

      {isEditing && (
        <EditOrderModal
          order={order}
          onClose={() => setIsEditing(false)}
          onSave={(updatedOrder) => {
            console.log('Updated:', updatedOrder);
            setIsEditing(false);
            // TODO: Trigger update in context or backend
          }}
        />
      )}
    </>
  );
}
