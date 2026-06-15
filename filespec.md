# File Specifications Map

This document outlines each file inside the **Explorer** digital assets manager and its targeted purpose. Code base is kept strictly modular under 200 lines per file, adhering strictly to Single Responsibility principles.

## Structure Overview

### 📂 Configuration & Manifests
- `package.json` — Manages runtime and dev dependencies.
- `filespec.json` — Machine-readable layout mapping for platform compliance.
- `filespec.md` — Human-readable layout mapping describing the codebase architecture.
- `api.md` — REST API endpoint registry representing simulated client operations.
- `functionspec.md` — Methodological mapping representing every sub-functional role.

### 📂 Data Layer
- `mock-data.json` — Contains initial seed values of file items, folders, collections, and log trails.

### 📂 Logic Layers (.ts only)
- `src/types/explorer.ts` — Houses all standard TypeScript types and interfaces.
- `src/logic/storage.ts` — Implements physical sizing calculators, disk usage metrics, and localStorage wrappers.
- `src/logic/fileState.ts` — Contains immutable state modification operations like folder creations, move pipelines, and deletions.
- `src/logic/explorerEngine.ts` — Handles search query match arrays, folder breadcrumb trees, and auto MIME-type detection.

### 📂 Hooks & Controllers (.ts only)
- `src/hooks/useExplorer.ts` — Core custom hook encapsulating all React states, storage sync effects, and event delegates.

### 📂 Visual & Render Components (.tsx only)
- `src/components/Sidebar.tsx` — Main navigation sidebar with active quota displays.
- `src/components/StorageOverview.tsx` — Shows circular progress of storage space in real time using high contrast SVG circles.
- `src/components/DashboardView.tsx` — The responsive dashboard, rendering stats charts, recent assets, and favorites.
- `src/components/FileBrowserView.tsx` — Unified file explorer with grids, breadcrumb routes, and navigation items.
- `src/components/FolderCard.tsx` — Individual folder widget with HTML5 drag/drop triggers.
- `src/components/FileCard.tsx` — Modular file widget with grid/list representations.
- `src/components/ActivityView.tsx` — Timelines grid representing file logs chronologically.
- `src/components/UploadModal.tsx` — Interactive upload container allowing drops directly from local OS.
- `src/components/NewFolderModal.tsx` — Input dialog form for creating directories.
- `src/components/QuickPreviewModal.tsx` — Tailored quick preview sliders with custom modules for images, text, sheets, and default formats.
- `src/components/SettingsView.tsx` — System panel to configure settings and wipe caches.
- `src/App.tsx` — Assembles the sidebar, search header, view router, and overlays.
