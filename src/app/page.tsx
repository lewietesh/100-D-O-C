//src/app/page.tsx
import Hero from "@/components/Hero";
import About from "@/app/home/About";
import Projects from "@/app/home/Projects";
import Services from "@/app/home/Services";
import Testimonials from "@/app/home/Testimonials";
import Blog from '@/app/home/Blog';
import Contact from "@/app/home/Contact";
import Stats from "@/app/home/Stats"; // Adjust path if it's in another folder
import ServicesShowcase from "@/components/services/ServicesShowcase";
import TechStackShowcase from "@/components/home/TechStackShowcase";


export default function HomePage() {
  return (
    <div>
    <Hero
      title="Build a Better Future, With Tech"
      subtitle="Dedicated to helping professionals build success stories whether through software development or content writing."
      links={[
        { name: 'View My Projects', href: '/projects' },
        { name: 'Request a Service', href: '/contact' },
      ]}
      // stats={[
      //   { name: 'Projects Completed', value: '12+' },
      //   { name: 'Industries Served', value: '6+' },
      //   { name: 'Years of Experience', value: '5+' },
      //   { name: 'Happy Clients', value: '10+' },
      // ]}
    />
      
      {/* <About /> */}
      {/* This one */}
      <ServicesShowcase />
<TechStackShowcase />
      <Projects />
      <Testimonials />
      <Blog />
      <Contact />
    </div>
  );
}
