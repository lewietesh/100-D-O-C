'use client';

import { useState } from 'react';

// ✅ Fake project data
const projects = [
  {
    id: 1,
    title: 'Wine Collection UI',
    category: 'Design',
    image: 'https://source.unsplash.com/400x500/?wine,design',
  },
  {
    id: 2,
    title: 'Smart Devices',
    category: 'Web',
    image: 'https://source.unsplash.com/400x400/?tech,minimal',
  },
  {
    id: 3,
    title: 'Architecture Pattern',
    category: 'Design',
    image: 'https://source.unsplash.com/400x600/?architecture,abstract',
  },
  {
    id: 4,
    title: 'Workspace Layout',
    category: 'Brand',
    image: 'https://source.unsplash.com/400x400/?workspace,branding',
  },
  {
    id: 5,
    title: 'Dog Portrait',
    category: 'Brand',
    image: 'https://source.unsplash.com/400x300/?dog,studio',
  },
  {
    id: 6,
    title: 'Modern Lamps',
    category: 'Web',
    image: 'https://source.unsplash.com/400x600/?lamp,interior',
  },
];

// ✅ Optional: Tag filter list
const filters = ['All', 'Web', 'Design', 'Brand'];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 px-6 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 text-blue-600">
          Portfolio
        </h2>

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full border transition ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group cursor-pointer overflow-hidden rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4 bg-white">
                <h3 className="text-lg font-semibold text-gray-800">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-500">{project.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
