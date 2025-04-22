import Hero from '@/components/Hero';

import { ReactNode } from 'react';

const BlogLayout = ({ children }: { children: ReactNode }) => (
  <>
                <Hero
                  title="Our Social Community"
                  subtitle="A showcase of my design, development, and creative work."
                />
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {children}
    </main>
  </>
);

export default BlogLayout;
