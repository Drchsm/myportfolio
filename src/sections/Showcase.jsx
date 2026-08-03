import React from 'react';
import { ArrowUpRight, LockKeyhole } from 'lucide-react';
import { images } from '../../PhotosForPortfolio';
import PixelRevealImage from '../components/PixelRevealImage.jsx';
import SectionIndex from '../components/SectionIndex.jsx';

const projects = [
  {
    number: 'P.01',
    title: 'Lead Routing OS',
    category: 'Client / AI / CRM',
    type: 'Automation command center',
    year: '2026',
    summary: 'A lead intake system that captures form data, enriches records, drafts follow-up, and routes the next action to the right owner.',
    stack: ['n8n', 'Airtable', 'Slack', 'OpenAI'],
    image: images.MyPhoto
  },
  {
    number: 'P.02',
    title: 'Shopify Ops Desk',
    category: 'Client / Commerce / Support',
    type: 'Store operations workspace',
    year: '2025',
    summary: 'A back-office rhythm for product updates, refund review, customer issues, and marketplace task tracking.',
    stack: ['Shopify', 'Sheets', 'Zapier', 'Notion'],
    image: images.MyPhoto
  },
  {
    number: 'P.03',
    title: 'Knowledge Workflow',
    category: 'Archive / SOP / AI',
    type: 'Reusable prompt and SOP library',
    year: '2025',
    summary: 'A lightweight knowledge base that keeps SOPs, AI templates, QA checklists, and recurring reports easy to reuse.',
    stack: ['Notion', 'Claude', 'Drive', 'Make'],
    image: null
  }
];

function Showcase() {
  return (
    <section id="work" className="bg-umber py-20 text-bone sm:py-28" data-reveal>
      <div className="editorial-shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.72fr] lg:items-start">
          <div>
            <SectionIndex id="work" />
            <h2 className="mt-12 max-w-4xl text-[clamp(3rem,5.5vw,5.7rem)] font-black leading-[0.9] tracking-[-0.07em]">
              Some of my latest work
            </h2>
          </div>
          <p className="max-w-xl justify-self-end pt-20 text-right text-sm font-semibold leading-6 text-bone/40">
            Some work is shown in limited detail to respect client confidentiality and data privacy. These cards focus on systems thinking, workflow shape, and operational outcomes.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.title} className="group border-b border-bone/12 pb-8">
              {project.image ? (
                <PixelRevealImage
                  src={project.image}
                  alt=""
                  cols={8}
                  rows={8}
                  className="h-64 border border-bone/10 bg-bone/[0.025]"
                  imgClassName="opacity-70"
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(27,32,39,0.86))]" />
                </PixelRevealImage>
              ) : (
                <div className="relative h-64 overflow-hidden border border-bone/10 bg-bone/[0.025]">
                  <div className="grid h-full place-items-center border border-dashed border-bone/10">
                    <span className="grid h-16 w-16 place-items-center rounded-full border border-bone/20 text-bone/45">
                      <ArrowUpRight size={22} />
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-bone/45">
                    <span className="text-sand">{project.number}</span> {project.category}
                  </p>
                  <h3 className="mt-3 text-3xl font-black tracking-[-0.055em]">{project.title}</h3>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-bone/20 text-bone/55 transition group-hover:border-sand group-hover:text-sand">
                  <LockKeyhole size={17} />
                </span>
              </div>

              <dl className="mt-6 divide-y divide-bone/10 border-y border-bone/10 text-sm">
                <div className="grid grid-cols-[90px_1fr] gap-4 py-3">
                  <dt className="font-mono text-xs uppercase tracking-[0.28em] text-bone/45">Type</dt>
                  <dd className="text-right font-bold text-bone/70">{project.type}</dd>
                </div>
                <div className="grid grid-cols-[90px_1fr] gap-4 py-3">
                  <dt className="font-mono text-xs uppercase tracking-[0.28em] text-bone/45">Stack</dt>
                  <dd className="flex flex-wrap justify-end gap-2">
                    {project.stack.map((item) => (
                      <span key={item} className="rounded-full border border-bone/10 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-sand/70">{item}</span>
                    ))}
                  </dd>
                </div>
                <div className="grid grid-cols-[90px_1fr] gap-4 py-3">
                  <dt className="font-mono text-xs uppercase tracking-[0.28em] text-bone/45">Year</dt>
                  <dd className="text-right font-bold text-bone/70">/ {project.year}</dd>
                </div>
              </dl>

              <p className="mt-5 text-sm font-medium leading-6 text-bone/60">{project.summary}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Showcase;
