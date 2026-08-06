import React, { useEffect } from 'react';
import Navigation from './components/Navigation.jsx';
import Hero from './sections/Hero.jsx';
import Services from './sections/Services.jsx';
import Showcase from './sections/Showcase.jsx';
import About from './sections/About.jsx';
import Experience from './sections/Experience.jsx';
import Contact from './sections/Contact.jsx';
import NoisyGradientBackground from './components/NoisyGradientBackground.jsx';

function App() {
  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-espresso text-bone">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-95">
        <NoisyGradientBackground />
      </div>
      <div className="relative z-10">
        <Navigation />
        {/* Order defines the 01-07 numbering; keep in sync with src/data/sections.js */}
        <Hero />
        <About />
        <Services />
        <Showcase />
        <Experience />
        <Contact />
      </div>
    </main>
  );
}

export default App;
