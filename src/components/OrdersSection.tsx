'use client';

import OrderCard from '@/components/OrderCard';
import {orders}  from '@/data/orders';
import { useState } from 'react';
import PlaceOrderModal from '@/components/PlaceOrderModal'; // we'll build this


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
