import React, { useState } from 'react';
import { Play, Award, ArrowUpRight } from 'lucide-react';
import { VideoProject } from '../types';

interface ProjectTableIndexProps {
  projects: VideoProject[];
  onSelect: (project: VideoProject) => void;
  onEdit: (project: VideoProject) => void;
}

export const ProjectTableIndex: React.FC<ProjectTableIndexProps> = ({
  projects,
  onSelect,
  onEdit,
}) => {
  const [hoveredProject, setHoveredProject] = useState<VideoProject | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      id="projects-table-index"
      className="relative w-full overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono-code text-xs">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[11px] tracking-wider">
              <th className="py-3 px-4 font-normal">#</th>
              <th className="py-3 px-4 font-normal">PROJECT</th>
              <th className="py-3 px-4 font-normal">CLIENT / ARTIST</th>
              <th className="py-3 px-4 font-normal hidden md:table-cell">CATEGORY</th>
              <th className="py-3 px-4 font-normal hidden lg:table-cell">ROLES</th>
              <th className="py-3 px-4 font-normal hidden sm:table-cell">YEAR</th>
              <th className="py-3 px-4 font-normal hidden xl:table-cell">LOCATION</th>
              <th className="py-3 px-4 font-normal text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {projects.map((proj, idx) => (
              <tr
                key={proj.id}
                id={`index-row-${proj.id}`}
                className="group hover:bg-zinc-900/60 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredProject(proj)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => onSelect(proj)}
              >
                <td className="py-4 px-4 text-zinc-600 group-hover:text-white transition-colors">
                  {String(idx + 1).padStart(2, '0')}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-syne font-bold text-sm sm:text-base text-zinc-100 group-hover:text-white group-hover:translate-x-1 transition-all uppercase">
                      {proj.title}
                    </span>
                    {proj.laurels && proj.laurels.length > 0 && (
                      <span className="text-zinc-300" title={proj.laurels[0]}>
                        <Award className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-zinc-400 font-medium tracking-wide uppercase">
                  {proj.client}
                </td>
                <td className="py-4 px-4 hidden md:table-cell">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 uppercase">
                    {proj.category}
                  </span>
                </td>
                <td className="py-4 px-4 hidden lg:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {proj.roles.slice(0, 2).map((r) => (
                      <span
                        key={r}
                        className="px-1.5 py-0.5 rounded bg-black border border-zinc-800 text-[9px] text-zinc-400 uppercase"
                      >
                        {r}
                      </span>
                    ))}
                    {proj.roles.length > 2 && (
                      <span className="text-[9px] text-zinc-600">+{proj.roles.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-zinc-500 hidden sm:table-cell">
                  {proj.year}
                </td>
                <td className="py-4 px-4 text-zinc-500 hidden xl:table-cell truncate max-w-[200px]">
                  {proj.location || '—'}
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onSelect(proj)}
                      className="inline-flex items-center gap-1 text-zinc-400 group-hover:text-white font-semibold transition-colors"
                    >
                      <span className="hidden sm:inline">VIEW</span>
                      <ArrowUpRight className="w-4 h-4 text-zinc-300" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Hover Visual Preview (Omerta / A24 style) */}
      {hoveredProject && (
        <div
          className="fixed pointer-events-none z-50 hidden lg:block transition-transform duration-75 ease-out"
          style={{
            left: `${mousePos.x + 24}px`,
            top: `${mousePos.y - 120}px`,
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          <div className="w-64 aspect-video rounded-sm overflow-hidden border border-zinc-700 bg-black shadow-2xl shadow-black animate-in fade-in zoom-in-95 duration-200">
            <img
              src={hoveredProject.thumbnailUrl}
              alt={hoveredProject.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] font-mono-code text-white">
              <span className="truncate max-w-[160px] font-semibold">{hoveredProject.title}</span>
              <span className="text-zinc-300">{hoveredProject.duration}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
