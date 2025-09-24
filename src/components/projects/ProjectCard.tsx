// components/projects/ProjectCard.tsx
// components/projects/ProjectCard.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  ArrowRightIcon,
  HeartIcon,
  EyeIcon,
  CalendarIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { Project } from '@/types/projects';
import { useProjectLikes } from '@/hooks/useProjects';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Use the like hook for real-time likes
  const { likes, loading: likesLoading, toggleLike } = useProjectLikes(project.id, project.likes);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!likesLoading) {
      await toggleLike();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900';
      case 'ongoing': return 'bg-neutral-700 dark:bg-neutral-300 text-white dark:text-neutral-900';
      case 'maintenance': return 'bg-neutral-500 dark:bg-neutral-500 text-white dark:text-white';
      default: return 'bg-neutral-400 dark:bg-neutral-600 text-white dark:text-white';
    }
  };

  // Format dates
  const formattedDate = new Date(project.date_created).toLocaleDateString();
  const completionDate = project.completion_date ? new Date(project.completion_date).toLocaleDateString() : null;

  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-lg dark:hover:shadow-neutral-900/50 transition-all duration-300 hover:-translate-y-1",
        className
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Project Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={imageError ? '/images/project-placeholder.jpg' : (project.image_url || '/images/project-placeholder.jpg')}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          onError={() => setImageError(true)}
        />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={cn(
            "px-3 py-1 text-xs font-medium rounded-full",
            getStatusColor(project.status)
          )}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900">
              Featured
            </span>
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300",
            hovered ? 'opacity-100' : 'opacity-0'
          )}
        >
          <div className="text-center">
            <Link
              href={`/projects/${project.slug}`}
              className="inline-flex items-center px-6 py-3 bg-white text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors duration-200 font-medium shadow-lg"
            >
              <EyeIcon className="w-4 h-4 mr-2" />
              View Project
            </Link>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
            {project.category || 'Web Development'}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            {formattedDate}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors duration-200 line-clamp-2">
          <Link href={`/projects/${project.slug}`}>
            {project.title}
          </Link>
        </h3>

        {/* Description */}
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        {/* Project Links */}
        <div className="flex items-center gap-4 mb-4">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white flex items-center transition-colors font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowRightIcon className="w-4 h-4 mr-1" />
              Live Demo
            </a>
          )}
          {project.repository_url && (
            <a
              href={project.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <CodeBracketIcon className="w-4 h-4 mr-1" />
              Code
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
          {/* Client/Domain */}
          <div className="text-sm text-neutral-500 dark:text-neutral-400 truncate flex-1 mr-4">
            {project.domain || (project.client?.first_name && project.client?.last_name ?
              `${project.client.first_name} ${project.client.last_name}` :
              project.client?.company_name || 'Personal Project')}
          </div>

          {/* Likes */}
          <button
            onClick={handleLikeClick}
            disabled={likesLoading}
            className={cn(
              "flex items-center space-x-1 text-sm transition-colors duration-200 px-2 py-1 rounded-md",
              likesLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer",
              likes > project.likes ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"
            )}
          >
            {likes > project.likes ? (
              <HeartSolidIcon className="w-4 h-4" />
            ) : (
              <HeartIcon className="w-4 h-4" />
            )}
            <span className="font-medium">{likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}