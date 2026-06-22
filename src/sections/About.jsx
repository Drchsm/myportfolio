import React from 'react';
import { GraduationCap, Star, MapPin, Trophy, Layout, Smartphone } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';

const experiences = [
  {
    role: 'Digital Content Editor I',
    company: 'Reed Elsevier Philippines',
    type: 'Full-time',
    description:
      'I ensured accuracy, formatting, and quality of digital publishing content before release. I handled content tagging, metadata management, and QA checks while collaborating with cross-functional teams to keep editorial workflows consistent.',
  },
  {
    role: 'Customer Service & Technical Support',
    company: 'TaskUs',
    type: 'Full-time',
    description:
      'I diagnosed and resolved customer technical issues using remote desktop tools and knowledge base resources, consistently exceeding performance metrics across handle time, customer satisfaction, and first-call resolution.',
  },
  {
    role: 'Shopify Virtual Assistant',
    company: 'Remote / Freelance',
    type: 'Remote',
    description:
      'I managed end-to-end store operations — product uploads, pricing, inventory, and SEO optimization across titles, meta descriptions, and tags — while handling customer support via email and chat.',
  },
  {
    role: 'Administrative Support',
    company: 'Remote / Freelance',
    type: 'Remote',
    description:
      'I handled email management, calendar scheduling, and task tracking, and produced professional reports, presentations, and marketing materials using Microsoft Office and Canva.',
  },
  {
    role: 'SEO Virtual Assistant',
    company: 'Remote / Freelance',
    type: 'Remote',
    description:
      'I optimized on-page and off-page SEO — meta titles, descriptions, headings, and internal linking — and produced blog content to increase organic traffic and audience engagement.',
  },
   {
    role: 'Workflow Automation Specialist',
    company: 'Remote / Freelance',
    type: 'Remote',
    description:
      'I designed and implemented n8n automated workflows to streamline operations, reduce manual tasks, and improve overall efficiency across various business processes.',
  },
];

const marqueeItems = [
  'Digital Publishing',
  'SEO Optimization',
  'Shopify Operations',
  'Technical Support',
  'Admin & Scheduling',
  'Workflow Automation',
];

function About() {
  return (
    <section id="about" className="editorial-shell py-20 sm:py-28" data-reveal>

      {/* ── Header ── */}
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <SectionHeading
          kicker="Background"
          title="Five years across content, support, and remote operations."
          body="My work has moved between digital publishing, e-commerce, and administrative support — each role adding a sharper understanding of how clear systems reduce friction for the people depending on them."
        />

        {/* Education card */}
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-5">

            {/* Degree & University */}
            <div>
              <div className="flex items-center gap-3">
                <GraduationCap className="shrink-0 text-steel" size={22} />
                <p className="font-display text-xl font-black uppercase tracking-wide text-bone">
                  BS Information Technology
                </p>
              </div>
              <p className="mt-1 pl-[34px] text-sm font-semibold tracking-wide text-sand/80">
                Polytechnic University of the Philippines – Manila (2020–2024)
              </p>
            </div>

            {/* Honors */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pl-[34px]">
              <div className="flex items-center gap-2">
                <Star className="shrink-0 text-steel" size={16} />
                <span className="text-xs font-black uppercase tracking-[0.15em] text-sand/70">
                  Dean's List
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="shrink-0 text-steel" size={16} />
                <span className="text-xs font-black uppercase tracking-[0.15em] text-sand/70">
                  President's List
                </span>
              </div>
            </div>

            {/* Divider Line */}
            <div className="ml-[34px] border-t border-steel/10 my-1"></div>

            {/* Capstone Project */}
            <div className="pl-[34px]">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-steel">
                Capstone Project Lead
              </p>
              <div className="mt-2 flex items-center gap-2 text-sm text-bone font-bold uppercase tracking-wider">
                <Layout size={16} className="text-sand/50" />
                <span>UI/UX</span>
                <span className="text-sand/40">•</span>
                <Smartphone size={16} className="text-sand/50" />
                <span>Mobile App Development</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Section label ── */}
      <div className="mt-16 mb-8 flex items-center gap-4">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-sand/40">
          Work Experience
        </p>
        <div className="h-px flex-1 bg-steel/10" />
      </div>

      {/* ── Timeline ── */}
      <div className="flex flex-col">
        {experiences.map(({ role, company, type, description }, index) => (
          <div
            key={role}
            className="grid grid-cols-[120px_1fr] gap-x-8 sm:grid-cols-[140px_1fr]"
          >
            {/* Left: company + type */}
            <div className="pb-10 pt-0.5 text-right">
              <p className="text-sm font-black uppercase tracking-[0.1em] text-steel/80 leading-snug">
                {company}
              </p>
              <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-sand/35">
                {type}
              </p>
            </div>

            {/* Right: timeline line + content */}
            <div
              className={`relative border-l border-steel/15 pl-8 pb-10 ${index === experiences.length - 1 ? 'pb-0' : ''
                }`}
            >
              {/* dot */}
              <span className="absolute -left-[3px] top-[5px] block h-1.5 w-1.5 rounded-full bg-steel/60" />

              <p className="font-display text-sm font-black uppercase tracking-[0.14em] text-bone leading-snug">
                {role}
              </p>
              <p className="mt-4 text-sm leading-7 text-sand/70">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Marquee ── */}
      <div className="relative mt-12 overflow-hidden rounded-[1.75rem] border border-steel/12 bg-bone/[0.045] py-4">
        {/* fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0a0c10] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0a0c10] to-transparent" />

        <div className="flex w-[200%] animate-marquee gap-0 text-xs font-black uppercase tracking-[0.34em] text-sand/55">
          {Array.from({ length: 2 }).map((_, group) => (
            <div key={group} className="flex min-w-[50%] flex-1 justify-around">
              {marqueeItems.map((item) => (
                <span key={item} className="whitespace-nowrap px-6">
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
