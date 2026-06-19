import React from 'react';
import { Bot, BrainCircuit, BriefcaseBusiness, ClipboardCheck, Gauge, Headphones, Network, ShoppingBag } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import ToolkitGroup from '../components/ToolkitGroup.jsx';

const services = [
  {
    icon: Network,
    title: 'AI Workflow Automation',
    body: 'Designing n8n, Zapier, and Make systems that route leads, enrich records, summarize inboxes, and keep handoffs visible.'
  },
  {
    icon: BriefcaseBusiness,
    title: 'Executive Assistant',
    body: 'Calendar, inbox, research, documentation, and coordination support for leaders who need fewer dropped balls and clearer days.'
  },
  {
    icon: ShoppingBag,
    title: 'E-commerce Management',
    body: 'Operational support for storefront updates, order workflows, customer escalations, payment checks, and marketplace routines.'
  },
  {
    icon: Headphones,
    title: 'General Virtual Assistant',
    body: 'Reliable admin execution across recurring tasks, SOP maintenance, reports, data entry, and customer-facing support queues.'
  }
];

const toolkit = [
  { icon: Bot, title: 'Automation', tools: ['n8n', 'Zapier', 'Make'] },
  { icon: BrainCircuit, title: 'AI Engine', tools: ['Gemini', 'ChatGPT', 'Claude', 'Perplexity', 'Midjourney'] },
  { icon: ClipboardCheck, title: 'Operations & EA', tools: ['Notion', 'Slack', 'Google Workspace', 'Asana'] },
  { icon: Gauge, title: 'E-Commerce', tools: ['Shopify', 'Amazon Seller Central', 'Stripe'] }
];

function Services() {
  return (
    <section id="services" className="editorial-shell py-20 sm:py-28" data-reveal>
      <SectionHeading
        kicker="Core Offering"
        title="Systems-minded support for modern operations."
        body="Hendrich blends precise virtual assistance with practical automation, turning messy recurring work into visible, repeatable, and calmer systems."
      />
      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {services.map((service, index) => (
          <ServiceCard key={service.title} {...service} index={index + 1} />
        ))}
      </div>
      <div className="mt-16 glass-panel rounded-[2rem] p-5 sm:p-7 lg:p-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-kicker">Toolkit & Stack</p>
            <h3 className="mt-3 font-display text-3xl font-black uppercase leading-none text-bone sm:text-4xl">Practical tools, clean handoffs.</h3>
          </div>
          <p className="max-w-md text-sm leading-6 text-sand/75">Built around tools teams already trust, with AI added where it creates real speed and better decisions.</p>
        </div>
        <div className="mt-7 grid gap-4 lg:grid-cols-4">
          {toolkit.map((group) => (
            <ToolkitGroup key={group.title} {...group} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;
