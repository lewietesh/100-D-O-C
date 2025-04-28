'use client'

export default function About() {
  return (
    <section id="about" className="w-full overflow-x-hidden bg-alternate dark:bg-black transition-colors duration-300 py-16 px-6 lg:px-20">
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
          <h2 className="text-4xl font-bold text-[var(--foreground)] dark:text-[var(--foreground)] mb-4">
            About Me
          </h2>

          <p className="text-primary dark:text-gray-400 text-lg leading-relaxed mb-6">

            A tech-savvy with over five years of experience developing  unique, and standard web software solutions that are usable, interactive, reliable and scalable.
            
            <br></br>
            <br></br>
            In addition, I have 8+ of experience as a content writer, with a focus on essays, research papers, dissertations, technical writing and course projects.
            <br></br>
            <br></br>
            My mission is to help individuals and businesses develop, grow, and thrive whether through technology innovations or professionally written content.



            {/* Expect nothing less of flexible solutions unique software applications, blog platforms, online stores, organizational sites, data analysis, and machine learning models. */}
          </p>
          {/* Call to Action */}
          <a
            href="/contact"
            className="inline-block mt-4 bg-cta  text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-cta-dark transition"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  )
}
