import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  Film, 
  Camera, 
  Plus, 
  Upload, 
  Check, 
  Download, 
  RotateCcw,
  Sparkles 
} from 'lucide-react';
import { VideoProject, ProjectCategory, CrewRole } from '../types';

interface ProjectEditorModalProps {
  isOpen: boolean;
  projectToEdit: VideoProject | null;
  onClose: () => void;
  onSave: (project: VideoProject) => void;
  onDelete?: (projectId: string) => void;
  onExportJson: () => void;
  onImportJson: (jsonString: string) => void;
  onResetDefaults: () => void;
}

const AVAILABLE_ROLES: CrewRole[] = [
  'Director',
  'Cinematography',
  'Editor',
  'Colorist',
  'Producer',
  'VFX / 3D',
  'Sound Design',
];

const PRESET_THUMBNAILS = [
  { label: 'Automotive Night', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1600&auto=format&fit=crop' },
  { label: 'Music Stage / Red', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1600&auto=format&fit=crop' },
  { label: 'Action Freeride Snow', url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1600&auto=format&fit=crop' },
  { label: 'High Fashion Editorial', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop' },
  { label: 'Sci-Fi / Cinema Noir', url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1600&auto=format&fit=crop' },
  { label: 'Tokyo Cyberpunk Neon', url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1600&auto=format&fit=crop' },
  { label: 'Minimalist Architecture', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1600&auto=format&fit=crop' },
  { label: 'Subpolar Mountain', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop' },
];

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  isOpen,
  projectToEdit,
  onClose,
  onSave,
  onDelete,
  onExportJson,
  onImportJson,
  onResetDefaults,
}) => {
  const [formData, setFormData] = useState<Partial<VideoProject>>({
    title: '',
    client: '',
    category: 'Commercial',
    roles: ['Director'],
    year: new Date().getFullYear(),
    duration: '02:00',
    videoUrl: '',
    thumbnailUrl: '',
    synopsis: '',
    cameraPackage: 'ARRI Alexa 35 + Atlas Orion Anamorphic',
    aspectRatio: '2.39:1',
    laurels: [],
    stills: [],
    credits: {
      director: '',
      dp: '',
      editor: '',
      colorist: '',
      soundDesign: '',
      productionCompany: '',
    },
  });

  const [laurelsInput, setLaurelsInput] = useState('');
  const [stillsInput, setStillsInput] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonTools, setShowJsonTools] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setFormData(projectToEdit);
      setLaurelsInput(projectToEdit.laurels ? projectToEdit.laurels.join(', ') : '');
      setStillsInput(projectToEdit.stills ? projectToEdit.stills.join(', ') : '');
    } else {
      setFormData({
        title: '',
        client: '',
        category: 'Commercial',
        roles: ['Director'],
        year: 2025,
        duration: '02:15',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnailUrl: PRESET_THUMBNAILS[0].url,
        synopsis: '',
        cameraPackage: 'ARRI Alexa 35 + Atlas Orion 2x Anamorphic',
        aspectRatio: '2.39:1',
        laurels: [],
        stills: [
          'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop'
        ],
        credits: {
          director: 'Alejandro Buitrago',
          dp: '',
          editor: '',
          colorist: '',
          soundDesign: '',
          productionCompany: '',
        },
      });
      setLaurelsInput('');
      setStillsInput('');
    }
    setValidationError('');
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const toggleRole = (role: string) => {
    const currentRoles = formData.roles || [];
    if (currentRoles.includes(role)) {
      if (currentRoles.length > 1) {
        setFormData({ ...formData, roles: currentRoles.filter((r) => r !== role) });
      }
    } else {
      setFormData({ ...formData, roles: [...currentRoles, role] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim() || !formData.client?.trim()) {
      setValidationError('Please enter at least the title and the client/artist.');
      return;
    }

    const laurelsArray = laurelsInput
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const stillsArray = stillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const finalProject: VideoProject = {
      id: projectToEdit?.id || `proj-${Date.now()}`,
      title: formData.title.trim(),
      client: formData.client.trim(),
      category: (formData.category as ProjectCategory) || 'Commercial',
      roles: formData.roles && formData.roles.length > 0 ? formData.roles : ['Director'],
      year: formData.year || 2025,
      duration: formData.duration || '02:00',
      videoUrl: formData.videoUrl?.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnailUrl: formData.thumbnailUrl?.trim() || PRESET_THUMBNAILS[0].url,
      previewVideoUrl: formData.videoUrl?.trim()?.endsWith('.mp4') ? formData.videoUrl.trim() : undefined,
      synopsis: formData.synopsis?.trim() || 'High-impact cinematic production.',
      featured: formData.featured || false,
      cameraPackage: formData.cameraPackage || 'ARRI Alexa 35',
      aspectRatio: formData.aspectRatio || '2.39:1',
      laurels: laurelsArray,
      stills: stillsArray.length > 0 ? stillsArray : formData.stills || [],
      credits: formData.credits || {},
    };

    onSave(finalProject);
    onClose();
  };

  const handleImport = () => {
    if (!jsonInput.trim()) return;
    try {
      onImportJson(jsonInput);
      setShowJsonTools(false);
      onClose();
    } catch {
      setValidationError('Invalid JSON format.');
    }
  };

  return (
    <div
      id="project-editor-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-3xl bg-[#0e0e12] border border-zinc-700/80 rounded-sm shadow-2xl overflow-hidden my-8">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-amber-400" />
            <h3 className="font-syne font-bold text-base text-white uppercase tracking-wider">
              {projectToEdit ? 'EDIT EXISTING WORK' : '+ ADD NEW WORK TO PORTFOLIO'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="px-6 py-2.5 bg-red-950/60 border-b border-red-800 text-red-300 text-xs font-mono-code">
            {validationError}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto font-mono-code text-xs">
          {/* Row 1: Title & Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                PROJECT TITLE *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. ECLIPSE // NOCTURNE"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                CLIENT / ARTIST / BRAND *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. OAKLEY, SONY MUSIC, NIKE"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Row 2: Category, Year, Duration, Aspect Ratio */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                CATEGORY
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
              >
                <option value="Commercial">Commercial</option>
                <option value="Music Video">Music Video</option>
                <option value="Narrative">Film & Fiction</option>
                <option value="Fashion">Fashion & Editorial</option>
                <option value="Documentary">Documentary</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                YEAR
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2025 })}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                DURATION
              </label>
              <input
                type="text"
                placeholder="02:30"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                ASPECT
              </label>
              <select
                value={formData.aspectRatio}
                onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value as any })}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
              >
                <option value="2.39:1">2.39:1 Anamorphic</option>
                <option value="16:9">16:9 Standard</option>
                <option value="4:3">4:3 Classic</option>
                <option value="9:16">9:16 Vertical</option>
              </select>
            </div>
          </div>

          {/* Row 3: Roles Participated */}
          <div>
            <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
              ROLES YOU PLAYED (CHOOSE ONE OR MORE)
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_ROLES.map((role) => {
                const isSelected = formData.roles?.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-3 py-1.5 rounded-sm uppercase transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-amber-400 text-black font-semibold'
                        : 'bg-zinc-950 text-zinc-400 border border-zinc-800 hover:border-zinc-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    <span>{role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 4: Video URL */}
          <div>
            <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
              VIDEO LINK (YOUTUBE, VIMEO OR .MP4 FILE)
            </label>
            <input
              type="text"
              placeholder="https://vimeo.com/... or https://youtube.com/watch?v=... or https://...video.mp4"
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
            />
            <span className="text-[10px] text-zinc-500 mt-1 block">
              💡 Supports direct Vimeo, YouTube or .mp4 file links from your server or cloud storage.
            </span>
          </div>

          {/* Row 5: Poster / Thumbnail Image */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-zinc-400 uppercase text-[11px]">
                COVER IMAGE / POSTER (URL)
              </label>
            </div>
            <input
              type="text"
              placeholder="https://..."
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
            />

            {/* Thumbnail Presets Selector */}
            <div className="mt-2">
              <span className="text-[10px] text-zinc-500 uppercase block mb-1.5">
                Or pick a preset cinematic cover:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {PRESET_THUMBNAILS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, thumbnailUrl: p.url })}
                    className={`shrink-0 w-20 h-12 rounded-sm overflow-hidden border relative group ${
                      formData.thumbnailUrl === p.url ? 'border-amber-400 ring-1 ring-amber-400' : 'border-zinc-800'
                    }`}
                    title={p.label}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 6: Synopsis & Vision */}
          <div>
            <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
              SYNOPSIS / DIRECTOR&apos;S APPROACH / DESCRIPTION
            </label>
            <textarea
              rows={3}
              placeholder="Explain what the piece is about, the lighting, the visual concept or the challenge you solved..."
              value={formData.synopsis}
              onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 p-3 rounded-sm focus:outline-none focus:border-amber-400 resize-y"
            />
          </div>

          {/* Row 7: Camera & Technical Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                CAMERA & LENSES (GEAR)
              </label>
              <input
                type="text"
                placeholder="Ej. ARRI Alexa 35 + Atlas Orion Anamorphic"
                value={formData.cameraPackage}
                onChange={(e) => setFormData({ ...formData, cameraPackage: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-400 uppercase text-[11px] mb-1.5">
                AWARDS / LAURELS (COMMA-SEPARATED)
              </label>
              <input
                type="text"
                placeholder="Vimeo Staff Pick, Berlin Commercial Gold, etc."
                value={laurelsInput}
                onChange={(e) => setLaurelsInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 px-3 py-2 rounded-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Row 8: Crew Credits */}
          <div className="p-4 bg-zinc-950 border border-zinc-800/80 rounded-sm">
            <span className="block text-zinc-300 font-semibold uppercase text-[11px] mb-3">
              CREDITS (OPTIONAL)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-zinc-500 uppercase text-[10px] mb-1">DIRECTOR</label>
                <input
                  type="text"
                  placeholder="Name..."
                  value={formData.credits?.director || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: { ...formData.credits, director: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-2.5 py-1.5 rounded-sm"
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase text-[10px] mb-1">CINEMATOGRAPHY</label>
                <input
                  type="text"
                  placeholder="Name..."
                  value={formData.credits?.dp || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: { ...formData.credits, dp: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-2.5 py-1.5 rounded-sm"
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase text-[10px] mb-1">EDITOR</label>
                <input
                  type="text"
                  placeholder="Name..."
                  value={formData.credits?.editor || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: { ...formData.credits, editor: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-2.5 py-1.5 rounded-sm"
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase text-[10px] mb-1">COLORIST</label>
                <input
                  type="text"
                  placeholder="Name..."
                  value={formData.credits?.colorist || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: { ...formData.credits, colorist: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-2.5 py-1.5 rounded-sm"
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase text-[10px] mb-1">SOUND DESIGN</label>
                <input
                  type="text"
                  placeholder="Name or studio..."
                  value={formData.credits?.soundDesign || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: { ...formData.credits, soundDesign: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-2.5 py-1.5 rounded-sm"
                />
              </div>
              <div>
                <label className="block text-zinc-500 uppercase text-[10px] mb-1">PRODUCTION CO.</label>
                <input
                  type="text"
                  placeholder="Company..."
                  value={formData.credits?.productionCompany || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      credits: { ...formData.credits, productionCompany: e.target.value },
                    })
                  }
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 px-2.5 py-1.5 rounded-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {projectToEdit && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete "${projectToEdit.title}"? This cannot be undone.`)) {
                      onDelete(projectToEdit.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-2 rounded-sm bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>DELETE</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowJsonTools(!showJsonTools)}
                className="px-3 py-2 rounded-sm bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 text-xs transition-colors"
              >
                {showJsonTools ? 'HIDE BACKUP' : 'BACKUP / JSON'}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-sm bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs uppercase"
              >
                CANCEL
              </button>

              <button
                type="submit"
                id="save-project-btn"
                className="px-6 py-2 rounded-sm bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs uppercase flex items-center gap-2 transition-all shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>SAVE WORK</span>
              </button>
            </div>
          </div>

          {/* Backup / Export / Import Area */}
          {showJsonTools && (
            <div className="mt-4 p-4 bg-zinc-950 border border-zinc-800 rounded-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-zinc-300 uppercase text-[11px] font-semibold">
                  BACKUP & DATA TOOLS
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onExportJson}
                    className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white text-[10px] flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" /> EXPORT JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Restore the initial list of 8 sample cinematic projects?')) {
                        onResetDefaults();
                        onClose();
                      }
                    }}
                    className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white text-[10px] flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> RESTORE DEMOS
                  </button>
                </div>
              </div>

              <textarea
                rows={2}
                placeholder="Paste a JSON array of projects here to import..."
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 p-2 text-[11px] rounded"
              />
              {jsonInput && (
                <button
                  type="button"
                  onClick={handleImport}
                  className="px-3 py-1.5 rounded bg-emerald-700 text-white text-xs font-semibold uppercase"
                >
                  Import Projects Now
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
