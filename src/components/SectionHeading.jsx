import React from 'react';

function SectionHeading({ kicker, title, body }) {
  return (
    <div className="max-w-3xl">
      <p className="section-kicker">{kicker}</p>
      <h2 className="mt-4 font-display text-4xl font-black uppercase leading-[0.9] tracking-normal text-bone sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {body && <p className="mt-5 max-w-2xl text-base leading-7 text-sand/80 sm:text-lg">{body}</p>}
    </div>
  );
}

export default SectionHeading;
