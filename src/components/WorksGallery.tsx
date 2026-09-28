import React, { useState, useMemo } from 'react';
import { LayoutGrid, List, SlidersHorizontal, Search, Plus, Film, Sparkles, X } from 'lucide-react';
import { VideoProject, ProjectCategory, ViewMode } from '../types';
import { ProjectCard } from './ProjectCard';
import { ProjectTableIndex } from './ProjectTableIndex';

interface WorksGalleryProps {
  projects: VideoProject[];
  onSelectProject: (project: VideoProject) => void;
  onEditProject: (project: VideoProject) => void;
  onAddNewProject: () => void;
}

export const WorksGallery: React.FC<WorksGalleryProps> = ({
  projects,
  onSelectProject,
  onEditProject,
  onAddNewProject,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Categories list — only those that actually have projects are shown
  const allCategories: { label: string; value: string }[] = [
    { label: 'ALL', value: 'all' },
    { label: 'COMMERCIALS', value: 'Commercial' },
    { label: 'MUSIC VIDEOS', value: 'Music Video' },
    { label: 'FILM & FICTION', value: 'Narrative' },
    { label: 'FASHION & EDITORIAL', value: 'Fashion' },
    { label: 'DOCUMENTARIES', value: 'Documentary' },
  ];
  const categories = allCategories.filter(
    (cat) => cat.value === 'all' || projects.some((p) => p.category === cat.value)
  );

  // Role filter options — only those present in the projects are shown
  const allRoleOptions: { label: string; value: string }[] = [
    { label: 'ALL ROLES', value: 'all' },
    { label: 'ROLE: DIRECTOR', value: 'Director' },
    { label: 'ROLE: CINEMATOGRAPHY', value: 'Cinematography' },
    { label: 'ROLE: EDITOR', value: 'Editor' },
    { label: 'ROLE: COLORIST', value: 'Colorist' },
    { label: 'ROLE: PRODUCER', value: 'Producer' },
  ];
  const roleOptions = allRoleOptions.filter(
    (opt) =>
      opt.value === 'all' ||
      projects.some((p) => p.roles.some((r) => r.toLowerCase().includes(opt.value.toLowerCase())))
  );

  // Filter logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category match
      if (selectedCategory !== 'all' && project.category !== selectedCategory) {
        return false;
      }
      // Role match
      if (selectedRole !== 'all') {
        const hasRole = project.roles.some((r) =>
          r.toLowerCase().includes(selectedRole.toLowerCase())
        );
        if (!hasRole) return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesClient = project.client.toLowerCase().includes(query);
        const matchesSynopsis = project.synopsis.toLowerCase().includes(query);
        const matchesCamera = project.cameraPackage?.toLowerCase().includes(query) || false;
        const matchesRole = project.roles.some((r) => r.toLowerCase().includes(query));
        if (!matchesTitle && !matchesClient && !matchesSynopsis && !matchesCamera && !matchesRole) {
          return false;
        }
      }
      return true;
    });
  }, [projects, selectedCategory, selectedRole, searchQuery]);

  return (
    <section id="trabajos" className="w-full py-16 sm:py-24 bg-[#08080a] text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-8 border-b border-zinc-800 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-code tracking-widest text-zinc-300 uppercase mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>CATALOG // FILMOGRAPHY</span>
            </div>
            <h2 className="font-syne text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white">
              SELECTED WORK
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm font-light mt-2 max-w-xl">
              Explore commercial productions, artist videos, short films and documentary pieces. Filter by technical role or format.
            </p>
          </div>

        </div>

        {/* Filter & View Controls Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pb-8 mb-6">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const count = cat.value === 'all' 
                ? projects.length 
                : projects.filter(p => p.category === cat.value).length;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-sm text-xs font-mono-code uppercase whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedCategory === cat.value
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] ${selectedCategory === cat.value ? 'text-zinc-600' : 'text-zinc-500'}`}>
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>

          {/* Secondary Controls: Role Filter, Search, View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Role Filter Selector */}
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="appearance-none bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-mono-code uppercase px-3 py-2 pr-8 rounded-sm focus:outline-none focus:border-zinc-500 cursor-pointer"
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
                <SlidersHorizontal className="w-3 h-3" />
              </div>
            </div>

            {/* Search Box */}
            <div className="relative flex-1 sm:w-48">
              <input
                type="text"
                placeholder="Search film..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs font-mono-code placeholder:text-zinc-500 px-3 py-2 pl-8 rounded-sm focus:outline-none focus:border-zinc-500"
              />
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* View Mode Toggle (Grid vs Index Table) */}
            <div className="flex items-center rounded-sm bg-zinc-900 p-0.5 border border-zinc-800">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-sm transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Cinematic grid view"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('index')}
                className={`p-1.5 rounded-sm transition-colors ${
                  viewMode === 'index'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
                title="Editorial index / archive view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded-sm bg-zinc-950/40">
            <Film className="w-10 h-10 text-zinc-600 mb-3" />
            <p className="font-syne text-lg text-zinc-300 uppercase">
              No projects match these filters
            </p>
            <p className="text-xs font-mono-code text-zinc-500 mt-1 max-w-sm">
              Try changing the selected category or the search term.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedRole('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-sm bg-zinc-800 text-zinc-200 text-xs font-mono-code uppercase hover:bg-zinc-700"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            {filteredProjects.map((proj) => (
              <ProjectCard
                key={proj.id}
                project={proj}
                onSelect={onSelectProject}
                onEdit={onEditProject}
              />
            ))}
          </div>
        ) : (
          <ProjectTableIndex
            projects={filteredProjects}
            onSelect={onSelectProject}
            onEdit={onEditProject}
          />
        )}
      </div>
    </section>
  );
};
