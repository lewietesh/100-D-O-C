import Image from 'next/image';

const ProjectImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative w-full h-[300px] sm:h-[400px] mb-6 rounded-lg overflow-hidden">
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="(min-width: 1024px) 800px, 100vw"
    />
  </div>
);

export default ProjectImage;
