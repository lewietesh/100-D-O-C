//src/app/page/[page]/page.tsx
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import ProjectGrid from '@/app/projects/ProjectGrid';
import Pagination from '@/components/Pagination';
import { projects } from '@/data/projects';

// Force static generation
export const dynamic = 'force-static';

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  if (!page || isNaN(Number(page))) {
    notFound();
  }

  const currentPage = parseInt(page, 10);
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/projects/page"
        />
      </main>
    </>
  );
}

export async function generateStaticParams() {
  const projectsPerPage = 4;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}
