import { Briefcase, Code2, Rocket } from 'lucide-react';

export default function ProjectsHero() {
  return (
    <section className="relative bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-neutral-100 dark:bg-neutral-800 opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-neutral-100 dark:bg-neutral-800 opacity-50 blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:20px_20px] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-full text-sm font-medium border border-neutral-200 dark:border-neutral-700">
            <Briefcase className="w-4 h-4" />
            Portfolio & Case Studies
          </div>
          
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white leading-tight">
              Featured <span className="relative">Works</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
              Explore a collection of projects that showcase modern web solutions, 
              innovative design, and technical excellence in solving real business challenges.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-8 pt-8">
            <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="p-2 bg-neutral-900 dark:bg-white rounded-lg">
                <Code2 className="w-4 h-4 text-white dark:text-neutral-900" />
              </div>
              <span className="font-medium text-neutral-700 dark:text-neutral-300 text-sm">Full-Stack Solutions</span>
            </div>
            
            <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800 px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="p-2 bg-neutral-900 dark:bg-white rounded-lg">
                <Rocket className="w-4 h-4 text-white dark:text-neutral-900" />
              </div>
              <span className="font-medium text-neutral-700 dark:text-neutral-300 text-sm">Production Ready</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">25+</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">15+</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">3+</div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}