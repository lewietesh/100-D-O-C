'use client';

import { useState } from 'react';

const filters = ['All', 'Web', 'E-commerce', 'Mobile', 'Organizational', 'Machine Learning', 'Tools'];

const projects = [
  {
    id: 1,
    title: 'Carlite Kenya',
    category: 'E-commerce',
    image: 'https://images.unsplash.com/photo-1649451844813-3130d6f42f8a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c29mdHdhcmUlMjBwcm9qZWN0fGVufDB8fDB8fHww',
    url: 'https://cartlite.co.ke',
    tech: ['React', 'PHP', 'MySQL'],
  },
  {
    id: 2,
    title: 'Aquasan Technologies',
    category: 'Organizational',
    image: 'https://plus.unsplash.com/premium_photo-1682464651356-3c6780eff00c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHNvZnR3YXJlJTIwcHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D',
    url: 'https://aquasan.co.ke',
    tech: ['Django', 'HTML', 'SMTP'],
  },
  {
    id: 3,
    title: 'Domfin Consultancy',
    category: 'Web',
    image: 'https://images.unsplash.com/photo-1542395765-761de4ee9696?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHNvZnR3YXJlJTIwcHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D',
    url: 'https://domfin.co.ke',
    tech: ['React', 'Django', 'PostgreSQL'],
  },
  {
    id: 4,
    title: 'Sortika Savings Module',
    category: 'Mobile',
    image: 'https://images.unsplash.com/photo-1656680632373-e2aec264296b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzZ8fHNvZnR3YXJlJTIwcHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D',
    url: '#',
    tech: ['Flutter', 'REST API'],
  },
  {
    id: 5,
    title: 'ISP Client Management System',
    category: 'Tools',
    image: 'https://images.unsplash.com/photo-1623282033815-40b05d96c903?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fHNvZnR3YXJlJTIwcHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D',
    url: '#',
    tech: ['React', 'Django', 'PostgreSQL'],
  },
  {
    id: 6,
    title: 'ML Sales Forecast Tool',
    category: 'Machine Learning',
    image: 'https://images.unsplash.com/photo-1564798605859-a4ab4a561b2a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHNvZnR3YXJlJTIwcHJvamVjdHxlbnwwfHwwfHx8MA%3D%3D',
    url: '#',
    tech: ['Python', 'Pandas', 'scikit-learn'],
  },
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 px-6 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-10 text-brand dark:text-brand-dark">
          Featured Projects
        </h2>

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full border transition text-sm font-medium ${
                activeFilter === filter
                  ? 'bg-brand text-white border-brand'
                  : 'bg-surface-light dark:bg-surface-dark text-text-secondary hover:bg-gray-200 dark:hover:bg-surface-dark/80'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {filteredProjects.map((project) => (
            <a
              key={project.id}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group cursor-pointer overflow-hidden rounded-lg shadow hover:shadow-lg transition bg-surface-light dark:bg-surface-dark"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-text-secondary dark:text-gray-400 mb-2">
                  {project.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs bg-brand/10 text-brand dark:text-brand-dark px-2 py-1 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
