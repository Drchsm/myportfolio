import React from 'react';
import SectionIndex from '../components/SectionIndex.jsx';

// Accents run newest -> oldest down the palette's recency ramp.
const experiences = [
  {
    period: '2026 - Present',
    accent: 'rgb(var(--accent-1))',
    role: 'AI Automation Specialist',
    company: 'Upwork / Freelance',
    label: 'AI Automation . n8n . Zapier . Make',
    body: 'Designing n8n workflows that streamline operations, connect applications, reduce manual work, and make recurring processes easier to audit.'
  },
  {
    period: '2024 - 2026',
    accent: 'rgb(var(--accent-2))',
    role: 'Digital Content Editor',
    company: 'Reed Elsevier Philippines',
    label: 'Digital Content . Editing . QA/QC',
    body: 'Improved content accuracy and reduced post-publication corrections by implementing consistent review checkpoints across the editorial workflow.'
  },
  {
    period: '2025',
    accent: 'rgb(var(--accent-3))',
    role: 'SEO and Virtual Assistant',
    company: 'Upwork / Freelance',
    label: 'SEO . Graphic Design',
    body: 'Increased organic search visibility for client websites by optimizing on-page elements.'
  }
];

const communities = [
  {
    name: 'AI Workflow Practice',
    role: 'Automation systems builder',
    date: '2026',
    body: 'Building practical internal tools and repeatable workflows for founders and teams.'
  },
  {
    name: 'Remote Operations',
    role: 'Support and process design',
    date: '2025',
    body: 'Turning scattered requests into documented, visible, and repeatable execution rhythms.'
  },
  {
    name: 'PUP Information Technology',
    role: 'BSIT graduate',
    date: '2024',
    body: 'Capstone leadership across UI/UX and mobile application development.'
  }
];

function Experience() {
  return (
    <section id="experience" className="bg-umber py-20 text-bone sm:py-28" data-reveal>
      <div className="editorial-shell">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SectionIndex id="experience" />
            <h2 className="mt-12 text-[clamp(4.4rem,7.8vw,8.8rem)] font-black leading-[0.82] tracking-[-0.085em]">
              Experience
            </h2>
            <div className="mt-16">
              {experiences.map((item, index) => (
                <article key={item.role} className="relative grid grid-cols-[40px_1fr] gap-8 pb-16">
                  <div className="relative flex justify-center">
                    <span
                      className="relative z-10 mt-1 h-7 w-7 rounded-full border-[6px] border-espresso"
                      style={{ backgroundColor: item.accent }}
                    />
                    {index !== experiences.length - 1 && (
                      <span
                        className="absolute top-8 h-full w-px"
                        style={{ backgroundColor: item.accent }}
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className="font-mono text-sm font-bold uppercase tracking-[0.14em]"
                      style={{ color: item.accent }}
                    >
                      {item.period}
                    </p>
                    <h3 className="mt-5 text-[clamp(2rem,3.2vw,3.7rem)] font-black leading-none tracking-[-0.07em]">
                      {item.company}
                    </h3>
                    <p className="mt-3 text-lg font-bold text-bone/55">{item.role}</p>
                    <p className="mt-6 max-w-4xl text-xl font-semibold leading-8 text-bone/70">
                      {item.body}
                    </p>
                    <p className="mt-5 font-mono text-xs uppercase tracking-[0.3em] text-sand/60">
                      {item.label}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="lg:pt-52">
            <div className="mb-8 flex items-center gap-5">
              <p className="font-mono text-xs uppercase tracking-[0.36em] text-bone/35">Milestones</p>
              <div className="h-px flex-1 bg-bone/10" />
            </div>
            <p className="max-w-lg text-xl font-bold leading-8 text-bone/50">
              A practical path through publishing, support, remote work, and automation.
            </p>
            <div className="mt-10 divide-y divide-bone/10 border-y border-bone/10">
              {communities.map((item) => (
                <article key={item.name} className="grid grid-cols-[72px_1fr] gap-5 py-8">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-bone/[0.05] font-mono text-xs font-black text-sand">
                    {item.date}
                  </div>
                  <div>
                    <h3 className="text-xl font-black tracking-[-0.04em]">{item.name}</h3>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.24em] text-taupe">
                      {item.role}
                    </p>
                    <p className="mt-4 text-base font-semibold leading-7 text-bone/55">{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Experience;
