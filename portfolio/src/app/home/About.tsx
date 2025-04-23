'use client';

export default function About() {
  return (
    <section id="about" className="bg-background-light dark:bg-background-dark py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left: Image */}
        <div className="w-full lg:w-1/2">
          <img
            src="https://cdn.pixabay.com/photo/2015/07/31/14/59/creative-869200_1280.jpg"
            alt="Lewis Mutembei - About"
            className="rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Right: Text Content */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-4xl font-bold text-text-light dark:text-text-dark mb-4">
            About Me
          </h2>

          <p className="text-text-secondary dark:text-gray-400 text-lg leading-relaxed mb-6">
            I'm Lewis Mutembei, a results-driven software developer with 5+ years of experience building scalable web apps and systems for finance, e-commerce, and consultancy industries. My mission is to use clean code and thoughtful architecture to solve real-world business challenges.
          </p>

          <p className="text-text-secondary dark:text-gray-400 text-lg leading-relaxed mb-6">
            My expertise spans JavaScript, TypeScript, Python, Django, PHP, React, machine learning, and data analysis. I'm passionate about crafting both frontend and backend solutions, collaborating across teams, and delivering software that performs and lasts.
          </p>

          {/* Call to Action */}
          <a
            href="/contact"
            className="inline-block mt-4 bg-brand text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-brand-dark transition"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
