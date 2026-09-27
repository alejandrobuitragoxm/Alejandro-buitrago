import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Play } from 'lucide-react';
import { VideoProject } from '../types';

interface CinematicReelProps {
  projects: VideoProject[];
  onSelectProject: (project: VideoProject) => void;
}

/**
 * Omertá-style scroll-driven cinematic sequence.
 * Each project becomes a full-bleed "act": a sticky, full-screen panel whose
 * media (a muted looping clip if `previewVideoUrl` exists, otherwise the
 * thumbnail) scales and parallaxes as you scroll, while a large serif title
 * reveals over it. To stay smooth, only the clip currently on screen plays —
 * every other one is paused (via IntersectionObserver), so at most one video
 * ever decodes at a time.
 */
export const CinematicReel: React.FC<CinematicReelProps> = ({ projects, onSelectProject }) => {
  // Take the strongest pieces for the cinematic run; the full catalog still
  // lives in the gallery below.
  const acts = projects.slice(0, 6);

  if (acts.length === 0) return null;

  return (
    <section id="reel" className="relative w-full bg-black">
      {/* Intro line, echoing the editorial cadence of the reference */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-28 text-center sm:py-36">
        <span className="font-mono-code text-[11px] uppercase tracking-[0.35em] text-zinc-500">
          Selected Work — In Motion
        </span>
        <h2 className="mt-6 font-cinzel text-4xl font-medium leading-[1.05] text-zinc-100 sm:text-6xl">
          Shot the same way,<br />
          <span className="italic text-zinc-400">up close.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm font-light leading-relaxed text-zinc-500">
          Scroll through the reel. Each frame breathes on its own.
        </p>
      </div>

      {acts.map((project, i) => (
        <Act key={project.id} project={project} index={i} onSelect={onSelectProject} />
      ))}
    </section>
  );
};

interface ActProps {
  project: VideoProject;
  index: number;
  onSelect: (project: VideoProject) => void;
}

// Six reveal "personalities" so consecutive acts move differently, the way the
// reference alternates its transitions.
type Motion = {
  align: 'left' | 'center' | 'right';
  clipFrom: string; // starting clip-path (curtain closed)
  scaleFrom: number;
  scaleTo: number;
  driftX: number; // horizontal parallax in px across the pin
  driftY: number; // vertical parallax in px across the pin
};

const MOTIONS: Motion[] = [
  { align: 'left', clipFrom: 'inset(0 0 100% 0)', scaleFrom: 1.25, scaleTo: 1.0, driftX: 0, driftY: -40 },
  { align: 'right', clipFrom: 'inset(0 100% 0 0)', scaleFrom: 1.18, scaleTo: 1.05, driftX: -50, driftY: 0 },
  { align: 'center', clipFrom: 'inset(100% 0 0 0)', scaleFrom: 1.3, scaleTo: 1.0, driftX: 0, driftY: 40 },
  { align: 'left', clipFrom: 'inset(0 0 0 100%)', scaleFrom: 1.2, scaleTo: 1.08, driftX: 50, driftY: 0 },
  { align: 'right', clipFrom: 'inset(0 0 100% 0)', scaleFrom: 1.22, scaleTo: 1.02, driftX: 0, driftY: -50 },
  { align: 'center', clipFrom: 'inset(0 100% 0 0)', scaleFrom: 1.28, scaleTo: 1.0, driftX: -40, driftY: 20 },
];

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const Act: React.FC<ActProps> = ({ project, index, onSelect }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);

  const motion = MOTIONS[index % MOTIONS.length];
  const hasClip = Boolean(project.previewVideoUrl);

  // Scroll-linked transforms — one shared rAF loop, transforms only (GPU).
  useEffect(() => {
    const outer = outerRef.current;
    const media = mediaRef.current;
    const title = titleRef.current;
    if (!outer || !media || !title) return;

    let running = false;

    const update = () => {
      running = false;
      const rect = outer.getBoundingClientRect();
      const vh = window.innerHeight;
      // Pin progress: 0 when the act starts pinning, 1 when it releases.
      const travel = rect.height - vh;
      const p = travel > 0 ? clamp(-rect.top / travel) : 0;

      // Media: slow zoom-out + directional drift across the whole pin.
      const scale = motion.scaleFrom + (motion.scaleTo - motion.scaleFrom) * p;
      const tx = motion.driftX * (p - 0.5) * 2;
      const ty = motion.driftY * (p - 0.5) * 2;
      media.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;

      // Curtain reveal in the first slice of the pin.
      const reveal = clamp(p / 0.18);
      media.style.clipPath = reveal >= 1 ? 'inset(0 0 0 0)' : mixClip(motion.clipFrom, reveal);

      // Title: rises in, holds, drifts out.
      const inP = clamp((p - 0.08) / 0.22);
      const outP = clamp((p - 0.82) / 0.18);
      const titleY = (1 - inP) * 60 - outP * 40;
      title.style.transform = `translate3d(0, ${titleY}px, 0)`;
      title.style.opacity = String(clamp(inP - outP));
    };

    const onScroll = () => {
      if (running) return;
      running = true;
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [motion]);

  // Play only while on screen — keeps at most one clip decoding at a time.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: [0, 0.4, 0.75] }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [hasClip]);

  const alignClasses =
    motion.align === 'left'
      ? 'items-start text-left'
      : motion.align === 'right'
      ? 'items-end text-right'
      : 'items-center text-center';

  const num = String(index + 1).padStart(2, '0');

  return (
    <div ref={outerRef} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        {/* Media layer */}
        <div ref={mediaRef} className="absolute inset-0 will-change-transform" style={{ clipPath: motion.clipFrom }}>
          {hasClip ? (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              src={project.previewVideoUrl}
              poster={project.thumbnailUrl}
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <img
              src={project.thumbnailUrl}
              alt={project.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* Cinematic grading + vignettes */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/50" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-30" />

        {/* Title layer */}
        <div className={`relative z-10 flex w-full max-w-7xl flex-col px-6 sm:px-12 ${alignClasses}`}>
          <div ref={titleRef} className="will-change-transform">
            <div className="mb-4 flex items-center gap-3 font-mono-code text-[11px] uppercase tracking-[0.3em] text-zinc-400">
              <span className="text-zinc-500">{num}</span>
              <span className="h-px w-8 bg-zinc-500/60" />
              <span>{project.client}</span>
            </div>
            <h3 className="font-cinzel text-5xl font-medium leading-[0.98] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)] sm:text-7xl lg:text-8xl">
              {project.title}
            </h3>
            <div
              className={`mt-6 flex flex-wrap items-center gap-4 ${
                motion.align === 'right' ? 'justify-end' : motion.align === 'center' ? 'justify-center' : ''
              }`}
            >
              <span className="font-mono-code text-xs uppercase tracking-widest text-zinc-400">
                {project.category} · {project.year} · {project.duration}
              </span>
              <button
                onClick={() => onSelect(project)}
                className="group flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Watch</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Interpolate a curtain clip-path from its closed state toward fully open
 * (inset 0). `t` in [0,1]; only the closed side animates.
 */
function mixClip(from: string, t: number): string {
  const m = from.match(/inset\(([^)]+)\)/);
  if (!m) return 'inset(0 0 0 0)';
  const parts = m[1].trim().split(/\s+/).map((s) => parseFloat(s));
  const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
  const closed = (v: number) => `${(v * (1 - eased)).toFixed(2)}%`;
  const [top, right, bottom, left] = parts;
  return `inset(${closed(top)} ${closed(right)} ${closed(bottom)} ${closed(left)})`;
}
