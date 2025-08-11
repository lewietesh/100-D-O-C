//app/blog/BlogLayout.tsx

import { ReactNode } from 'react';

const BlogLayout = ({ children }: { children: ReactNode }) => (
  <>

    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {children}
    </main>
  </>
);

export default BlogLayout;
