import React from 'react';
import { Clock3, Cpu, TrendingUp } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';

const metrics = [
  { icon: Clock3, label: 'Hours Saved', value: '1000+' },
  { icon: Cpu, label: 'Workflows Built', value: '50+' },
  { icon: TrendingUp, label: 'Efficiency Increase', value: '40%' }
];

function About() {
  return (
    <section id="about" className="editorial-shell py-20 sm:py-28" data-reveal>
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <SectionHeading
          kicker="Philosophy"
          title="Operational calm, powered by useful AI."
          body="The work is not about adding tools for their own sake. It is about creating rhythm: clearer queues, faster decisions, fewer repeated explanations, and systems that make people feel less buried."
        />
        <div className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <p className="text-lg leading-8 text-sand/85">
            Hendrich Capalaran works where executive assistance, operations, and automation overlap. His approach starts with the human friction: what keeps getting repeated, delayed, missed, copied, checked, chased, or rewritten. From there, he builds practical workflows using the team&apos;s existing stack, then layers AI where it improves speed, clarity, and consistency.
          </p>
          <p className="mt-6 text-lg leading-8 text-steel/76">
            The result is a portfolio posture built for high-trust support: steady communication, polished documentation, and automations that serve the operation instead of becoming another thing to manage.
          </p>
        </div>
      </div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {metrics.map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass-panel rounded-[1.75rem] p-6 transition duration-300 hover:-translate-y-1 hover:border-steel/30">
            <Icon className="text-steel" size={24} />
            <p className="mt-8 font-display text-5xl font-black uppercase leading-none text-bone">{value}</p>
            <p className="mt-3 text-xs font-black uppercase tracking-[0.24em] text-sand/75">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-steel/12 bg-bone/[0.045] py-4">
        <div className="flex w-[200%] animate-marquee gap-8 text-xs font-black uppercase tracking-[0.34em] text-sand/65">
          {Array.from({ length: 2 }).map((_, group) => (
            <div key={group} className="flex min-w-[50%] flex-1 justify-around gap-8">
              <span>Systems</span>
              <span>Inbox</span>
              <span>Automation</span>
              <span>Commerce</span>
              <span>Execution</span>
              <span>Clarity</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
