'use client';

import OrderCard from '@/components/OrderCard';
import { Order } from '@/data/orders';
import { useState } from 'react';
import PlaceOrderModal from '@/components/PlaceOrderModal'; // we'll build this

const orders: Order[] = [
  {
    id: '7276083',
    topic: 'Computer Networking',
    dueDate: '03 Apr 2025',
    price: '$48.00',
    status: '1 bid',
    assignedWriter: null,
    subject: 'IT',
    instructions: '',
  },
  // more mock orders...
];

export default function OrdersSection() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">My Orders</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm"
        >
          + Place New Order
        </button>
      </div>

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}

      {showForm && <PlaceOrderModal onClose={() => setShowForm(false)} />}
    </div>
  );
}
