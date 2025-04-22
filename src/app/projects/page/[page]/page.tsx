// app/projects/page/[page]/page.tsx

import Hero from '@/components/Hero';
import ProjectGrid from '@/app/projects/ProjectGrid';
import Pagination from '@/components/Pagination';
import { projects } from '@/data/projects';

interface PageProps {
  params: {
    page: string;
  };
}

const ProjectsPage = ({ params }: PageProps) => {
  const currentPage = parseInt(params.page || '1', 10);
  const projectsPerPage = 4;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  const paginatedProjects = projects.slice(
    (currentPage - 1) * projectsPerPage,
    currentPage * projectsPerPage
  );

  return (
    <>
      <Hero
        title="My Projects"
        subtitle="A showcase of my design, development, and creative work."
      />
      <main className="max-w-7xl mx-auto p-6">
        <ProjectGrid projects={paginatedProjects} />
        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/projects/page" />
      </main>
    </>
  );
};

export default ProjectsPage;
