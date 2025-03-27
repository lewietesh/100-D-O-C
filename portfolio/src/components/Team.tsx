'use client';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

type Person = {
        name: string;
        role: string;
        imageUrl: string;
        social?: {
          linkedin?: string;
          twitter?: string;
          github?: string;
        };
      };
      

      const people: Person[] = [
        {
          name: 'Leslie Alexander',
          role: 'Co-Founder / CEO',
          imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?...',
          social: {
            linkedin: 'https://linkedin.com/in/lesliealex',
            twitter: 'https://twitter.com/lesliealex',
          },
        },
        {
          name: 'David Lee',
          role: 'UX Designer',
          imageUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?...',
          social: {
            github: 'https://github.com/davidleeux',
          },
        },
      ];
      

export default function Team() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-8 xl:grid-cols-3">
        <div className="max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            Meet our leadership
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            We’re a dynamic group of individuals who are passionate about what we do and dedicated to delivering the
            best results for our clients.
          </p>
        </div>
        <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
          {people.map((person) => (
            <li key={person.name}>
<div className="flex items-center gap-x-6">
  <img alt={person.name} src={person.imageUrl} className="size-16 rounded-full object-cover" />
  <div>
    <h3 className="text-base font-semibold text-gray-900">{person.name}</h3>
    <p className="text-sm text-indigo-600">{person.role}</p>
    {person.social && (
      <div className="mt-2 flex gap-3 text-gray-400">
        {person.social.linkedin && (
          <a href={person.social.linkedin} target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="hover:text-indigo-600 transition" />
          </a>
        )}
        {person.social.twitter && (
          <a href={person.social.twitter} target="_blank" rel="noopener noreferrer">
            <FaTwitter className="hover:text-blue-500 transition" />
          </a>
        )}
        {person.social.github && (
          <a href={person.social.github} target="_blank" rel="noopener noreferrer">
            <FaGithub className="hover:text-gray-900 transition" />
          </a>
        )}
      </div>
    )}
  </div>
</div>

            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
