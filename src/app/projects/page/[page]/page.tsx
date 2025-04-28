import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import ProjectLayout from '@/app/projects/ProjectLayout';
import ProjectGrid from '@/app/projects/ProjectGrid';

interface PageProps {
  params: { page: string };
}

const ITEMS_PER_PAGE = 6;

export async function generateStaticParams() {
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  return Array.from({ length: totalPages }, (_, i) => ({ page: (i + 1).toString() }));
}

export default async function ProjectsPage({ params }: PageProps) {
  const pageNumber = parseInt(params.page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const start = (pageNumber - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedProjects = projects.slice(start, end);

  if (paginatedProjects.length === 0) {
    notFound();
  }

  return (
    <ProjectLayout>
      <ProjectGrid projects={paginatedProjects} />
    </ProjectLayout>
  );
}
