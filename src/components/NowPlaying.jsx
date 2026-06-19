import React from 'react';
import { Disc3, Heart } from 'lucide-react';

function NowPlaying({ variant = 'default' }) {
  const waveform = [
    16, 24, 18, 36, 42, 28, 52, 34, 22, 48, 58, 38,
    30, 54, 44, 26, 36, 62, 40, 24, 32, 50, 28, 18
  ];
  const isOverlay = variant === 'overlay';

  return (
    <div className={`${isOverlay ? 'border border-steel/18 bg-espresso/68 shadow-editorial backdrop-blur-2xl' : 'glass-panel'} rounded-[1.75rem] p-4 transition duration-300 hover:-translate-y-1 hover:border-steel/30 sm:p-5`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-bone text-espresso shadow-[0_12px_34px_rgba(0,0,0,0.26)]">
            <Disc3 size={20} className="animate-spin [animation-duration:5s]" />
          </span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-sand/75">Now Playing</p>
            <p className="mt-1 text-sm font-bold text-bone">Visions of Gideon</p>
            <p className="text-xs text-steel/60">Sufjan Stevens</p>
          </div>
        </div>
        <button className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-steel/15 text-steel transition hover:bg-bone/10" aria-label="Favorite track">
          <Heart size={17} />
        </button>
      </div>
      <div className="mt-6 rounded-2xl bg-espresso/55 px-4 py-4">
        <div className="flex h-16 items-center gap-1.5">
          {waveform.map((height, index) => (
            <span
              key={`${height}-${index}`}
              className="wave-bar w-full rounded-full bg-gradient-to-t from-tobacco via-sand to-steel"
              style={{
                height: `${height}px`,
                animationDelay: `${index * 0.055}s`
              }}
            />
          ))}
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-bone/10">
          <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-sand to-steel" />
        </div>
      </div>
    </div>
  );
}

export default NowPlaying;
