// app/about/page.tsx
import AboutPage from '@/components/AboutPage';

export const metadata = {
  title: 'About - Lewis Mutembei | Full-Stack Developer',
  description: 'Learn about Lewis Mutembei, a passionate full-stack developer and technology consultant specializing in modern web applications and digital solutions.',
  keywords: 'Lewis Mutembei, Full-Stack Developer, Web Developer, Software Engineer, Technology Consultant, React, Django, Next.js',
  openGraph: {
    title: 'About Lewis Mutembei - Full-Stack Developer',
    description: 'Passionate full-stack developer creating innovative digital solutions',
    type: 'website',
  }
};

export default function Page() {
  return <AboutPage />;
}