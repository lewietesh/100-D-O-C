import Navigation from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "./About";
import Projects from "./Projects";
import Services from "./Services";
import Testimonials from "./Testimonials";
import Blog from './Blog';
import Contact from "./Contact";
import Footer from "../../components/Footer";
import Stats from "./Stats"; // Adjust path if it's in another folder


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
