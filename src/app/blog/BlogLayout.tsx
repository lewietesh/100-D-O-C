//app/blog/BlogLayout.tsx
import Hero from '@/components/Hero';

import { ReactNode } from 'react';

const BlogLayout = ({ children }: { children: ReactNode }) => (
  <>
                <Hero
                  title="Tech Insights and Daily Life Hacks"
                  subtitle="Exploring technology, innovations, and real-world solutions shaping the future."
                />
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {children}
    </main>
  </>
);

export default BlogLayout;
