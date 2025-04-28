// app/projects/ProjectGrid.tsx
import { Project } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';

interface ProjectGridProps {
  projects: Project[];
}

const ProjectGrid = ({ projects }: ProjectGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </div>
  );
};

export default ProjectGrid;

