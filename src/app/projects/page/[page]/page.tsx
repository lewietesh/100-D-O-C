import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import ProjectGrid from '@/app/projects/ProjectGrid';
import Pagination from '@/components/Pagination';
import { projects } from '@/data/projects';

export const dynamicParams = true; // ✅ allow dynamic params

interface PageProps {
  params: Promise<{ page: string }>;
}

export default async function ProjectsPage({ params }: PageProps) {
  const { page } = await params; // ✅ correctly await props
  const pageParam = (await params).page;

  if (!pageParam || isNaN(Number(pageParam))) {
    notFound();
  }

  const currentPage = parseInt(pageParam, 10);
  const projectsPerPage = 4;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  if (currentPage < 1 || currentPage > totalPages) {
    notFound();
  }

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
}
