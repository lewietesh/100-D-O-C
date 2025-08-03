//src/app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';

import ProjectLayout from '@/components/projects/ProjectLayout';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectImage from '@/components/projects/ProjectImage';
import ProjectMeta from '@/components/projects/ProjectMeta';
import ProjectReviews from '@/components/projects/ProjectReviews';
import CommentsSection from '@/components/CommentSection';
import NewsletterSignup from '@/components/NewsletterSignup';

// Static generation enforced
export const dynamic = 'force-static';

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

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

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
