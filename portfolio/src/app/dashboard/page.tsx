// app/dashboard/page.tsx
import { redirect } from 'next/navigation';

export default function DashboardIndex() {
  redirect('/dashboard/orders'); // or '/dashboard/profile' if you prefer
}
