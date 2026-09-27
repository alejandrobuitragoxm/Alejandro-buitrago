/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { VideoProject } from './types';
import { INITIAL_PROJECTS, REEL_ORDER } from './data/initialProjects';
import { Header } from './components/Header';
import { HeroReel } from './components/HeroReel';
import { CinematicReel } from './components/CinematicReel';
import { WorksGallery } from './components/WorksGallery';
import { ProjectModal } from './components/ProjectModal';
import { ProjectEditorModal } from './components/ProjectEditorModal';
import { AboutSection } from './components/AboutSection';
import { ContactModal } from './components/ContactModal';
import { ShowreelModal } from './components/ShowreelModal';
import { Footer } from './components/Footer';

const STORAGE_KEY = 'kinetic_filmmaker_portfolio_projects_v1';

export default function App() {
  // Load projects from localStorage or default to initial high-end sample projects
  const [projects, setProjects] = useState<VideoProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors and fall back
    }
    return INITIAL_PROJECTS;
  });

  // Modals state
  const [selectedProject, setSelectedProject] = useState<VideoProject | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<VideoProject | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);

  // Ambient sound generator via Web Audio API (cinematic sub-bass drone)
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Persist projects to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Error saving projects to localStorage:', e);
    }
  }, [projects]);

  // Audio drone controller
  const toggleAudio = () => {
    if (!isAudioActive) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!audioCtxRef.current) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          // Gentle low cinematic sub-drone (55Hz / A1)
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(55, ctx.currentTime);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(140, ctx.currentTime);

          gain.gain.setValueAtTime(0.001, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          gainNodeRef.current = gain;
        } else if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
          if (gainNodeRef.current) {
            gainNodeRef.current.gain.exponentialRampToValueAtTime(0.08, audioCtxRef.current.currentTime + 1);
          }
        }
        setIsAudioActive(true);
      } catch {
        // Audio API may be blocked until user gesture
      }
    } else {
      if (audioCtxRef.current && gainNodeRef.current) {
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.5);
        setTimeout(() => {
          if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
            audioCtxRef.current.suspend();
          }
        }, 500);
      }
      setIsAudioActive(false);
    }
  };

  // Handlers for Project CRUD
  const handleSaveProject = (project: VideoProject) => {
    setProjects((prev) => {
      const existsIndex = prev.findIndex((p) => p.id === project.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = project;
        return updated;
      }
      return [project, ...prev];
    });

    // If currently viewing in modal, update it
    if (selectedProject && selectedProject.id === project.id) {
      setSelectedProject(project);
    }
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (selectedProject?.id === projectId) {
      setSelectedProject(null);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `filmmaker_portfolio_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (jsonString: string) => {
    const parsed = JSON.parse(jsonString);
    if (Array.isArray(parsed) && parsed.length > 0) {
      setProjects(parsed);
    } else {
      throw new Error('Invalid format');
    }
  };

  const handleResetDefaults = () => {
    setProjects(INITIAL_PROJECTS);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleOpenAddProject = () => {
    setProjectToEdit(null);
    setIsEditorOpen(true);
  };

  const handleEditProject = (project: VideoProject) => {
    setProjectToEdit(project);
    setIsEditorOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 selection:bg-amber-400 selection:text-black flex flex-col font-sans">
      {/* Cinematic Header Navigation */}
      <Header
        onOpenNewProject={handleOpenAddProject}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenReel={() => setIsShowreelOpen(true)}
        isAudioActive={isAudioActive}
        toggleAudio={toggleAudio}
        projectsCount={projects.length}
      />

      {/* Hero Showreel Showcase */}
      <main className="flex-1">
        <HeroReel
          onOpenReel={() => setIsShowreelOpen(true)}
          featuredProject={projects[0]}
        />

        {/* Omertá-style scroll-driven cinematic sequence — curated subset in REEL_ORDER */}
        <CinematicReel
          projects={REEL_ORDER
            .map((id) => projects.find((p) => p.id === id))
            .filter((p): p is VideoProject => Boolean(p))}
          onSelectProject={(proj) => setSelectedProject(proj)}
        />

        {/* Works Showcase Gallery (Grid & Index View Modes + Filter by Category & Role) */}
        <WorksGallery
          projects={projects}
          onSelectProject={(proj) => setSelectedProject(proj)}
          onEditProject={handleEditProject}
          onAddNewProject={handleOpenAddProject}
        />

        {/* Director Bio, Selected Clients, Laurels & Gear Kit */}
        <AboutSection
          onOpenContact={() => setIsContactOpen(true)}
          onOpenReel={() => setIsShowreelOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenContact={() => setIsContactOpen(true)}
        onOpenNewProject={handleOpenAddProject}
      />

      {/* Project Cinema Lightbox Modal */}
      <ProjectModal
        project={selectedProject}
        projectsList={projects}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(proj) => setSelectedProject(proj)}
        onEditProject={handleEditProject}
      />

      {/* Project Creator & Editor Modal (Key to "meter todos los trabajos") */}
      <ProjectEditorModal
        isOpen={isEditorOpen}
        projectToEdit={projectToEdit}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetDefaults={handleResetDefaults}
      />

      {/* Showreel Modal */}
      <ShowreelModal
        isOpen={isShowreelOpen}
        onClose={() => setIsShowreelOpen(false)}
      />

      {/* Contact & Booking Inquiry Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
