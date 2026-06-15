/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Grid, List, ChevronRight, FolderPlus, ArrowLeft, Trash2, FolderOpen } from 'lucide-react';
import { FileItem, FolderItem, ActiveSection } from '../types/explorer';
import FolderCard from './FolderCard';
import FileCard from './FileCard';
import { buildBreadcrumbs } from '../logic/explorerEngine';

interface FileBrowserViewProps {
  viewTitle: string;
  activeView: ActiveSection;
  filteredFiles: FileItem[];
  filteredFolders: FolderItem[];
  folders: FolderItem[];
  currentFolderId: string | null;
  setCurrentFolderId: (id: string | null) => void;
  gridView: boolean;
  setGridView: (grid: boolean) => void;
  onToggleFavorite: (id: string, isFolder: boolean) => void;
  onTrash: (id: string, isFolder: boolean) => void;
  onRestore?: (id: string, isFolder: boolean) => void;
  onDeletePermanent?: (id: string, isFolder: boolean) => void;
  onMoveItem: (itemId: string, isFolder: boolean, targetFolderId: string | null) => void;
  onView: (file: FileItem) => void;
  onNewFolderClick: () => void;
  onClearTrash?: () => void;
}

export default function FileBrowserView({
  viewTitle,
  activeView,
  filteredFiles,
  filteredFolders,
  folders,
  currentFolderId,
  setCurrentFolderId,
  gridView,
  setGridView,
  onToggleFavorite,
  onTrash,
  onRestore,
  onDeletePermanent,
  onMoveItem,
  onView,
  onNewFolderClick,
  onClearTrash,
}: FileBrowserViewProps) {
  const breadcrumbs = buildBreadcrumbs(folders, currentFolderId);

  return (
    <div id="file-browser-layout" className="space-y-5">
      {/* Search Header & View Toolbar */}
      <div id="browser-toolbar" className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F1F5F9] pb-4">
        <div className="flex items-center gap-3">
          {currentFolderId && (
            <button
              onClick={() => {
                const current = folders.find(f => f.id === currentFolderId);
                setCurrentFolderId(current ? current.parentId : null);
              }}
              className="p-1.5 hover:bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 id="view-title-label" className="text-xl font-bold text-[#0F172A] tracking-tight">{viewTitle}</h2>
        </div>

        {/* View toggles and folder operations */}
        <div id="toolbar-actions" className="flex items-center gap-2">
          {activeView === 'trash' && filteredFiles.length + filteredFolders.length > 0 && onClearTrash && (
            <button
              onClick={onClearTrash}
              className="px-3.5 py-1.5 text-xs text-red-600 bg-red-50 hover:bg-red-100 font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Empty Trash</span>
            </button>
          )}

          {activeView === 'files' && (
            <button
              onClick={onNewFolderClick}
              className="px-3 py-1.5 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 font-semibold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Folder</span>
            </button>
          )}

          <div className="flex bg-[#F1F5F9] rounded-xl p-1 border border-[#E2E8F0] shrink-0">
            <button
              onClick={() => setGridView(true)}
              className={`p-1 rounded-lg ${gridView ? 'bg-white text-blue-600 shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              <Grid className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setGridView(false)}
              className={`p-1 rounded-lg ${!gridView ? 'bg-white text-blue-600 shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
            >
              <List className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Breadcrumbs (Only on files browsing) */}
      {activeView === 'files' && (
        <div id="breadcrumbs-navigation" className="flex items-center gap-1.5 text-sm font-medium text-[#64748B] bg-[#F8FAFC] py-2 px-4 rounded-xl border border-[#EDF2F7]">
          <button
            onClick={() => setCurrentFolderId(null)}
            className={`hover:text-blue-600 ${currentFolderId === null ? 'text-blue-600 font-semibold' : ''}`}
          >
            My Drive
          </button>
          {breadcrumbs.map((crumb) => (
            <div key={crumb.id} className="flex items-center gap-1.5">
              <ChevronRight className="w-4 h-4 text-[#94A3B8]" />
              <button
                onClick={() => setCurrentFolderId(crumb.id)}
                className={`hover:text-blue-600 truncate max-w-32 ${crumb.id === currentFolderId ? 'text-blue-600 font-semibold' : ''}`}
              >
                {crumb.name}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Folders Section */}
      {filteredFolders.length > 0 && (
        <div id="folders-grid-block" className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] px-1">Folders ({filteredFolders.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFolders.map(folder => (
              <FolderCard
                key={folder.id}
                folder={folder}
                onDoubleClick={setCurrentFolderId}
                onToggleFavorite={onToggleFavorite}
                onTrash={onTrash}
                onMoveItem={onMoveItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Files Section */}
      <div id="files-grid-block" className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] px-1">Files ({filteredFiles.length})</h3>
        
        {filteredFiles.length === 0 && filteredFolders.length === 0 ? (
          <div className="bg-[#FAFCFF] border-2 border-dashed border-[#CBD5E1] rounded-3xl p-12 text-center text-sm text-[#94A3B8] flex flex-col items-center justify-center max-w-lg mx-auto mt-6">
            <FolderOpen className="w-12 h-12 mb-3 text-blue-300" />
            <p className="font-semibold text-[#314155] text-base">This directory is empty</p>
            <p className="text-xs mt-1">Ready to sync assets? Run a new file upload or drag a file to relocate it here.</p>
          </div>
        ) : gridView ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredFiles.map(file => (
              <FileCard
                key={file.id}
                file={file}
                viewMode="grid"
                onToggleFavorite={onToggleFavorite}
                onTrash={onTrash}
                onRestore={onRestore}
                onDeletePermanent={onDeletePermanent}
                onView={onView}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map(file => (
              <FileCard
                key={file.id}
                file={file}
                viewMode="list"
                onToggleFavorite={onToggleFavorite}
                onTrash={onTrash}
                onRestore={onRestore}
                onDeletePermanent={onDeletePermanent}
                onView={onView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Active Org Tip */}
      {!currentFolderId && activeView === 'files' && (filteredFiles.length > 0 || filteredFolders.length > 0) && (
        <div className="text-[11px] text-[#94A3B8] text-center mt-8 font-medium">
          💡 Pro-tip: Drag files and drop them onto folder cards to organize. Double-click folders to navigate internally.
        </div>
      )}
    </div>
  );
}
