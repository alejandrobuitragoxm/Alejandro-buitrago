import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X } from 'lucide-react';

interface HeaderProps {
  onOpenNewProject: () => void;
  onOpenContact: () => void;
  onOpenReel: () => void;
  isAudioActive: boolean;
  toggleAudio: () => void;
  projectsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenContact,
  isAudioActive,
  toggleAudio,
  projectsCount,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08080a]/90 backdrop-blur-md border-b border-zinc-800/60 py-3.5'
          : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand — name first */}
        <a href="#" id="header-brand-link" className="group flex flex-col cursor-pointer">
          <span className="font-cinzel text-lg sm:text-xl tracking-[0.18em] uppercase text-white leading-none">
            Alejandro Buitrago
          </span>
          <span className="mt-1 text-[10px] tracking-[0.28em] text-zinc-500 uppercase">
            Creative Director &amp; Filmmaker
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.18em] uppercase text-zinc-400">
          <a href="#trabajos" id="nav-link-work" className="hover:text-white relative py-1">
            Work
            <span className="ml-1.5 text-[10px] text-zinc-600">{projectsCount}</span>
          </a>
          <a href="#director" id="nav-link-director" className="hover:text-white">
            Bio
          </a>
          <a href="#clientes" id="nav-link-clients" className="hover:text-white">
            Clients
          </a>
        </nav>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Sound toggle */}
          <button
            onClick={toggleAudio}
            id="header-sound-toggle"
            aria-label="Toggle ambient sound"
            className="p-2 rounded-full bg-transparent border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600"
            title={isAudioActive ? 'Mute ambient sound' : 'Enable ambient sound'}
          >
            {isAudioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Contact Inquiry CTA */}
          <button
            onClick={onOpenContact}
            id="header-contact-btn"
            className="px-4 py-1.5 rounded-full bg-white hover:bg-zinc-200 text-black font-medium text-xs tracking-[0.14em] uppercase"
          >
            Contact
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="header-mobile-toggle"
            className="md:hidden p-2 rounded-full border border-zinc-800 text-zinc-300"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="md:hidden mt-3 px-6 py-6 bg-[#0e0e12] border-b border-zinc-800 flex flex-col gap-4 text-sm tracking-[0.14em] uppercase"
        >
          <a href="#trabajos" onClick={() => setMobileMenuOpen(false)} className="text-zinc-200 hover:text-white py-1">
            Work ({projectsCount})
          </a>
          <a href="#director" onClick={() => setMobileMenuOpen(false)} className="text-zinc-200 hover:text-white py-1">
            Bio
          </a>
          <a href="#clientes" onClick={() => setMobileMenuOpen(false)} className="text-zinc-200 hover:text-white py-1">
            Clients
          </a>
        </div>
      )}
    </header>
  );
};
