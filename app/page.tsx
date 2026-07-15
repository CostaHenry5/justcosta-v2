import Navbar from "../components/Navbar";
import About from "../components/About";
import Stats from "../components/Stats";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Services from "../components/Services";
import Projects from "../components/Projects";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import ScrollToTop from "../components/ScrollToTop";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar />
      <About />
      <Stats />
      <Experience />
      <Skills />
      <Services />
      <Projects />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </main>
  );
}