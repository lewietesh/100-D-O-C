export default function About() {
        return (
          <section id="about" className="bg-gray-100 py-16 px-6 lg:px-20">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
              {/* Left: Image */}
              <div className="w-full lg:w-1/2">
                <img
                  src="https://cdn.pixabay.com/photo/2015/07/31/14/59/creative-869200_1280.jpg"
                  alt="About Us"
                  className="rounded-lg shadow-lg"
                />
              </div>
      
              {/* Right: Text Content */}
              <div className="w-full lg:w-1/2">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Who We Are
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  We are a dynamic platform that empowers professionals and 
                  businesses to showcase their expertise and offer services 
                  effectively. Our goal is to bridge the gap between talent and 
                  opportunity through a sleek and intuitive interface.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  Whether you're a freelancer, consultant, or business owner, our 
                  platform helps you create an impactful online presence and connect 
                  with potential clients effortlessly.
                </p>
      
                {/* Call to Action */}
                <a 
                  href="/about" 
                  className="inline-block mt-4 bg-indigo-600 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
                >
                  Learn More
                </a>
              </div>
            </div>
          </section>
        );
      }
      