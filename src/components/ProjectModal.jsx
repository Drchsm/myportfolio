import { X, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import React, { useEffect } from 'react';

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-espresso/80 p-4 backdrop-blur-xl" role="dialog" aria-modal="true">
      <button className="absolute inset-0 h-full w-full cursor-default" aria-label="Close modal backdrop" onClick={onClose} />
      <article className="glass-panel relative w-full max-w-3xl overflow-hidden rounded-[2rem]">
        <div className={`h-44 bg-gradient-to-br ${project.gradient}`} />
        <button
          type="button"
          aria-label="Close project details"
          onClick={onClose}
          className="focus-ring absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-steel/20 bg-espresso/70 text-bone backdrop-blur"
        >
          <X size={20} />
        </button>
        <div className="p-6 sm:p-8">
          <p className="section-kicker">{project.category}</p>
          <h3 className="mt-3 font-display text-3xl font-black uppercase leading-none text-bone sm:text-5xl">{project.title}</h3>
          <p className="mt-5 text-base leading-7 text-sand/82">{project.details}</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {project.outcomes.map((outcome) => (
              <div key={outcome} className="rounded-2xl border border-steel/12 bg-bone/[0.045] p-4">
                <CheckCircle2 className="text-steel" size={18} />
                <p className="mt-3 text-sm font-bold text-bone">{outcome}</p>
              </div>
            ))}
          </div>
          <button className="focus-ring mt-8 inline-flex items-center gap-2 rounded-full bg-bone px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-espresso transition hover:bg-steel">
            Mock Details <ArrowUpRight size={16} />
          </button>
        </div>
      </article>
    </div>
  );
}

export default ProjectModal;
