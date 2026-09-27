import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { VideoProject } from '../types';

interface HeroReelProps {
  onOpenReel: () => void;
  featuredProject?: VideoProject;
}

/**
 * Omertá-style hero: a single full-screen clip that autoplays the moment the
 * page loads (muted, so browsers allow it), with a large serif headline over a
 * cinematic grade. Drop a file at `public/hero.mp4` and it plays automatically;
 * until then the featured project's still stands in as a poster.
 */
export const HeroReel: React.FC<HeroReelProps> = ({ featuredProject }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [videoOk, setVideoOk] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const poster =
    featuredProject?.thumbnailUrl ||
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600&auto=format&fit=crop';

  // Kick off playback as soon as we can, in case autoplay attribute is throttled.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    // Unmuting sometimes needs a fresh play() call on user gesture.
    if (!v.muted) v.play().catch(() => {});
    setIsMuted(v.muted);
  };

  return (
    <section
      id="hero-reel"
      className="relative h-[100svh] w-full overflow-hidden bg-black text-white"
    >
      {/* Full-bleed background media */}
      <div className="absolute inset-0 z-0">
        {videoOk ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster={poster}
            onCanPlay={() => setLoaded(true)}
            onError={() => setVideoOk(false)}
            className={`h-full w-full object-cover transition-opacity duration-[1200ms] ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Drop your export here: public/hero.mp4 (H.264, 1080p) */}
            <source src="/hero.mp4" type="video/mp4" />
            <source src="/hero.webm" type="video/webm" />
          </video>
        ) : (
          <img src={poster} alt={featuredProject?.title || 'Featured film'} className="h-full w-full object-cover" />
        )}

        {/* Cinematic grade: darken edges, lift the title, add grain */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-30" />
      </div>

      {/* Headline */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 sm:px-12 lg:px-16">
        <div className="max-w-5xl">
          <span className="font-mono-code text-[11px] uppercase tracking-[0.35em] text-zinc-300/80">
            Alejandro Buitrago — Director
          </span>
          <h1 className="mt-5 font-cinzel text-6xl font-medium leading-[0.92] text-white drop-shadow-[0_2px_30px_rgba(0,0,0,0.55)] sm:text-8xl lg:text-[9rem]">
            Close Enough<br />
            <span className="italic text-zinc-300">to feel it</span>
          </h1>
          <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-zinc-300/90 sm:text-base">
            Commercial work and personal stories, shot the same way: up close.
          </p>
        </div>
      </div>

      {/* Sound toggle */}
      <button
        onClick={toggleMute}
        id="hero-sound-toggle-btn"
        className="absolute bottom-8 right-6 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2.5 text-[11px] font-medium uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black sm:right-12"
        title={isMuted ? 'Enable sound' : 'Mute'}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        <span className="hidden sm:inline">{isMuted ? 'Sound off' : 'Sound on'}</span>
      </button>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-zinc-300/70">
        <span className="font-mono-code text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="h-10 w-px animate-pulse bg-gradient-to-b from-white/70 to-transparent" />
      </div>
    </section>
  );
};
