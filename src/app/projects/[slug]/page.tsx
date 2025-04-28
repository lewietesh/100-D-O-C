// app/projects/[slug]/page.tsx
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

// Make page component async
export default async function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound(); // Triggers 404 page
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
