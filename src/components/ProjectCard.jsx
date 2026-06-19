import React from 'react';
import { ArrowUpRight } from 'lucide-react';

function ProjectCard({ project, onOpen, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      className={`focus-ring group relative overflow-hidden rounded-[2rem] border border-steel/12 bg-bone/[0.055] p-0 text-left shadow-editorial transition duration-300 hover:-translate-y-1 hover:border-steel/30 ${className}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-[0.82] transition duration-500 group-hover:scale-105`} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(30,22,19,0.82))]" />
      <div className="relative flex h-full min-h-[320px] flex-col justify-between p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full border border-steel/20 bg-espresso/45 px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-steel backdrop-blur">
            {project.category}
          </span>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-bone text-espresso transition group-hover:rotate-12">
            <ArrowUpRight size={19} />
          </span>
        </div>
        <div>
          <p className="text-sm font-bold text-steel/70">{project.metric}</p>
          <h3 className="mt-3 font-display text-3xl font-black uppercase leading-[0.92] text-bone sm:text-4xl">{project.title}</h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-sand/82">{project.summary}</p>
        </div>
      </div>
    </button>
  );
}

export default ProjectCard;
