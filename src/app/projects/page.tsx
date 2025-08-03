// app/projects/page.tsx
import { Suspense } from 'react';
import { Metadata } from 'next';
import ProjectsContainer from '../../components/projects/ProjectsContainer';
import ProjectsLoading from './loading';

interface ProjectsPageProps {
  searchParams: {
    page?: string;
    category?: string;
    search?: string;
    status?: string;
    featured?: string;
    technology?: string;
  };
}

export async function generateMetadata({
  searchParams,
}: ProjectsPageProps): Promise<Metadata> {
  const page = Number(searchParams.page) || 1;
  const title = page === 1 ? 'My Projects' : `My Projects - Page ${page}`;

  return {
    title,
    description: 'Explore my portfolio of web development projects and applications.',
    alternates: {
      canonical: page === 1 ? '/projects' : `/projects?page=${page}`,
    },
  };
}

export default function ProjectsPage({ searchParams }: ProjectsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<ProjectsLoading />}>
        <ProjectsContainer searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
