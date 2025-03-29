import { Project } from '@/data/projects';

const ProjectHeader = ({ project }: { project: Project }) => (
  <div className="mb-8 space-y-2">
    <h1 className="text-3xl sm:text-4xl font-bold">{project.title}</h1>
    <div className="text-sm sm:text-base text-gray-500 flex flex-wrap gap-4">
      <span className="bg-gray-100 px-2 py-1 rounded">{project.category}</span>
      <span className="bg-gray-100 px-2 py-1 rounded">{project.domain}</span>
      <span className="bg-gray-100 px-2 py-1 rounded">Client: {project.client}</span>
      <span className="bg-gray-100 px-2 py-1 rounded">❤️ {project.likes} Likes</span>
    </div>
  </div>
);

export default ProjectHeader;
