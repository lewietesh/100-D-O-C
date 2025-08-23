//src/app/projects/[slug]/page.tsx
import { notFound } from 'next/navigation';

import { ProjectWithDetails } from '@/types/projects';

import ProjectLayout from '@/components/projects/ProjectLayout';
import ProjectHeader from '@/components/projects/ProjectHeader';
import ProjectImage from '@/components/projects/ProjectImage';
import ProjectMeta from '@/components/projects/ProjectMeta';
import ProjectReviews from '@/components/projects/ProjectReviews';
import CommentsSection from '@/components/CommentSection';
import NewsletterSignup from '@/components/NewsletterSignup';

// Static generation enforced
export const dynamic = 'force-static';

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Build API URL
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const apiUrl = `${base}/api/v1/projects/projects/${slug}/`;

  let project: ProjectWithDetails | null = null;
  try {
    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) throw new Error('Not found');
    project = await res.json();
  } catch (e) {
    notFound();
  }

  if (!project) notFound();

  // Defensive: fallback to empty arrays if missing
  const comments = Array.isArray(project.comments)
    ? project.comments.map((c) => ({ ...c, approved: c.approved ?? false, createdAt: c.date_created }))
    : [];

  // Use image_url for ProjectImage, fallback to empty string
  return (
    <ProjectLayout>
      <ProjectHeader project={project} />
      <ProjectImage src={project.image_url || ''} alt={project.title} />
      <ProjectMeta description={project.description} url={project.url} />
      {/* ProjectReviews removed: not present in ProjectWithDetails */}
      <CommentsSection postSlug={slug} initialComments={comments} />
      <NewsletterSignup />
    </ProjectLayout>
  );
}

// If you want to statically generate project pages, fetch slugs from the API
export async function generateStaticParams() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const apiUrl = `${base}/api/v1/projects/projects/`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || data).map((project: any) => ({ slug: project.slug }));
  } catch {
    return [];
  }
}
