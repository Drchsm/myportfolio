import React, { useRef, useState, useEffect } from 'react';
import useScrambleText from './useScrambleText';

function SectionHeading({ kicker, title, body, scrambleWords }) {
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (!scrambleWords) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Reset then re-trigger so it replays each time it enters view
          setTriggered(false);
          requestAnimationFrame(() => setTriggered(true));
        }
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [scrambleWords]);

  const scrambledPart = useScrambleText(scrambleWords || '', triggered);

  return (
    <div ref={ref} className="max-w-3xl">
      <p className="section-kicker">{kicker}</p>

      <h2 className="mt-4 font-display text-3xl font-black uppercase leading-[1.15] tracking-normal text-bone sm:text-3xl lg:text-4xl">
        {scrambleWords ? (
          <span className="flex flex-col">
            <span className="font-mono text-4xl italic text-amber-200 sm:text-5xl lg:text-5xl">{scrambledPart}</span>
            <span>{title}</span>
          </span>
        ) : (
          title
        )}
      </h2>

      {body && (
        <p className="mt-5 max-w-2xl text-base leading-7 text-sand/80 sm:text-lg">
          {body}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;