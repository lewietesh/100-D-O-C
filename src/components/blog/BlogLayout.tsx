import { ReactNode } from 'react';
import { Code2, Zap, TrendingUp, Layers } from 'lucide-react';

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

    {/* Enhanced Hero Section */}
    <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium shadow-soft">
          <Code2 className="w-4 h-4" />
          Tech Insights & Solutions
        </div>
        
        {/* Main Heading */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight">
            Modern Web Solutions for{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-white">
              Business Growth
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Discover cutting-edge insights on web development, process re-engineering, 
            scaling strategies, and optimization techniques that drive real business results.
          </p>
        </div>

        {/* Feature Icons */}
        <div className="flex flex-wrap justify-center gap-6 pt-6">
          <div className="flex items-center gap-3 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-neutral-700 dark:text-neutral-300 text-sm">Performance</span>
          </div>
          
          <div className="flex items-center gap-3 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="p-2 bg-gradient-to-br from-accent to-accent/80 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-neutral-700 dark:text-neutral-300 text-sm">Scaling</span>
          </div>
          
          <div className="flex items-center gap-3 bg-white/60 dark:bg-neutral-800/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-soft hover:shadow-medium transition-all duration-300">
            <div className="p-2 bg-gradient-to-br from-success to-success/80 rounded-lg">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-neutral-700 dark:text-neutral-300 text-sm">Architecture</span>
          </div>
        </div>
      </div>
    </section>

    <main className="relative">
      {children}
    </main>
  </div>
);

export default BlogLayout;