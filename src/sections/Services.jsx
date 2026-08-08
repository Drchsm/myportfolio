import React from 'react';
import LogoMarquee from '../components/LogoMarquee.jsx';
import SectionIndex from '../components/SectionIndex.jsx';
import techIcons from '../data/techIcons.js';

const capabilities = [
  {
    code: 'E.01',
    title: 'Workflow automation',
    body: 'n8n, Zapier, Make, Airtable, and CRM flows that reduce manual handoffs.',
    stack: 'n8n . Zapier . Make . Airtable'
  },
  {
    code: 'E.02',
    title: 'AI operations',
    body: 'Prompted assistants, summaries, lead routing, and data cleanup for everyday teams.',
    stack: 'OpenAI . Gemini . Claude . Sheets'
  },
  {
    code: 'E.03',
    title: 'Frontend systems',
    body: 'Product-grade interfaces with crisp interaction, responsive layout, and clear states.',
    stack: 'React . Tailwind . Vite . Next.js'
  },
  {
    code: 'E.04',
    title: 'Remote support',
    body: 'Inbox, calendar, SOP, customer support, SEO, and documentation rhythms.',
    stack: 'Notion . Slack . Workspace . Asana'
  }
];

const learning = [
  { code: 'L.01', title: 'Website Development' },
  { code: 'L.02', title: 'AI Development' },
  { code: 'L.03', title: 'Cloud Computing' }
];

const HALF = Math.ceil(techIcons.length / 2);

function Services() {
  return (
    <section data-reveal>
      <div id="services" className="bg-paper py-20 text-paperInk sm:py-28">
        <div className="editorial-shell">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.72fr] lg:items-end">
            <div>
              <SectionIndex id="services" tone="light" />
              <h2 className="mt-12 text-[clamp(3.7rem,6vw,6.5rem)] font-black leading-[0.86] tracking-[-0.07em]">
                Expertise
              </h2>
            </div>
            <div className="text-center lg:text-right">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.36em] text-paperMute">
                Capabilities
              </p>
              <p className="mt-8 text-lg font-medium leading-7 text-paperMute">
                Four areas I work in deliberately: automation, AI inside workflows, the interfaces
                around them, and the operational reliability that holds it together.
              </p>
            </div>
          </div>

          <div className="mt-10 grid border border-paperLine md:grid-cols-2 xl:grid-cols-4">
            {capabilities.map((item) => (
              <article
                key={item.code}
                className="border-b border-paperLine p-7 last:border-b-0 md:border-r md:last:border-r-0 xl:border-b-0"
              >
                <p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-paperMute">
                  {item.code}
                </p>
                <h3 className="mt-7 text-2xl font-black tracking-[-0.045em]">{item.title}</h3>
                <p className="mt-4 min-h-[72px] text-base font-medium leading-7 text-paperMute">
                  {item.body}
                </p>
                <p className="mt-6 font-mono text-xs font-bold uppercase leading-6 tracking-[0.08em] text-paperInk/70">
                  {item.stack}
                </p>
              </article>
            ))}
          </div>

          {/* Sub-numbered continuation of Expertise (03.2) — indented, not a separate nav section. */}
          <div className="mt-10 border-l-2 border-paperLine pl-6 sm:pl-8">
            <div className="flex flex-wrap items-center gap-x-3">
              <SectionIndex number="03.2" label="In the Lab" tone="light" />
              <p className="font-black text-xs font-black uppercase tracking-[0.36em]">
                In the Lab
              </p>
            </div>
            <p className="mt-4 max-w-md text-sm font-medium leading-6 text-paperMute">
              Tracks I&rsquo;m currently building fluency and confidence in, to expand the range of problems I can solve for clients and teams.
            </p>
            <p className="mt-4 font-mono text-xs font-bold uppercase leading-6 tracking-[0.08em] text-paperInk/70">
              {learning.map((item) => `${item.code} ${item.title}`).join(' . ')}
            </p>
          </div>
        </div>
      </div>

      <div id="stack" className="bg-umber py-16 text-bone sm:py-20">
        <div className="editorial-shell">
          <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <SectionIndex id="stack" />
              <h3 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">
                Tools I reach for
              </h3>
            </div>
            <p className="max-w-md text-sm font-semibold leading-6 text-bone/40 lg:text-right">
              The automation, cloud, AI, frontend, data, design, and operations tools in my
              workflow. Hover to pause the row.
            </p>
          </div>
        </div>
        {/* Split so the two rows carry different tools rather than the same list twice. */}
        <LogoMarquee slice={[0, HALF]} />
        <LogoMarquee slice={[HALF, techIcons.length]} reverse />
      </div>
    </section>
  );
}

export default Services;
