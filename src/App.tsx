/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useExplorer } from './hooks/useExplorer';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import FileBrowserView from './components/FileBrowserView';
import ActivityView from './components/ActivityView';
import SettingsView from './components/SettingsView';
import UploadModal from './components/UploadModal';
import NewFolderModal from './components/NewFolderModal';
import QuickPreviewModal from './components/QuickPreviewModal';
import { calculateStorageStats } from './logic/storage';
import { Search, HardDrive, HelpCircle } from 'lucide-react';
import { FileItem, ActiveSection } from './types/explorer';

export default function App() {
  const explorer = useExplorer();
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  // Compute file type storage stats
  const typeStats = calculateStorageStats(explorer.files);

  const getPageTitle = (view: ActiveSection): string => {
    switch (view) {
      case 'dashboard': return 'Dashboard Overview';
      case 'files': return 'My Files';
      case 'collections': return 'Collections';
      case 'recent': return 'Recently Viewed';
      case 'favorites': return 'Starred Favorites';
      case 'activity': return 'Workspace Logs';
      case 'trash': return 'Deleted Assets';
      case 'settings': return 'System Settings';
      default: return 'Asset Drive';
    }
  };

  const currentFolder = explorer.folders.find(f => f.id === explorer.currentFolderId);
  const currentFolderName = currentFolder ? currentFolder.name : 'My Drive';
  const resolvedTitle = explorer.activeView === 'files' ? currentFolderName : getPageTitle(explorer.activeView);

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeView={explorer.activeView}
        onViewChange={(view) => {
          explorer.setActiveView(view);
          explorer.setCurrentFolderId(null);
          explorer.setSearchQuery('');
        }}
        onNewFolderClick={() => explorer.setIsNewFolderOpen(true)}
        onUploadClick={() => explorer.setIsUploadOpen(true)}
      />

      {/* Main View Container */}
      <div id="main-content-layout" className="flex-1 pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header id="main-app-header" className="h-20 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-8 sticky top-0 z-10">
          {/* Global Search Bar */}
          <div id="search-bar-block" className="relative w-full max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4.5 pointer-events-none">
              <Search className="w-5 h-5 text-[#94A3B8]" />
            </span>
            <input
              id="input-global-search"
              type="text"
              placeholder="Search assets, designers, file types or collections..."
              value={explorer.searchQuery}
              onChange={(e) => {
                explorer.setSearchQuery(e.target.value);
                if (explorer.activeView === 'dashboard') {
                  explorer.setActiveView('files');
                }
              }}
              className="w-full bg-[#F1F5F9] border border-transparent focus:border-blue-400 focus:bg-white rounded-2xl pl-12 pr-5 py-3 text-xs text-[#0F172A] placeholder-[#94A3B8] outline-none transition-all"
            />
          </div>

          {/* Quick Stats Toolbar */}
          <div id="header-right-meta" className="flex items-center gap-4">
            <div id="header-quota-badge" className="hidden lg:flex items-center gap-2 text-xs bg-blue-50 text-blue-700 font-bold px-3 py-1.5 rounded-full border border-blue-100">
              <HardDrive className="w-4 h-4 text-blue-600" />
              <span>Drive Standard Server</span>
            </div>
            <button 
              id="btn-help-faq"
              onClick={() => alert(`Explorer Help Manual:\n- Organize your items by dragging folders or files onto folders\n- Preview files instantly by double clicking lists\n- Reset storage cache under Settings`)}
              className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-blue-200 text-[#64748B] hover:text-[#0f172a] rounded-xl transition-all cursor-pointer"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content routing view space */}
        <main id="main-scrollable-region" className="flex-1 p-8 overflow-y-auto">
          {explorer.activeView === 'dashboard' ? (
            <DashboardView
              files={explorer.files}
              folders={explorer.folders}
              typeStats={typeStats}
              onToggleFavorite={explorer.handleToggleFavorite}
              onTrash={explorer.handleTrashItem}
              onView={(f) => {
                explorer.handleViewFile(f);
                setPreviewFile(f);
              }}
              onViewChange={(v) => {
                explorer.setActiveView(v);
                explorer.setCurrentFolderId(null);
              }}
            />
          ) : explorer.activeView === 'activity' ? (
            <ActivityView activities={explorer.activities} />
          ) : explorer.activeView === 'settings' ? (
            <SettingsView onClearStorage={handleResetData} />
          ) : (
            <FileBrowserView
              viewTitle={resolvedTitle}
              activeView={explorer.activeView}
              filteredFiles={explorer.filteredFiles}
              filteredFolders={explorer.filteredFolders}
              folders={explorer.folders}
              currentFolderId={explorer.currentFolderId}
              setCurrentFolderId={explorer.setCurrentFolderId}
              gridView={explorer.gridView}
              setGridView={explorer.setGridView}
              onToggleFavorite={explorer.handleToggleFavorite}
              onTrash={explorer.handleTrashItem}
              onRestore={explorer.handleRestoreItem}
              onDeletePermanent={explorer.handlePermanentDelete}
              onMoveItem={explorer.handleMoveItem}
              onView={(f) => {
                explorer.handleViewFile(f);
                setPreviewFile(f);
              }}
              onNewFolderClick={() => explorer.setIsNewFolderOpen(true)}
              onClearTrash={explorer.handleClearTrash}
            />
          )}
        </main>
      </div>

      {/* Overlays / Modal states */}
      {explorer.isUploadOpen && (
        <UploadModal
          onClose={() => explorer.setIsUploadOpen(false)}
          onUpload={(name, size) => explorer.handleUploadFile(name, size)}
        />
      )}

      {explorer.isNewFolderOpen && (
        <NewFolderModal
          onClose={() => explorer.setIsNewFolderOpen(false)}
          onCreate={(name) => explorer.handleCreateFolder(name)}
        />
      )}

      {previewFile && (
        <QuickPreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}
