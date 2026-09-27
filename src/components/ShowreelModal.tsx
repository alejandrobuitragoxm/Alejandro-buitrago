import React, { useRef, useEffect } from 'react';
import { X, Sparkles, Volume2, VolumeX, Maximize } from 'lucide-react';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShowreelModal: React.FC<ShowreelModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="showreel-modal"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between text-white p-4 sm:p-6"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-zinc-800 text-xs font-mono-code">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-zinc-200 uppercase font-bold tracking-wider">
            DIRECTOR & CINEMATOGRAPHY SHOWREEL [2025 EDITION]
          </span>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="text-zinc-400 hidden sm:inline">FORMAT: 2.39:1 ANAMORPHIC // 4K</span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Close Showreel (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Video Viewport */}
      <div className="relative my-auto w-full max-w-6xl mx-auto aspect-cinemascope bg-black rounded-sm overflow-hidden border border-zinc-800 shadow-2xl">
        <video
          ref={videoRef}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
          controls
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Framing Guides */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-white/40 pointer-events-none"></div>
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-white/40 pointer-events-none"></div>
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-white/40 pointer-events-none"></div>
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-white/40 pointer-events-none"></div>
      </div>

      {/* Bottom Metadata Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between py-3 border-t border-zinc-800 text-xs font-mono-code text-zinc-500 gap-2">
        <div className="flex items-center gap-4">
          <span>FEATURED PIECES: OAKLEY • SELECTED WORK 2023 — 2026</span>
        </div>
        <div>
          <span>ALEJANDRO BUITRAGO • DIRECTOR</span>
        </div>
      </div>
    </div>
  );
};
