import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import ProjectLayout from '@/app/projects/ProjectLayout';
import ProjectGrid from '@/app/projects/ProjectGrid';

interface PageProps {
  params: { page: string };
}

const ITEMS_PER_PAGE = 6; // Number of projects per page

export async function generateStaticParams() {
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export default function ProjectsPage({ params }: PageProps) {
  const pageNumber = parseInt(params.page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound(); // Invalid page
  }

  const start = (pageNumber - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedProjects = projects.slice(start, end);

  if (paginatedProjects.length === 0) {
    notFound(); // No projects found for this page
  }

  return (
    <ProjectLayout>
      <ProjectGrid projects={paginatedProjects} />
    </ProjectLayout>
  );
}
