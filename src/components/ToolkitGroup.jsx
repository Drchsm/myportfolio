import React from 'react';

function ToolkitGroup({ icon: Icon, title, tools }) {
  return (
    <div className="rounded-3xl border border-steel/12 bg-espresso/45 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-taupe text-steel">
          <Icon size={19} />
        </span>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-bone">{title}</h3>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <span
            key={tool}
            className="rounded-full border border-steel/12 bg-bone/[0.055] px-3 py-2 text-xs font-bold text-sand transition hover:border-steel/30 hover:text-bone"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ToolkitGroup;
