import React, { useState, useEffect } from 'react';
import { Film, Volume2, VolumeX, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenNewProject: () => void;
  onOpenContact: () => void;
  onOpenReel: () => void;
  isAudioActive: boolean;
  toggleAudio: () => void;
  projectsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewProject,
  onOpenContact,
  onOpenReel,
  isAudioActive,
  toggleAudio,
  projectsCount,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timecode, setTimecode] = useState('00:00:00:00');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Timecode simulation clock (24 fps look)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const f = String(Math.floor((now.getMilliseconds() / 1000) * 24)).padStart(2, '0');
      setTimecode(`${h}:${m}:${s}:${f}`);
    }, 41);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08080a]/90 backdrop-blur-md border-b border-zinc-800/80 py-3.5 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Director Logo */}
        <a
          href="#"
          id="header-brand-link"
          className="group flex items-center gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-sm bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-zinc-100 group-hover:border-amber-400 group-hover:text-amber-400 transition-colors">
            <Film className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-syne font-bold text-base tracking-widest uppercase text-white flex items-center gap-1.5">
              OPTIX <span className="text-zinc-500 font-light text-xs font-mono-code">// WORK</span>
            </span>
            <span className="text-[10px] tracking-wider text-zinc-400 font-mono-code uppercase">
              Alejandro Buitrago • Director
            </span>
          </div>
        </a>

        {/* Center Live Timecode (Cinematic Darkwater/Omerta detail) */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 text-zinc-400 text-xs font-mono-code">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-red-400 font-semibold tracking-wider">REC</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300">{timecode}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500 text-[11px]">24 FPS</span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono-code tracking-wider uppercase text-zinc-300">
          <a
            href="#trabajos"
            id="nav-link-work"
            className="hover:text-white transition-colors relative py-1"
          >
            WORK
            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
              {projectsCount}
            </span>
          </a>

          <a
            href="#director"
            id="nav-link-director"
            className="hover:text-white transition-colors"
          >
            BIO
          </a>

          <a
            href="#clientes"
            id="nav-link-clients"
            className="hover:text-white transition-colors"
          >
            CLIENTS
          </a>
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Sound toggle */}
          <button
            onClick={toggleAudio}
            id="header-sound-toggle"
            aria-label="Toggle ambient sound"
            className="p-2 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            title={isAudioActive ? 'Mute ambient sound' : 'Enable ambient sound'}
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Contact Inquiry CTA */}
          <button
            onClick={onOpenContact}
            id="header-contact-btn"
            className="px-3.5 py-1.5 rounded-md bg-white hover:bg-zinc-200 text-black font-semibold text-xs font-mono-code tracking-wider transition-colors shadow-sm"
          >
            CONTACT
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="header-mobile-toggle"
            className="md:hidden p-2 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden mt-3 px-6 py-5 bg-[#0e0e12] border-b border-zinc-800 flex flex-col gap-4 text-xs font-mono-code tracking-wider"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-zinc-500">TIME: {timecode}</span>
            <span className="text-zinc-400">TOTAL: {projectsCount} FILMS</span>
          </div>

          <a
            href="#trabajos"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-200 hover:text-amber-400 py-1"
          >
            // VIEW WORK ({projectsCount})
          </a>
          <a
            href="#director"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-200 hover:text-amber-400 py-1"
          >
            // BIO
          </a>
          <a
            href="#clientes"
            onClick={() => setMobileMenuOpen(false)}
            className="text-zinc-200 hover:text-amber-400 py-1"
          >
            // BRANDS & CLIENTS
          </a>
        </div>
      )}
    </header>
  );
};
