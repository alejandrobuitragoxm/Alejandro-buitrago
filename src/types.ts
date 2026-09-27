export type ProjectCategory = 
  | 'Commercial' 
  | 'Music Video' 
  | 'Narrative' 
  | 'Fashion' 
  | 'Documentary';

export type CrewRole = 
  | 'Director' 
  | 'Cinematography'
  | 'Editor' 
  | 'Colorist' 
  | 'Producer' 
  | 'VFX / 3D' 
  | 'Sound Design';

export interface ProjectCredits {
  director?: string;
  dp?: string;
  producer?: string;
  editor?: string;
  colorist?: string;
  soundDesign?: string;
  vfx?: string;
  productionCompany?: string;
  customCredits?: { role: string; name: string }[];
}

export interface VideoProject {
  id: string;
  title: string;
  client: string;
  category: ProjectCategory;
  roles: string[];
  year: number | string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  previewVideoUrl?: string;
  synopsis: string;
  featured?: boolean;
  /** When true, the film can't play embedded (e.g. rights-restricted music); show a "Watch on YouTube" fallback instead of the iframe. */
  embedRestricted?: boolean;
  cameraPackage?: string;
  /** Where the film was shot — shown on cards and in the project detail. */
  location?: string;
  aspectRatio?: '2.39:1' | '16:9' | '4:3' | '9:16';
  laurels?: string[];
  stills?: string[];
  credits?: ProjectCredits;
}

export type ViewMode = 'grid' | 'index' | 'featured';
