import React, { useRef, useState, useEffect } from 'react';
import { ArrowDown, CalendarCheck, MapPin, Sparkles, CircleUserRound } from 'lucide-react';
import NowPlaying from '../components/NowPlaying.jsx';
import { images } from '../../PhotosForPortfolio';
import useTypingLoop from '../components/useTypingLoop';
import useScrambleText from '../components/useScrambleText';

const PHRASES = [
  'AI Automations',
  'Remote Operations',
  'Virtual Assistance',
];

function useScrollScramble(text, threshold = 0.2) {
  const ref = useRef(null);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(false);
          requestAnimationFrame(() => setTriggered(true));
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [text]);

  const scrambled = useScrambleText(text, triggered);
  return { ref, scrambled };
}

function Hero() {
  const typedText = useTypingLoop(PHRASES);
  const { ref: statRef, scrambled: scrambledStat } = useScrollScramble('15+');

  return (
    <section id="top" className="editorial-shell pb-14 pt-24 sm:pt-28 lg:min-h-[calc(100vh-32px)] lg:pb-12">
      <div className="grid gap-5 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
        <div className="grid gap-5">
          <div className="glass-panel animate-floatIn rounded-[2rem] p-6 sm:p-7 lg:p-8" data-reveal>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-steel/15 bg-bone/[0.055] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-steel">
                <MapPin size={14} /> Philippines / Remote
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-steel/15 bg-bone/[0.055] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-sand">
                <Sparkles size={14} /> AI Ops Portfolio
              </span>
            </div>

            <p className="mt-9 text-md font-semibold tracking-[0.18em] text-sand/95 flex items-center gap-2">
              <CircleUserRound size={20} className="shrink-0" />
              <span>Hendrich Capalaran</span>
            </p>

            {/* ── Headline with typing loop ── */}
            <h1 className="mt-5 headline max-w-4xl font-black uppercase leading-none text-bone">
              <span className="flex flex-col gap-1">
                {/* Typing line */}
                <span className="font-mono text-amber-200 flex items-baseline gap-[2px]">
                  {typedText}
                  {/* Blinking cursor */}
                  <span className="inline-block w-[3px] h-[0.85em] bg-amber-200 ml-1 animate-blink align-middle" />
                </span>
              </span>
            </h1>

            <p className="mt-6 text-sm font-black uppercase leading-7 text-sand/85 sm:text-lg text-justify">
              I help founders and teams turn scattered work into clear workflows, lighter admin, and dependable day-to-day execution.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#work" className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-bone px-6 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-espresso transition hover:-translate-y-0.5 hover:bg-steel">
                View Work <ArrowDown size={16} />
              </a>
              <a href="#contact" className="focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-steel/20 px-6 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-bone transition hover:-translate-y-0.5 hover:bg-bone/10">
                Book Ops Audit <CalendarCheck size={16} />
              </a>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-[0.82fr_1.18fr]" data-reveal>
            <div className="glass-panel rounded-[1.75rem] p-6">
              <p className="section-kicker">Automation Deployed</p>
              <p ref={statRef} className="mt-4 text-4xl font-black uppercase leading-none text-amber-200">
                {scrambledStat}
              </p>
              <p className="mt-2 text-sm font-black uppercase leading-7 text-sand/90">
                Growing Workflow Automation Specialist with production-grade deployments.
              </p>
            </div>
            <div className="glass-panel rounded-[1.75rem] p-6">
              <p className="section-kicker">Focus</p>
              <p className="mt-4 text-lg font-black uppercase leading-7 text-bone text-justify">
                Automated workflows that bring precision to your operations, ensuring your team spends less time on admin and more time on high-leverage growth.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:max-w-[440px] lg:justify-self-end">
          <div className="portrait-grain relative min-h-[440px] overflow-hidden rounded-[2.15rem] border border-steel/15 shadow-lens sm:min-h-[520px] lg:min-h-[560px]" data-reveal>
            <img
              src={images.MyPhoto}
              alt="Hendrich Portrait"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
              <NowPlaying variant="overlay" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3" data-reveal>
            {['Automate', 'Operate', 'Assist'].map((word) => (
              <div key={word} className="rounded-2xl border border-steel/12 bg-bone/[0.05] px-4 py-5 text-center text-xs font-black uppercase tracking-[0.2em] text-sands/90">
                {word}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;