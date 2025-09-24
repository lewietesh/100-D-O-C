// components/projects/ProjectGrid.tsx
// components/projects/ProjectGrid.tsx
import { Project } from '@/types/projects';
import ProjectCard from '@/components/projects/ProjectCard';
import { cn } from '@/lib/utils';
import { FolderOpen } from "lucide-react";

interface ProjectGridProps {
  projects: Project[];
  loading?: boolean;
  className?: string;
}

export default function ProjectGrid({ projects, loading = false, className }: ProjectGridProps) {
  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <div className="h-48 bg-neutral-200 dark:bg-neutral-700"></div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-20"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
                </div>
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3"></div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-24"></div>
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-12"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div className="text-neutral-400 dark:text-neutral-600 mb-6">
          <FolderOpen className="mx-auto h-16 w-16" />
        </div>
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">No projects found</h3>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
          There are no projects to display at the moment. Check back soon for new work.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
