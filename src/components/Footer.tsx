import React from 'react';
import { ArrowUp, Film, Mail, Instagram, Globe } from 'lucide-react';

interface FooterProps {
  onOpenContact: () => void;
  onOpenNewProject: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onOpenNewProject }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="w-full bg-[#060608] border-t border-zinc-900 text-zinc-400 py-16 font-mono-code text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-zinc-900">
          {/* Col 1: Brand & Bio Statement */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <Film className="w-3 h-3" />
                </div>
                <span className="font-syne font-extrabold text-white text-base tracking-widest uppercase">
                  OPTIX // FILM STUDIO
                </span>
              </div>
              <p className="text-zinc-500 font-light leading-relaxed max-w-sm">
                Cinematic directing, cinematography and color post-production for forward-thinking brands, record labels and independent cinema.
              </p>
            </div>

            <div className="mt-8 text-[11px] text-zinc-600">
              <span>COORDINATES: 40.4168° N, 3.7038° W (MAD) // 4.7110° N, 74.0721° W (BOG)</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-zinc-200 uppercase tracking-widest text-[11px] font-semibold">
              // NAVIGATION
            </span>
            <a href="#trabajos" className="hover:text-white transition-colors">
              Work Catalog
            </a>
            <a href="#director" className="hover:text-white transition-colors">
              Biography & Awards
            </a>
            <a href="#clientes" className="hover:text-white transition-colors">
              Brands & Clients
            </a>
          </div>

          {/* Col 3: Direct Contact & Social */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="text-zinc-200 uppercase tracking-widest text-[11px] font-semibold">
              // DIRECT CONTACT
            </span>
            <a
              href="mailto:alejandro.buitrago.xm@gmail.com"
              className="text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>alejandro.buitrago.xm@gmail.com</span>
            </a>

            <div className="pt-3 flex items-center gap-4 text-zinc-400">
              <a
                href="https://www.instagram.com/a_buitrag0/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram
              </a>
              <span>•</span>
              <a
                href="https://www.youtube.com/@buitre_abz"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
              >
                YouTube
              </a>
            </div>

            <div className="mt-4">
              <button
                onClick={onOpenContact}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 rounded-sm hover:text-white uppercase transition-colors"
              >
                Request Treatment / Pitch
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-600 gap-4">
          <p>© {new Date().getFullYear()} ALEJANDRO BUITRAGO. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
