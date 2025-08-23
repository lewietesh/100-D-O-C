
import { Suspense } from 'react';
import ServicesContent from './ServicesContent';


// Server Component: wrap ServicesContent in Suspense
export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span>Loading Services...</span></div>}>
      <ServicesContent />
    </Suspense>
  );
}