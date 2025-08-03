//src/app/projects/[slug]/page.tsx
'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import { useProject } from '@/hooks/useProjects';

import ProjectLayout from '@/components/projects/ProjectLayout';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectImage from '@/components/projects/ProjectImage';
import ProjectMeta from '@/components/projects/ProjectMeta';
import ProjectReviews from '@/components/projects/ProjectReviews';
import ProjectComments from '@/components/projects/ProjectComments';
import NewsletterSignup from '@/components/NewsletterSignup';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface ProjectDetailProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectDetail({ params }: ProjectDetailProps) {
  const [slug, setSlug] = React.useState<string>('');

  // Unwrap params
  React.useEffect(() => {
    params.then(({ slug }) => setSlug(slug));
  }, [params]);

  const { project, loading, error, refetch } = useProject(slug);

  if (loading) {
    return (
      <ProjectLayout>
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </ProjectLayout>
    );
  }

  if (error) {
    return (
      <ProjectLayout>
        <ErrorMessage message={error} onRetry={refetch} />
      </ProjectLayout>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <ProjectLayout>
      <ProjectHeader project={project} />
      <ProjectImage src={project.image_url || '/images/project-placeholder.jpg'} alt={project.title} />
      <ProjectMeta description={project.description} url={project.url} />
      <ProjectReviews reviews={project.reviews} />
      <ProjectComments projectId={project.id} initialComments={project.comments || []} />
      <NewsletterSignup />
    </ProjectLayout>
  );
}
