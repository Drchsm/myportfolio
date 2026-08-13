import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, LockKeyhole } from 'lucide-react';
import techIcons from '../data/techIcons.js';
import SectionIndex from '../components/SectionIndex.jsx';

const projects = [
  {
    number: 'P.01',
    title: 'AI Lead Routing Workflow',
    category: 'Client / AI / CRM',
    type: 'AI automation workflow',
    year: '2026',
    summary: 'A lead intake system that captures form data, enriches records, drafts follow-up, and routes the next action to the right owner.',
    stack: ['n8n', 'Slack', 'HubSpot', 'Claude'],
    image: '/N8N0.1.png',
    link: '/case-studies/lead-routing-os.html'
  },
  {
    number: 'P.02',
    title: 'AI Meeting Ops Assistant',
    category: 'Personal / AI / Automation',
    type: 'Meeting automation pipeline',
    year: '2026',
    summary: 'A folder-watching Python pipeline that summarizes meeting transcripts with Claude, extracts action items into a JSON contract, files a task per item in Asana or Notion, and drafts a Slack follow-up — reviewed, not retyped.',
    stack: ['Python', 'Claude', 'Asana', 'Notion', 'Slack', 'SQLite', 'FastAPI'],
    image: '/meetingopslanding.png',
    link: '/case-studies/ai-meeting-assistant-site/ai-meeting-ops-html.html'
  },
  {
    number: 'P.03',
    title: 'AI Engineering Flashcards',
    category: 'Personal / AI / Education',
    type: 'Engaging way to learn AI engineering',
    year: '2026',
    summary: 'A spaced-repetition flashcard app that turns a full AI engineering curriculum — Python to LLMs to cloud certs — into ~106 cards across 7 modules, scheduled by an SM-2-style algorithm so review time goes to what you\'re about to forget, not what you already know.',
    stack: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    image: '/flashcardsgame.png',
    link: 'https://github.com/Drchsm/flashcardToAIEngineering'
  },
  {
    number: 'P.04',
    title: 'Coming Soon',
    category: 'Upcoming / Case Study',
    type: 'TBA',
    year: 'TBA',
    summary: 'A new case study is in the works — check back soon.',
    stack: ['TBA'],
    image: null,
    link: null
  },
  {
    number: 'P.05',
    title: 'Coming Soon',
    category: 'Upcoming / Case Study',
    type: 'TBA',
    year: 'TBA',
    summary: 'A new case study is in the works — check back soon.',
    stack: ['TBA'],
    image: null,
    link: null
  },
  {
    number: 'P.06',
    title: 'Coming Soon',
    category: 'Upcoming / Case Study',
    type: 'TBA',
    year: 'TBA',
    summary: 'A new case study is in the works — check back soon.',
    stack: ['TBA'],
    image: null,
    link: null
  }
];

function StackIcon({ name }) {
  const icon = techIcons.find((t) => t.name.toLowerCase() === name.toLowerCase());
  if (!icon) return null;
  return icon.monogram ? (
    <span className="grid h-4 w-4 place-items-center border border-current font-mono text-[7px] font-bold text-sand/80">
      {icon.monogram}
    </span>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" style={{ fill: icon.hex }} role="img" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

function Showcase() {
  const scrollRef = useRef(null);

  const scrollByCard = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const amount = (card?.getBoundingClientRect().width ?? 0) + 32; // 32px = gap-8
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };
  const goPrev = () => scrollByCard(-1);
  const goNext = () => scrollByCard(1);

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
          <div className="justify-self-end pt-20">
            <p className="max-w-xl text-right text-sm font-semibold leading-6 text-bone/40">
              Some work is shown in limited detail to respect client confidentiality and data privacy. These cards focus on systems thinking, workflow shape, and operational outcomes.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={goPrev}
                aria-label="Previous projects"
                className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-bone/20 text-bone/55 transition hover:border-sand hover:text-sand"
              >
                <ArrowLeft size={17} />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Next projects"
                className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-bone/20 text-bone/55 transition hover:border-sand hover:text-sand"
              >
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((project) => {
            const Wrapper = project.link ? 'a' : 'article';
            const wrapperProps = project.link
              ? { href: project.link, target: '_blank', rel: 'noreferrer' }
              : {};
            return (
            <Wrapper
              key={project.number}
              {...wrapperProps}
              className="group block shrink-0 basis-full snap-start border-b border-bone/12 pb-8 sm:basis-1/2 lg:basis-1/3"
            >
              {project.image ? (
                <div className="relative h-64 overflow-hidden border border-bone/10 bg-bone/[0.025]">
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover opacity-80 transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(27,32,39,0.86))]" />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: 'radial-gradient(ellipse at center, transparent 40%, rgb(var(--sand) / 0.55) 100%)',
                      mixBlendMode: 'soft-light'
                    }}
                  />
                </div>
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
                <span className="group/arrow relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-bone/20 text-bone/55 transition group-hover:border-sand group-hover:text-sand">
                  {project.link ? <ArrowUpRight size={17} /> : <LockKeyhole size={17} />}
                  {project.link && (
                    <span className="pointer-events-none absolute -top-9 right-0 whitespace-nowrap rounded-full border border-bone/15 bg-umber px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-sand opacity-0 transition-all duration-300 group-hover/arrow:opacity-100 group-hover/arrow:-translate-y-1">
                      Visit link
                    </span>
                  )}
                </span>
              </div>

              <dl className="mt-6 divide-y divide-bone/10 border-y border-bone/10 text-sm">
                <div className="grid grid-cols-[90px_1fr] gap-4 py-3">
                  <dt className="font-mono text-xs uppercase tracking-[0.28em] text-bone/45">Type</dt>
                  <dd className="text-right font-bold text-bone/70">{project.type}</dd>
                </div>
                <div className="grid grid-cols-[90px_1fr] gap-4 py-3">
                  <dt className="font-mono text-xs uppercase tracking-[0.28em] text-bone/45">Stack</dt>
                  <dd className="flex flex-wrap items-center justify-end gap-2">
                    {project.stack.map((item) => (
                      <span key={item} className="flex items-center gap-1.5 rounded-full border border-bone/10 px-2 py-1">
                        <StackIcon name={item} />
                        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-sand/70">{item}</span>
                      </span>
                    ))}
                  </dd>
                </div>
                <div className="grid grid-cols-[90px_1fr] gap-4 py-3">
                  <dt className="font-mono text-xs uppercase tracking-[0.28em] text-bone/45">Year</dt>
                  <dd className="text-right font-bold text-bone/70">/ {project.year}</dd>
                </div>
              </dl>

              <p className="mt-5 text-sm font-medium leading-6 text-bone/60">{project.summary}</p>
            </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Showcase;
