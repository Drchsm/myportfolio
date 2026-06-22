import React from 'react';
import useScrambleText from './useScrambleText'; // Import the new hook

function SectionHeading({ kicker, title, body }) {
  // Define the part of the title that should have the scramble effect
  const wordsToScramble = "Five years";
  
  // Use our custom hook to get the animated display text
  const scrambledWords = useScrambleText(wordsToScramble);

  // Split the rest of the title
  // Assuming the original title always starts with "Five years"
  // and we need to capture everything after it.
  const restOfTitle = title ? title.replace(new RegExp(`^${wordsToScramble}`, 'i'), '') : '';

  return (
    <div className="max-w-3xl">
      <p className="section-kicker">{kicker}</p>
      {/* We keep your styling classes, but make the container flex for the layout */}
      <h2 className="mt-4 font-display text-3xl font-black uppercase leading-[1.05] tracking-normal text-bone sm:text-3xl lg:text-4xl">
        <span className="flex flex-col sm:flex-row sm:items-baseline gap-x-3">
          {/* Apply the color class specifically to the scrambled part */}
          <span className="text-steel whitespace-nowrap">{scrambledWords}</span>
          
          {/* Display the rest of the title with the correct color */}
          <span className="text-bone">{restOfTitle}</span>
        </span>
      </h2>
      {body && <p className="mt-5 max-w-2xl text-base leading-7 text-sand/80 sm:text-lg">{body}</p>}
    </div>
  );
}

export default SectionHeading;