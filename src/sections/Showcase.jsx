import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import ProjectModal from '../components/ProjectModal.jsx';

const projects = [
  {
    title: 'Project Alpha: 10x Lead Gen Automation Pipeline',
    category: 'Automation',
    metric: 'CRM enrichment + instant routing',
    summary: 'A mock pipeline that captures leads, scores intent, drafts follow-ups, and alerts the right owner inside Slack.',
    details: 'This placeholder case study represents a lead generation engine that connects forms, enrichment, AI summaries, CRM updates, and executive visibility. The focus is speed without losing context.',
    outcomes: ['10x faster triage', 'Cleaner CRM fields', 'Daily owner digest'],
    gradient: 'from-tobacco via-taupe to-espresso'
  },
  {
    title: 'Project Beta: E-commerce Operations Scaling',
    category: 'Commerce',
    metric: 'Store ops + support workflows',
    summary: 'A compact operating layer for Shopify, Amazon Seller Central, Stripe checks, and customer issue follow-through.',
    details: 'This placeholder maps how a commerce operator can keep product updates, refund checks, marketplace tasks, and support escalations in one controlled daily rhythm.',
    outcomes: ['Fewer status gaps', 'Faster refund review', 'Reusable SOP rhythm'],
    gradient: 'from-[#59473C] via-[#8A7465] to-[#1E1613]'
  },
  {
    title: 'Project Gamma: Executive Focus Desk',
    category: 'EA Systems',
    metric: 'Inbox + calendar command center',
    summary: 'A Notion-backed assistant hub for priorities, meeting notes, research briefs, and follow-up ownership.',
    details: 'This concept creates a calm executive assistant workspace that turns incoming requests into categorized next actions, meeting prep, and weekly review material.',
    outcomes: ['Protected focus time', 'Clearer follow-ups', 'One source of truth'],
    gradient: 'from-[#364044] via-[#6E6258] to-[#201816]'
  },
  {
    title: 'Project Delta: AI Knowledge Ops Library',
    category: 'Knowledge',
    metric: 'SOPs + reusable prompts',
    summary: 'A lightweight knowledge base with SOP cards, AI prompt templates, QA checklists, and workflow health notes.',
    details: 'This placeholder details a system where SOPs, prompt packs, and process checklists stay easy to reuse, audit, and improve as the business changes.',
    outcomes: ['Reusable templates', 'Lower onboarding drag', 'Better QA loops'],
    gradient: 'from-[#2F2926] via-[#77685E] to-[#C2B2A2]'
  }
];

function Showcase() {
  const [activeProject, setActiveProject] = useState(null);

  return (
    <section id="work" className="editorial-shell py-20 sm:py-28" data-reveal>
      <SectionHeading
        kicker="Selected Placeholders"
        title="Case studies shaped like real operational problems."
        body="These are polished starter cards for future client work, designed to demonstrate how Hendrich thinks about outcomes, systems, and implementation details."
      />
      <div className="mt-12 grid auto-rows-[minmax(300px,auto)] gap-5 lg:grid-cols-6">
        <ProjectCard project={projects[0]} onOpen={setActiveProject} className="lg:col-span-4 lg:row-span-2" />
        <ProjectCard project={projects[1]} onOpen={setActiveProject} className="lg:col-span-2" />
        <ProjectCard project={projects[2]} onOpen={setActiveProject} className="lg:col-span-2" />
        <ProjectCard project={projects[3]} onOpen={setActiveProject} className="lg:col-span-6" />
      </div>
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}

export default Showcase;
