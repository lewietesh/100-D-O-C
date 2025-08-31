import { ReactNode } from 'react';

interface BlogLayoutProps {
  children: ReactNode;
  className?: string;
}

const BlogLayout = ({ children, className = '' }: BlogLayoutProps) => (
  <div className={`min-h-screen bg-gradient-to-br from-neutral-100 via-neutral-50 to-white dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 ${className}`}>
    {/* Background Pattern */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-primary/5 to-accent/5 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-tr from-success/5 to-primary/5 blur-3xl"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>
    </div>

    <main className="relative">
      {children}
    </main>
  </div>
);

export default BlogLayout;