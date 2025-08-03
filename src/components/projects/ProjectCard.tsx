// components/projects/ProjectCard.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

import type { Project } from '@/data/projects';

interface ProjectCardProps {
          project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
          const [hovered, setHovered] = useState(false);

          return (
                    <div
                              className="relative group overflow-hidden rounded-lg shadow-md"
                              onMouseEnter={() => setHovered(true)}
                              onMouseLeave={() => setHovered(false)}
                    >
                              <div className="relative w-full h-60">
                                        <Image
                                                  src={project.image}
                                                  alt={project.title}
                                                  fill
                                                  className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                                                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                        />
                              </div>

                              <div
                                        className={`absolute inset-0 flex items-end bg-black bg-opacity-60 transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'
                                                  }`}
                              >
                                        <div className="p-4 w-full">
                                                  <p className="text-yellow-400 uppercase text-sm font-medium mb-1">{project.category}</p>
                                                  <h3 className="text-white text-xl font-semibold">{project.title}</h3>
                                                  <Link
                                                            href={`/projects/${project.slug}`}
                                                            className="inline-flex items-center mt-2 text-white hover:text-yellow-400 transition"
                                                  >
                                                            <ArrowRightIcon className="w-4 h-4 mr-1" />
                                                            View Project
                                                  </Link>
                                        </div>
                              </div>
                    </div>
          );
};

export default ProjectCard;
