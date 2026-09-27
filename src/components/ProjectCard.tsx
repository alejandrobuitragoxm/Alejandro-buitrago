import React, { useState, useRef } from 'react';
import { Play, Award, Edit3, MapPin, Clock } from 'lucide-react';
import { VideoProject } from '../types';

interface ProjectCardProps {
  project: VideoProject;
  onSelect: (project: VideoProject) => void;
  onEdit: (project: VideoProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, onEdit }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && (project.previewVideoUrl || project.videoUrl.endsWith('.mp4'))) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted or aborted; fallback cleanly
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const hasVideoPreview = Boolean(
    project.previewVideoUrl || 
    (project.videoUrl && (project.videoUrl.includes('.mp4') || project.videoUrl.includes('commondatastorage')))
  );

  return (
    <div
      id={`project-card-${project.id}`}
      className="group relative flex flex-col bg-[#0d0e12] border border-zinc-800/80 rounded-sm overflow-hidden transition-all duration-500 hover:border-zinc-500 hover:shadow-2xl hover:shadow-black"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Aspect Ratio Container (Cinema Scope 16:9 or 2.39:1) */}
      <div 
        className="relative w-full aspect-video sm:aspect-[16/9] bg-black overflow-hidden cursor-pointer"
        onClick={() => onSelect(project)}
      >
        {/* Base Poster Image */}
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isHovered && videoLoaded && hasVideoPreview ? 'opacity-0' : 'opacity-90'
          }`}
        />

        {/* Dynamic Video Preview on Hover (Darkwater & Omerta standard) */}
        {hasVideoPreview && (
          <video
            ref={videoRef}
            src={project.previewVideoUrl || project.videoUrl}
            muted
            playsInline
            loop
            onLoadedData={() => setVideoLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered && videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Ambient Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

        {/* Top Badges: Category & Duration */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="px-2 py-0.5 rounded-sm bg-black/80 backdrop-blur-md border border-zinc-700/80 text-[10px] font-mono-code uppercase tracking-wider text-zinc-300">
            {project.category}
          </span>

          <div className="flex items-center gap-1.5">
            {project.laurels && project.laurels.length > 0 && (
              <span 
                className="px-2 py-0.5 rounded-sm bg-amber-500/20 backdrop-blur-md border border-amber-500/40 text-[10px] font-mono-code text-amber-300 flex items-center gap-1"
                title={project.laurels[0]}
              >
                <Award className="w-2.5 h-2.5" />
                <span className="hidden sm:inline">AWARDED</span>
              </span>
            )}
            <span className="px-2 py-0.5 rounded-sm bg-black/80 backdrop-blur-md border border-zinc-700/80 text-[10px] font-mono-code text-zinc-400 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {project.duration}
            </span>
          </div>
        </div>

        {/* Center Play Indicator on Hover */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Bottom Location preview */}
        {project.location && (
          <div className="absolute bottom-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="px-2 py-0.5 rounded-sm bg-black/90 border border-zinc-800 text-[9px] font-mono-code text-zinc-400 flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 text-zinc-500" />
              {project.location}
            </span>
          </div>
        )}
      </div>

      {/* Card Info Content */}
      <div className="p-4 flex flex-col justify-between flex-1 bg-[#0d0e12]">
        <div>
          {/* Client & Year */}
          <div className="flex items-center justify-between text-xs font-mono-code text-zinc-500 uppercase tracking-wider mb-1.5">
            <span className="text-zinc-400 font-semibold truncate max-w-[200px]">
              {project.client}
            </span>
            <span>{project.year}</span>
          </div>

          {/* Project Title */}
          <h3 
            onClick={() => onSelect(project)}
            className="font-syne font-bold text-lg sm:text-xl text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight cursor-pointer line-clamp-1"
          >
            {project.title}
          </h3>

          {/* Synopsis preview */}
          <p className="text-xs text-zinc-400 line-clamp-2 mt-1.5 font-light leading-relaxed">
            {project.synopsis}
          </p>
        </div>

        {/* Roles Badges & Card Actions */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {project.roles.map((role) => (
              <span
                key={role}
                className="px-1.5 py-0.5 text-[9px] font-mono-code uppercase rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
              >
                {role}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {/* Quick Edit button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="p-1.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Editar este proyecto"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSelect(project)}
              className="text-[11px] font-mono-code uppercase text-zinc-400 group-hover:text-white flex items-center gap-1 transition-colors pl-1"
            >
              <span>VIEW</span>
              <span className="text-amber-400">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
