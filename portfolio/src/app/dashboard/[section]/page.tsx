import DashboardLayout from '../DashboardLayout';
import ProfileSection from '@/components/ProfileSection';
import Notifications from '@/components/Notifications';
import OrdersSection from '@/components/OrdersSection';
import DepositFunds from '@/components/DepositFunds';
import { notFound } from 'next/navigation';

const sectionMap: Record<string, JSX.Element> = {
  profile: <ProfileSection />,
  notifications: <Notifications />,
  orders: <OrdersSection />,
  deposit: <DepositFunds />,
};

// ✅ make the function async
export default async function DashboardSection({
  params,
}: {
  params: { section: string };
}) {
  const { section } = params; // ✅ destructure after await
  const content = sectionMap[section];

  if (!content) return notFound();

  return <DashboardLayout>{content}</DashboardLayout>;
}
