import Hero from '@/components/Hero';
import Team from '@/components/Team'; // ✅ Import the Team component
import WhatWeDo from '@/components/WhatWeDo';


const aboutLinks = [
  { name: 'Open roles', href: '#' },
  { name: 'Internship program', href: '#' },
  { name: 'Our values', href: '#' },
  { name: 'Meet our leadership', href: '#' },
];

const aboutStats = [
  { name: 'Offices worldwide', value: '12' },
  { name: 'Full-time colleagues', value: '300+' },
  { name: 'Hours per week', value: '40' },
  { name: 'Paid time off', value: 'Unlimited' },
];

export default function AboutPage() {
  return (
    <>
      <Hero
        title="Work with us"
        subtitle="Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo."
        links={aboutLinks}
        stats={aboutStats}
      />
      <WhatWeDo />

      
      {/* ✅ Team Section */}
      <Team />

    </>
  );
}
