import React from 'react';
import { CLIENT_LOGOS } from '../data/initialProjects';

/**
 * Slim, always-scrolling band of client names placed high on the page as
 * immediate social proof (the fuller list still lives in the About section).
 */
export const ClientStrip: React.FC = () => {
  // Duplicate the list so the marquee can loop seamlessly (-50% keyframe).
  const items = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="w-full border-y border-zinc-900 bg-[#08080a] py-8">
      <p className="mb-6 text-center text-[10px] uppercase tracking-[0.35em] text-zinc-500">
        Selected Clients
      </p>
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-14 whitespace-nowrap">
          {items.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-cinzel text-lg tracking-[0.12em] text-zinc-400 sm:text-xl"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
