/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { FileItem, FolderItem, ActivityLog, ActiveSection, FileType } from '../types/explorer';
import { saveStateToLocal, loadStateFromLocal } from '../logic/storage';
import { createNewFile, createNewFolder, moveItem } from '../logic/fileState';
import { generateActivity, detectFileType, searchAndFilterItems } from '../logic/explorerEngine';
import mockData from '../../mock-data.json';

export function useExplorer() {
  // Load initial data
  const [files, setFiles] = useState<FileItem[]>(() =>
    loadStateFromLocal<FileItem[]>('exp_files', mockData.files as FileItem[])
  );
  const [folders, setFolders] = useState<FolderItem[]>(() =>
    loadStateFromLocal<FolderItem[]>('exp_folders', mockData.folders as FolderItem[])
  );
  const [activities, setActivities] = useState<ActivityLog[]>(() =>
    loadStateFromLocal<ActivityLog[]>('exp_activities', mockData.activities as ActivityLog[])
  );

  // Nav and Layout state
  const [activeView, setActiveView] = useState<ActiveSection>('dashboard');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [gridView, setGridView] = useState(true);
  
  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);

  // Drag and drop tracking
  const [draggedItem, setDraggedItem] = useState<{ id: string; isFolder: boolean } | null>(null);

  // Sync to localstorage
  useEffect(() => {
    saveStateToLocal('exp_files', files);
  }, [files]);

  useEffect(() => {
    saveStateToLocal('exp_folders', folders);
  }, [folders]);

  useEffect(() => {
    saveStateToLocal('exp_activities', activities);
  }, [activities]);

  // Actions
  const handleCreateFolder = (name: string) => {
    const fresh = createNewFolder(name, currentFolderId);
    setFolders(prev => [fresh, ...prev]);
    setActivities(prev => [generateActivity('created_folder', fresh.name, 'folder'), ...prev]);
    setIsNewFolderOpen(false);
  };

  const handleUploadFile = (name: string, size: number) => {
    const type = detectFileType(name);
    const fresh = createNewFile(name, type, size, currentFolderId);
    setFiles(prev => [fresh, ...prev]);
    setActivities(prev => [generateActivity('uploaded', fresh.name, 'file'), ...prev]);
    setIsUploadOpen(false);
  };

  const handleToggleFavorite = (id: string, isFolder: boolean) => {
    if (isFolder) {
      setFolders(prev =>
        prev.map(f => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
      );
      const folder = folders.find(f => f.id === id);
      if (folder) {
        setActivities(prev => [
          generateActivity(folder.isFavorite ? 'unstarred' : 'starred', folder.name, 'folder'),
          ...prev,
        ]);
      }
    } else {
      setFiles(prev =>
        prev.map(f => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f))
      );
      const file = files.find(f => f.id === id);
      if (file) {
        setActivities(prev => [
          generateActivity(file.isFavorite ? 'unstarred' : 'starred', file.name, 'file'),
          ...prev,
        ]);
      }
    }
  };

  const handleMoveItem = (itemId: string, isFolder: boolean, targetFolderId: string | null) => {
    const result = moveItem(files, folders, itemId, isFolder, targetFolderId);
    setFiles(result.files);
    setFolders(result.folders);
    
    const name = isFolder 
      ? folders.find(f => f.id === itemId)?.name 
      : files.find(f => f.id === itemId).name;
    
    if (name) {
      setActivities(prev => [generateActivity('moved', name, isFolder ? 'folder' : 'file'), ...prev]);
    }
  };

  const handleTrashItem = (id: string, isFolder: boolean) => {
    if (isFolder) {
      setFolders(prev => prev.map(f => (f.id === id ? { ...f, isTrash: true } : f)));
      const folder = folders.find(f => f.id === id);
      if (folder) {
        setActivities(prev => [generateActivity('deleted', folder.name, 'folder'), ...prev]);
      }
    } else {
      setFiles(prev => prev.map(f => (f.id === id ? { ...f, isTrash: true } : f)));
      const file = files.find(f => f.id === id);
      if (file) {
        setActivities(prev => [generateActivity('deleted', file.name, 'file'), ...prev]);
      }
    }
  };

  const handleRestoreItem = (id: string, isFolder: boolean) => {
    if (isFolder) {
      setFolders(prev => prev.map(f => (f.id === id ? { ...f, isTrash: false } : f)));
      const folder = folders.find(f => f.id === id);
      if (folder) {
        setActivities(prev => [generateActivity('restored', folder.name, 'folder'), ...prev]);
      }
    } else {
      setFiles(prev => prev.map(f => (f.id === id ? { ...f, isTrash: false } : f)));
      const file = files.find(f => f.id === id);
      if (file) {
        setActivities(prev => [generateActivity('restored', file.name, 'file'), ...prev]);
      }
    }
  };

  const handlePermanentDelete = (id: string, isFolder: boolean) => {
    if (isFolder) {
      setFolders(prev => prev.filter(f => f.id !== id));
    } else {
      setFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const handleViewFile = (file: FileItem) => {
    // Record recent view
    setFiles(prev =>
      prev.map(f =>
        f.id === file.id
          ? { ...f, isRecent: true, lastViewedAt: new Date().toISOString() }
          : f
      )
    );
    setActivities(prev => [generateActivity('viewed', file.name, 'file'), ...prev]);
  };

  const handleClearTrash = () => {
    setFiles(prev => prev.filter(f => !f.isTrash));
    setFolders(prev => prev.filter(f => !f.isTrash));
  };

  const { filteredFiles, filteredFolders } = searchAndFilterItems(
    files,
    folders,
    searchQuery,
    activeView,
    currentFolderId
  );

  return {
    files,
    folders,
    activities,
    activeView,
    setActiveView,
    currentFolderId,
    setCurrentFolderId,
    searchQuery,
    setSearchQuery,
    gridView,
    setGridView,
    isUploadOpen,
    setIsUploadOpen,
    isNewFolderOpen,
    setIsNewFolderOpen,
    draggedItem,
    setDraggedItem,
    filteredFiles,
    filteredFolders,
    handleCreateFolder,
    handleUploadFile,
    handleToggleFavorite,
    handleMoveItem,
    handleTrashItem,
    handleRestoreItem,
    handlePermanentDelete,
    handleViewFile,
    handleClearTrash,
  };
}
