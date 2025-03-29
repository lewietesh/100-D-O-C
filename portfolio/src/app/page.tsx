import Navigation from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/app/home/About";
import Projects from "@/app/home/Projects";
import Services from "@/app/home/Services";
import Testimonials from "@/app/home/Testimonials";
import Blog from '@/app/home/Blog';
import Contact from "@/app/home/Contact";
import Footer from "@/components/Footer";
import Stats from "@/app/home/Stats"; // Adjust path if it's in another folder


const homeLinks = [
  { name: 'Get started', href: '#services' },
  { name: 'View portfolio', href: '#projects' },
  { name: 'Contact us', href: '#contact' },
];

const homeStats = [
  { name: 'Years of experience', value: '10+' },
  { name: 'Projects delivered', value: '150+' },
  { name: 'Happy clients', value: '100%' },
  { name: 'Locations served', value: 'Global' },
];

export default function HomePage() {
  return (
    <div>
      <Navigation />
      <Hero
        title="Empowering Digital Excellence"
        subtitle="We design and build modern digital products to help your business grow."
        links={homeLinks}
        stats={homeStats}
      />      <About />
      <Services />
      <Stats />
      <Projects />
      <Testimonials />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
}
