import { useState, useEffect } from 'react';

const randomChars = 'X01$!@#%?&';

function useScrambleText(originalText, trigger) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (!originalText || !trigger) {
      setDisplayText(originalText || '');
      return;
    }

    let iterations = 0;
    let intervalId;

    intervalId = setInterval(() => {
      const scrambled = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iterations) return originalText[index];
          return randomChars[Math.floor(Math.random() * randomChars.length)];
        })
        .join('');

      setDisplayText(scrambled);
      iterations += 1 / 4;

      if (iterations >= originalText.length) {
        setDisplayText(originalText);
        clearInterval(intervalId);
      }
    }, 40);

    return () => clearInterval(intervalId);
  }, [originalText, trigger]); // re-runs when trigger changes

  return displayText;
}

export default useScrambleText;