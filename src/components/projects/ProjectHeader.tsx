import { Project } from '@/types/projects';
import { CalendarIcon, UserIcon, TagIcon } from '@heroicons/react/24/outline';

const ProjectHeader = ({ project }: { project: Project }) => {
  const formattedDate = new Date(project.date_created).toLocaleDateString();
  const completionDate = project.completion_date ? new Date(project.completion_date).toLocaleDateString() : null;
  
  return (
    <div className="mb-8 space-y-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{project.title}</h1>
      
      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
        {project.category && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
            <TagIcon className="w-4 h-4 mr-1" />
            {project.category}
          </span>
        )}
        
        {project.domain && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800">
            {project.domain}
          </span>
        )}
        
        {(project.client?.first_name || project.client?.company_name) && (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800">
            <UserIcon className="w-4 h-4 mr-1" />
            {project.client.company_name || `${project.client.first_name} ${project.client.last_name}`}
          </span>
        )}
        
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800">
          <CalendarIcon className="w-4 h-4 mr-1" />
          {completionDate || formattedDate}
        </span>
        
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          project.status === 'completed' ? 'bg-green-100 text-green-800' :
          project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </span>
      </div>
      
      {project.description && (
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
          {project.description}
        </p>
      )}
    </div>
  );
};

export default ProjectHeader;
