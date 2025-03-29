// app/projects/[slug]/page.tsx

import { projects } from '@/data/projects';
import { notFound } from 'next/navigation';

import ProjectLayout from '../ProjectLayout';
import ProjectHeader from '../ProjectHeader';
import ProjectImage from '../ProjectImage';
import ProjectMeta from '../ProjectMeta';
import ProjectReviews from '../ProjectReviews';
import CommentsSection from '@/components/CommentSection';
import NewsletterSignup from '@/components/NewsletterSignup';

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return notFound();

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
