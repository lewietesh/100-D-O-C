// app/projects/ProjectLayout.tsx
import Navigation from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ReactNode } from 'react';

const ProjectLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Navigation />
      <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default ProjectLayout;
