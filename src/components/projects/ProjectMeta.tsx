import Link from 'next/link';

const ProjectMeta = ({ description, url }: { description: string; url?: string }) => (
  <>
    <p className="text-lg leading-relaxed mb-6 text-gray-700">{description}</p>
    {url && (
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mb-8 text-blue-600 hover:underline text-base font-medium"
      >
        🔗 See demo
      </Link>
    )}
  </>
);

export default ProjectMeta;
