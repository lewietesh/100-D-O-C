// app/projects/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import ProjectsContainer from '@/components/projects/ProjectsContainer';
import ProjectsLoading from './loading';

interface ProjectsPageProps {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    status?: string;
    featured?: string;
    technology?: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: ProjectsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const title = page === 1 ? 'My Projects' : `My Projects - Page ${page}`;

  return {
    title,
    description: 'Explore my portfolio of web development projects and applications.',
    alternates: {
      canonical: page === 1 ? '/projects' : `/projects?page=${page}`,
    },
  };
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<ProjectsLoading />}>
        <ProjectsContainer searchParams={params} />
      </Suspense>
    </div>
  );
}
