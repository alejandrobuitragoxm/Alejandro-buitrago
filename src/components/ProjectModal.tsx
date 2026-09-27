import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Award,
  MapPin,
  Clock,
  Calendar, 
  Maximize2, 
  Edit3,
  Sparkles,
  Share2,
  Check,
  Play
} from 'lucide-react';
import { VideoProject } from '../types';
import { parseVideoUrl } from '../utils/videoHelper';

interface ProjectModalProps {
  project: VideoProject | null;
  projectsList: VideoProject[];
  onClose: () => void;
  onSelectProject: (project: VideoProject) => void;
  onEditProject: (project: VideoProject) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  projectsList,
  onClose,
  onSelectProject,
  onEditProject,
}) => {
  const [aspectRatioMode, setAspectRatioMode] = useState<'scope' | 'standard'>('scope');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedStill, setSelectedStill] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Keyboard navigation
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, projectsList]);

  if (!project) return null;

  // Find index and next/prev projects
  const currentIndex = projectsList.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? projectsList[currentIndex - 1] : projectsList[projectsList.length - 1];
  const nextProject = currentIndex < projectsList.length - 1 ? projectsList[currentIndex + 1] : projectsList[0];

  const handleNext = () => {
    if (nextProject) onSelectProject(nextProject);
  };

  const handlePrev = () => {
    if (prevProject) onSelectProject(prevProject);
  };

  const parsedVideo = parseVideoUrl(project.videoUrl);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      id="project-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/95 backdrop-blur-xl flex flex-col text-zinc-100"
    >
      {/* Top Floating Control Bar */}
      <div className="sticky top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono-code text-zinc-500 uppercase">
            [ {String(currentIndex + 1).padStart(2, '0')} / {String(projectsList.length).padStart(2, '0')} ]
          </span>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <span className="hidden sm:inline text-xs font-mono-code text-zinc-400 uppercase truncate max-w-xs">
            {project.client} — {project.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Aspect Ratio Switcher */}
          <div className="hidden sm:flex items-center bg-zinc-900 rounded-sm border border-zinc-800 p-0.5 text-[10px] font-mono-code">
            <button
              onClick={() => setAspectRatioMode('scope')}
              className={`px-2 py-1 rounded-sm transition-colors ${
                aspectRatioMode === 'scope'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Anamorphic widescreen (2.39:1)"
            >
              2.39:1 SCOPE
            </button>
            <button
              onClick={() => setAspectRatioMode('standard')}
              className={`px-2 py-1 rounded-sm transition-colors ${
                aspectRatioMode === 'standard'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-white'
              }`}
              title="Standard TV / Web (16:9)"
            >
              16:9 FLAT
            </button>
          </div>

          {/* Edit Project Button */}
          <button
            onClick={() => onEditProject(project)}
            id="modal-edit-project-btn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-mono-code transition-colors"
            title="Edit this project's info or video"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">EDIT</span>
          </button>

          {/* Share / Copy Link */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Copy link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            id="modal-close-btn"
            className="p-2 rounded-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Theater Container */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
        {/* Cinema Video Viewport */}
        <div
          className={`relative w-full bg-black rounded-sm overflow-hidden border border-zinc-800 shadow-2xl transition-all duration-500 mx-auto ${
            aspectRatioMode === 'scope'
              ? 'aspect-cinemascope max-w-5xl'
              : 'aspect-video max-w-4xl'
          }`}
        >
          {project.embedRestricted ? (
            /* Rights-restricted films can't play embedded — send viewers to YouTube */
            <div className="absolute inset-0">
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-6 px-6 text-center">
                <p className="max-w-md font-mono-code text-sm sm:text-base leading-relaxed tracking-wide text-zinc-200">
                  The music in this film is rights-restricted and can&apos;t play embedded. Watch it on YouTube:
                </p>
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-sm bg-white px-6 py-3 font-syne text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-amber-400"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Watch on YouTube
                </a>
              </div>
            </div>
          ) : parsedVideo.type === 'youtube' || parsedVideo.type === 'vimeo' ? (
            <iframe
              src={parsedVideo.embedUrl}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <video
              ref={videoRef}
              src={project.videoUrl}
              controls
              autoPlay
              playsInline
              poster={project.thumbnailUrl}
              className="w-full h-full object-contain bg-black"
            />
          )}

          {/* Anamorphic Corner Crop Marks */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-white/20 pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-white/20 pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-white/20 pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-white/20 pointer-events-none"></div>
        </div>

        {/* Project Meta Information & Credits Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Cols: Title, Synopsis, Laurels, Stills */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              {/* Category & Year */}
              <div className="flex items-center gap-3 text-xs font-mono-code text-zinc-400 uppercase tracking-widest mb-2">
                <span className="text-amber-400 font-semibold">{project.client}</span>
                <span>•</span>
                <span>{project.category}</span>
                <span>•</span>
                <span>{project.year}</span>
              </div>

              {/* Title */}
              <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white leading-tight">
                {project.title}
              </h2>

              {/* Roles Badge List */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {project.roles.map((r) => (
                  <span
                    key={r}
                    className="px-2.5 py-1 text-xs font-mono-code uppercase rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-200"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>

            {/* Awards & Laurels */}
            {project.laurels && project.laurels.length > 0 && (
              <div className="p-4 rounded-sm bg-amber-950/20 border border-amber-500/30 flex flex-col gap-2">
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
                  <Award className="w-4 h-4" /> SELECTIONS & AWARDS
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.laurels.map((laurel, i) => (
                    <span
                      key={i}
                      className="text-xs font-mono-code text-zinc-300 bg-black/40 px-2.5 py-1 rounded border border-amber-500/20"
                    >
                      🏆 {laurel}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis / Director's Statement */}
            <div className="border-t border-zinc-800/80 pt-6">
              <h4 className="text-xs font-mono-code text-zinc-500 uppercase tracking-wider mb-2">
                SYNOPSIS & DIRECTOR&apos;S STATEMENT
              </h4>
              <p className="text-zinc-300 text-sm sm:text-base font-light leading-relaxed whitespace-pre-line">
                {project.synopsis}
              </p>
            </div>

            {/* Behind the Scenes / Stills Gallery */}
            {project.stills && project.stills.length > 0 && (
              <div className="border-t border-zinc-800/80 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-mono-code text-zinc-500 uppercase tracking-wider">
                    STILLS & CAMERA DETAILS
                  </h4>
                  <span className="text-[11px] font-mono-code text-zinc-600">
                    {project.stills.length} STILLS
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.stills.map((still, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedStill(still)}
                      className="group relative aspect-video bg-black rounded-sm overflow-hidden border border-zinc-800 cursor-pointer hover:border-zinc-500 transition-colors"
                    >
                      <img
                        src={still}
                        alt={`Still ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Technical Specs & Film Credits */}
          <div className="flex flex-col gap-6 bg-zinc-950/60 border border-zinc-800/80 p-6 rounded-sm">
            <div>
              <h4 className="text-xs font-mono-code text-amber-400 uppercase tracking-wider pb-3 border-b border-zinc-800 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                DETAILS
              </h4>
              <dl className="divide-y divide-zinc-900 text-xs font-mono-code mt-3">
                <div className="py-2.5 flex justify-between">
                  <dt className="text-zinc-500">LOCATION</dt>
                  <dd className="text-zinc-200 text-right font-medium max-w-[180px]">
                    {project.location || '—'}
                  </dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-zinc-500">ASPECT</dt>
                  <dd className="text-zinc-200">{project.aspectRatio || '2.39:1 Scope'}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-zinc-500">DURATION</dt>
                  <dd className="text-zinc-200">{project.duration}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-zinc-500">RELEASE YEAR</dt>
                  <dd className="text-zinc-200">{project.year}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Bottom Next / Prev Navigation */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex items-center justify-between font-mono-code text-xs">
          <button
            onClick={handlePrev}
            id="modal-prev-btn"
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
          >
            <div className="p-2 rounded-sm bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-800 text-zinc-300">
              <ChevronLeft className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:flex flex-col">
              <span className="text-[10px] text-zinc-600 uppercase">PREVIOUS</span>
              <span className="text-zinc-300 font-syne font-bold uppercase group-hover:text-amber-400">
                {prevProject.title}
              </span>
            </div>
          </button>

          <span className="text-zinc-600 text-[11px] hidden md:inline">
            USE THE ← → ARROW KEYS
          </span>

          <button
            onClick={handleNext}
            id="modal-next-btn"
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
          >
            <div className="text-right hidden sm:flex flex-col">
              <span className="text-[10px] text-zinc-600 uppercase">NEXT</span>
              <span className="text-zinc-300 font-syne font-bold uppercase group-hover:text-amber-400">
                {nextProject.title}
              </span>
            </div>
            <div className="p-2 rounded-sm bg-zinc-900 group-hover:bg-zinc-800 border border-zinc-800 text-zinc-300">
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Still Preview Zoom Lightbox */}
      {selectedStill && (
        <div
          className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedStill(null)}
        >
          <div className="relative max-w-5xl w-full">
            <img
              src={selectedStill}
              alt="High-res still"
              referrerPolicy="no-referrer"
              className="w-full h-auto rounded-sm border border-zinc-800"
            />
            <button
              onClick={() => setSelectedStill(null)}
              className="absolute top-4 right-4 p-2 bg-black/80 rounded text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
