// app/projects/ProjectLayout.tsx
import Navigation from '@/components/Navbar';
import Hero from '@/components/Hero';

import Footer from '@/components/Footer';
import { ReactNode } from 'react';

const ProjectLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
            <Hero
              title="Projects"
              subtitle="A showcase of my design, development, and creative work."
            />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  );
};

export default ProjectLayout;
