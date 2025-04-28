// app/projects/page/[page]/page.tsx
'use client';

import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import Hero from '@/components/Hero';
import ProjectGrid from '@/app/projects/ProjectGrid';
import Pagination from '@/components/Pagination';
import { projects } from '@/data/projects';

export default function ProjectsPage() {
  const params = useParams<{ page: string }>();
  const pageParam = params.page;

  if (!pageParam || isNaN(Number(pageParam))) {
    notFound(); // invalid page, show 404
  }

  const currentPage = parseInt(pageParam, 10);
  const projectsPerPage = 4;
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  if (currentPage < 1 || currentPage > totalPages) {
    notFound(); // page out of range
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
