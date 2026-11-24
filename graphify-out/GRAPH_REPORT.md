# Graph Report - kinetic-portfolio-test  (2026-10-22)

## Corpus Check
- 27 files · ~25,193 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 148 nodes · 241 edges · 13 communities (10 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.95)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `546d2bc9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- App.tsx
- react
- compilerOptions
- VideoProject
- dependencies
- OPTIX — Alejandro Buitrago · Director Portfolio
- devDependencies
- scripts
- ProjectModal.tsx
- contact.js
- Run and deploy your AI Studio app

## God Nodes (most connected - your core abstractions)
1. `VideoProject` - 19 edges
2. `react` - 16 edges
3. `compilerOptions` - 15 edges
4. `lucide-react` - 13 edges
5. `App()` - 13 edges
6. `OPTIX — Alejandro Buitrago · Director Portfolio` - 8 edges
7. `scripts` - 6 edges
8. `WorksGallery()` - 5 edges
9. `CinematicReel()` - 4 edges
10. `Act()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Project data model (`src/types.ts` → `VideoProject`)` --references--> `VideoProject`  [INFERRED]
  CLAUDE.md → src/types.ts
- `ProjectEditorModalProps` --references--> `VideoProject`  [EXTRACTED]
  src/components/ProjectEditorModal.tsx → src/types.ts
- `ProjectModalProps` --references--> `VideoProject`  [EXTRACTED]
  src/components/ProjectModal.tsx → src/types.ts
- `App()` --calls--> `CinematicReel()`  [EXTRACTED]
  src/App.tsx → src/components/CinematicReel.tsx
- `App()` --calls--> `ProjectModal()`  [EXTRACTED]
  src/App.tsx → src/components/ProjectModal.tsx

## Import Cycles
- None detected.

## Communities (13 total, 3 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.09
Nodes (19): name, private, type, version, autoprefixer, dotenv, esbuild, express (+11 more)

### Community 1 - "App.tsx"
Cohesion: 0.16
Nodes (16): App(), AboutSection(), AboutSectionProps, ClientStrip(), ContactModal(), Footer(), Header(), HeaderProps (+8 more)

### Community 2 - "react"
Cohesion: 0.18
Nodes (14): lucide-react, react, ContactModalProps, FooterProps, ProjectCard(), AVAILABLE_ROLES, PRESET_THUMBNAILS, ProjectEditorModalProps (+6 more)

### Community 3 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules, jsx, lib, module (+7 more)

### Community 4 - "VideoProject"
Cohesion: 0.19
Nodes (13): Act(), ActProps, CinematicReel(), CinematicReelProps, clamp(), mixClip(), Motion, MOTIONS (+5 more)

### Community 5 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, dotenv, express, @google/genai, lucide-react, motion, react, react-dom (+3 more)

### Community 6 - "OPTIX — Alejandro Buitrago · Director Portfolio"
Cohesion: 0.20
Nodes (9): Adding / editing works, Key components (`src/components/`), ⚠️ localStorage gotcha (important), OPTIX — Alejandro Buitrago · Director Portfolio, Pending / open items, Project data model (`src/types.ts` → `VideoProject`), Stack & running it, Videos for the reel / hero (+1 more)

### Community 7 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, autoprefixer, esbuild, tailwindcss, tsx, @types/express, @types/node, typescript (+1 more)

### Community 8 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, clean, dev, lint, preview

### Community 9 - "ProjectModal.tsx"
Cohesion: 0.47
Nodes (4): ProjectModal(), ProjectModalProps, ParsedVideo, parseVideoUrl()

## Knowledge Gaps
- **11 isolated node(s):** `@google/genai`, `express`, `dotenv`, `motion`, `@types/node` (+6 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 77 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `App.tsx`, `VideoProject`, `ProjectModal.tsx`?**
  _High betweenness centrality (0.210) - this node is a cross-community bridge._
- **What connects `@google/genai`, `express`, `dotenv` to the rest of the system?**
  _11 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09057971014492754 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `react` to `package.json`, `App.tsx`, `VideoProject`, `ProjectModal.tsx`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Why does `VideoProject` connect `VideoProject` to `App.tsx`, `react`, `OPTIX — Alejandro Buitrago · Director Portfolio`, `ProjectModal.tsx`?**
  _High betweenness centrality (0.139) - this node is a cross-community bridge._