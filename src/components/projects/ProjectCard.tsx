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
                              case 'completed': return 'bg-green-100 text-green-800';
                              case 'ongoing': return 'bg-blue-100 text-blue-800';
                              case 'maintenance': return 'bg-yellow-100 text-yellow-800';
                              default: return 'bg-gray-100 text-gray-800';
                    }
          };

          // Format dates
          const formattedDate = new Date(project.date_created).toLocaleDateString();
          const completionDate = project.completion_date ? new Date(project.completion_date).toLocaleDateString() : null;

          return (
                    <div
                              className={cn(
                                        "relative group overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-all duration-300",
                                        className
                              )}
                              onMouseEnter={() => setHovered(true)}
                              onMouseLeave={() => setHovered(false)}
                    >
                              {/* Project Image */}
                              <div className="relative w-full h-60 overflow-hidden">
                                        <Image
                                                  src={imageError ? '/images/project-placeholder.jpg' : (project.image_url || '/images/project-placeholder.jpg')}
                                                  alt={project.title}
                                                  fill
                                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                                  onError={() => setImageError(true)}
                                        />

                                        {/* Status Badge */}
                                        <div className="absolute top-4 left-4">
                                                  <span className={cn(
                                                            "px-2 py-1 text-xs font-medium rounded-full",
                                                            getStatusColor(project.status)
                                                  )}>
                                                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                                  </span>
                                        </div>

                                        {/* Featured Badge */}
                                        {project.featured && (
                                                  <div className="absolute top-4 right-4">
                                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                                                                      Featured
                                                            </span>
                                                  </div>
                                        )}

                                        {/* Hover Overlay */}
                                        <div
                                                  className={cn(
                                                            "absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center transition-opacity duration-300",
                                                            hovered ? 'opacity-100' : 'opacity-0'
                                                  )}
                                        >
                                                  <div className="text-center">
                                                            <Link
                                                                      href={`/projects/${project.slug}`}
                                                                      className="inline-flex items-center px-4 py-2 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors duration-200 font-medium"
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
                                        <div className="flex items-center justify-between mb-2">
                                                  <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                                                            {project.category || 'Web Development'}
                                                  </span>
                                                  <span className="text-sm text-gray-500 flex items-center">
                                                            <CalendarIcon className="w-4 h-4 mr-1" />
                                                            {formattedDate}
                                                  </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                                  <Link href={`/projects/${project.slug}`}>
                                                            {project.title}
                                                  </Link>
                                        </h3>

                                        {/* Description */}
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                  {project.description}
                                        </p>

                                        {/* Project Links */}
                                        <div className="flex items-center gap-3 mb-4">
                                                  {project.url && (
                                                            <a
                                                                      href={project.url}
                                                                      target="_blank"
                                                                      rel="noopener noreferrer"
                                                                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
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
                                                                      className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                                                                      onClick={(e) => e.stopPropagation()}
                                                            >
                                                                      <CodeBracketIcon className="w-4 h-4 mr-1" />
                                                                      Code
                                                            </a>
                                                  )}
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                  {/* Client/Domain */}
                                                  <div className="text-sm text-gray-500">
                                                            {project.domain || (project.client?.first_name && project.client?.last_name ?
                                                                      `${project.client.first_name} ${project.client.last_name}` :
                                                                      project.client?.company_name || 'Personal Project')}
                                                  </div>

                                                  {/* Likes */}
                                                  <button
                                                            onClick={handleLikeClick}
                                                            disabled={likesLoading}
                                                            className={cn(
                                                                      "flex items-center space-x-1 text-sm transition-colors duration-200",
                                                                      likesLoading ? "opacity-50 cursor-not-allowed" : "hover:text-red-500 cursor-pointer",
                                                                      likes > project.likes ? "text-red-500" : "text-gray-500"
                                                            )}
                                                  >
                                                            {likes > project.likes ? (
                                                                      <HeartSolidIcon className="w-4 h-4" />
                                                            ) : (
                                                                      <HeartIcon className="w-4 h-4" />
                                                            )}
                                                            <span>{likes}</span>
                                                  </button>
                                        </div>
                              </div>
                    </div>
          );
}
