import Navigation from '@/components/Navbar';
import Footer from '@/components/Footer';
import OrderCard from '@/components/OrderCard';

const orders = [
  {
    id: '7276083',
    topic: 'Computer Networking',
    dueDate: '03 Apr 2025',
    price: '$48.00',
    status: '1 bid',
    assignedWriter: null,
  },
  // Add more mock orders
];

export default function DashboardPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-blue-50 px-4 py-12">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-800">My orders</h1>

        <div className="max-w-5xl mx-auto bg-white p-6 rounded-md shadow-sm">
          <div className="grid grid-cols-6 text-sm font-medium text-gray-600 border-b pb-3">
            <div className="col-span-2">Topic & Order ID</div>
            <div>Due Date</div>
            <div>Price</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          <div className="mt-4 space-y-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
