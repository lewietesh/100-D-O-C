import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';

import ProjectLayout from '@/app/projects/ProjectLayout';
import ProjectHeader from '@/app/projects/ProjectHeader';
import ProjectImage from '@/app/projects/ProjectImage';
import ProjectMeta from '@/app/projects/ProjectMeta';
import ProjectReviews from '@/app/projects/ProjectReviews';
import CommentsSection from '@/components/CommentSection';
import NewsletterSignup from '@/components/NewsletterSignup';

// Pre-generate all slugs
export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

// PAGE: correctly typed
interface PageProps {
  params: { slug: string };
}

export default async function ProjectDetail({ params }: PageProps) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <ProjectLayout>
      <ProjectHeader project={project} />
      <ProjectImage src={project.image} alt={project.title} />
      <ProjectMeta description={project.description} url={project.url} />
      <ProjectReviews reviews={project.reviews} />
      <CommentsSection initialComments={project.comments || []} />
      <NewsletterSignup />
    </ProjectLayout>
  );
}
