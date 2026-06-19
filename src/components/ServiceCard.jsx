import React from 'react';

function ServiceCard({ icon: Icon, title, body, index }) {
  return (
    <article className="group glass-panel rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-steel/30 sm:p-7">
      <div className="flex items-start justify-between gap-5">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-bone text-espresso transition duration-300 group-hover:rotate-3 group-hover:scale-105">
          <Icon size={22} />
        </span>
        <span className="font-display text-5xl font-black leading-none text-bone/10">0{index}</span>
      </div>
      <h3 className="mt-8 text-xl font-black uppercase tracking-normal text-bone">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-sand/78">{body}</p>
    </article>
  );
}

export default ServiceCard;
