import React from 'react';
import SectionIndex from '../components/SectionIndex.jsx';

function About() {
  return (
    // No background of its own — the site-wide noisy ambient layer shows
    // through, so this reads the same as the landing section.
    <section id="about" className="relative overflow-hidden py-20 text-bone sm:py-28" data-reveal>
      <div className="editorial-shell relative">
        <div className="grid gap-12 lg:grid-cols-[0.86fr_1.14fr]">
          <div>
            <SectionIndex id="about" />
            <h2 className="mt-16 text-[clamp(3.6rem,6vw,6.8rem)] font-black leading-[0.86] tracking-[-0.075em]">
              About me
            </h2>
            <p className="mt-8 max-w-xl text-2xl font-bold leading-tight tracking-[-0.04em] text-bone/75">
              Self-taught, endlessly curious, and most alive when an idea turns into something
              people can actually use.
            </p>
          </div>
          <div className="grid content-center gap-8 text-lg font-bold leading-8 text-bone/75">
            <p>
              I started in content, customer support, e-commerce, and admin operations. Those roles
              showed me where businesses lose time: repeated manual steps, unclear ownership, and
              tools that do not talk to each other.
            </p>
            <p>
              Today I build AI-assisted workflows and automation systems that make operations
              clearer, faster, and easier to maintain, while keeping the human judgment where it
              matters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
