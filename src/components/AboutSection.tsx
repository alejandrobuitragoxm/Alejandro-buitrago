import React from 'react';
import { Camera, Mail, CheckCircle2 } from 'lucide-react';
import { DIRECTOR_BIO, CLIENT_LOGOS } from '../data/initialProjects';
import bioPhoto from '../assets/alejandro-bio.jpg';

interface AboutSectionProps {
  onOpenContact: () => void;
  onOpenReel: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenContact, onOpenReel }) => {
  // Split the manifesto quote on its colon so the ":" can sit apart, pushed to the right
  const colonIndex = DIRECTOR_BIO.quote.indexOf(':');
  const quoteLead = colonIndex >= 0 ? DIRECTOR_BIO.quote.slice(0, colonIndex) : DIRECTOR_BIO.quote;
  const quoteTail = colonIndex >= 0 ? DIRECTOR_BIO.quote.slice(colonIndex + 1) : '';

  return (
    <section id="director" className="w-full py-20 bg-[#0a0a0e] border-t border-zinc-800/80 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Clients Ticker inspired by Omerta */}
        <div id="clientes" className="mb-20 pb-16 border-b border-zinc-800/80">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-mono-code uppercase text-zinc-500 tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              SELECTED CLIENTS & BRANDS
            </span>
            <span className="text-[11px] font-mono-code text-zinc-600">
              COMMERCIAL // DOCUMENTARY
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CLIENT_LOGOS.map((client, idx) => (
              <div
                key={idx}
                className="group h-20 rounded-sm bg-zinc-950 border border-zinc-800/80 hover:border-zinc-500 flex items-center justify-center p-4 transition-all duration-300"
              >
                <span className="font-syne font-bold text-sm sm:text-base tracking-widest text-zinc-400 group-hover:text-white transition-colors uppercase text-center">
                  {client}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Director Bio & Statement */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Portrait / Director Visual & Quick Contact */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-zinc-800 bg-black group">
              <img
                src={bioPhoto}
                alt="Alejandro Buitrago"
                className="w-full h-full object-cover object-[65%_center] grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-mono-code uppercase text-amber-400 tracking-widest">
                  DIRECTOR
                </span>
                <h3 className="font-syne font-extrabold text-2xl uppercase text-white">
                  {DIRECTOR_BIO.name}
                </h3>
                <p className="text-xs font-mono-code text-zinc-400 mt-0.5">
                  {DIRECTOR_BIO.location}
                </p>
              </div>
            </div>

            {/* Quick Contact Card */}
            <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-sm font-mono-code text-xs">
              <button
                onClick={onOpenContact}
                className="w-full py-2.5 rounded-sm bg-white hover:bg-zinc-200 text-black font-semibold uppercase text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>CHECK AVAILABILITY</span>
              </button>
            </div>
          </div>

          {/* Right Column: Statement, Awards & Gear Kit */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            {/* Manifest / Statement */}
            <div>
              <span className="text-xs font-mono-code uppercase text-amber-400 tracking-widest block mb-2">
                // MANIFESTO & VISION
              </span>
              <blockquote className="font-cinzel text-xl sm:text-2xl md:text-3xl text-zinc-100 italic leading-snug mb-6 w-fit max-w-full">
                <span className="flex items-baseline gap-4">
                  <span>{quoteLead}</span>
                  <span className="ml-auto not-italic text-amber-400">//</span>
                </span>
                <span className="block">{quoteTail}</span>
              </blockquote>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line">
                {DIRECTOR_BIO.bio}
              </p>
            </div>

            {/* Gear Kit / Technical Specs */}
            <div className="pt-6 border-t border-zinc-800/80">
              <h4 className="font-syne text-lg font-bold uppercase text-white mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4 text-zinc-400" />
                EQUIPMENT & CAMERA PACKAGE
              </h4>
              <p className="text-xs text-zinc-500 font-mono-code mb-4">
                Owner-operated camera package available for agile shoots and large-scale productions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono-code text-xs text-zinc-300">
                {DIRECTOR_BIO.gearKit.map((gear, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-sm bg-zinc-950 border border-zinc-800/70 flex items-start gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{gear}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
