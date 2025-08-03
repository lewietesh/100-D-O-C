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

// Define fallback links outside component to prevent re-creation on every render
const HOME_FALLBACK_LINKS = [
  { name: 'View My Projects', href: '/projects' },
  { name: 'Request a Service', href: '/contact' },
];

export default function HomePage() {
  return (
    <div>
      <Hero
        routeName="home"
        fallbackTitle="Build a Better Future, With Tech"
        fallbackSubtitle="Dedicated to helping professionals build success stories whether through software development or content writing."
        fallbackLinks={HOME_FALLBACK_LINKS}
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
