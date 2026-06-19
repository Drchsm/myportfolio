import React, { useEffect } from 'react';
import Navigation from './components/Navigation.jsx';
import Hero from './sections/Hero.jsx';
import Services from './sections/Services.jsx';
import Showcase from './sections/Showcase.jsx';
import About from './sections/About.jsx';
import Contact from './sections/Contact.jsx';

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
      <div className="pointer-events-none fixed inset-0 z-0 opacity-80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(194,178,162,0.16),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(226,232,240,0.1),transparent_26%),linear-gradient(135deg,rgba(74,59,50,0.22),transparent_38%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(249,246,240,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(249,246,240,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
      </div>
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <Services />
        <Showcase />
        <About />
        <Contact />
      </div>
    </main>
  );
}

export default App;
