import { useState, useEffect } from 'react';

// Define the characters to use for the scramble effect
const randomChars = '!@#$%^&*()_+{}|:"<>?[];\',./';

function useScrambleText(originalText) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    // If originalText is null or undefined, don't run the animation
    if (!originalText) return;

    let currentIndex = 0;
    setDisplayText(''); // Reset display text when originalText changes

    const intervalId = setInterval(() => {
      // Build the scrambled string
      let scrambledString = '';

      for (let i = 0; i < originalText.length; i++) {
        if (i < currentIndex) {
          // Characters before the current index are 'correct'
          scrambledString += originalText[i];
        } else if (i === currentIndex) {
          // The current character is 'solving'—show a random character
          // or you could just show the correct character for a typing effect
          const randomCharIndex = Math.floor(Math.random() * randomChars.length);
          scrambledString += randomChars[randomCharIndex];
        } else {
          // Characters after the current index are 'hidden' or can be space
          scrambledString += ' ';
        }
      }

      setDisplayText(scrambledString);
      currentIndex++;

      // Stop the interval when we've 'solved' all characters
      if (currentIndex > originalText.length) {
        clearInterval(intervalId);
      }
    }, 150); // Set the speed of the animation (ms)

    // Cleanup function to clear the interval if the component unmounts
    return () => clearInterval(intervalId);
  }, [originalText]);

  return displayText;
}

export default useScrambleText;