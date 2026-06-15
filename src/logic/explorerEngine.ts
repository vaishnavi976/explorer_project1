/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileItem, FolderItem, ActivityLog, FileType } from '../types/explorer';
import { createNewFile, createNewFolder } from './fileState';

export function buildBreadcrumbs(
  folders: FolderItem[],
  currentFolderId: string | null
): FolderItem[] {
  const crumbs: FolderItem[] = [];
  let currentId = currentFolderId;

  while (currentId !== null) {
    const folder = folders.find(f => f.id === currentId);
    if (folder) {
      crumbs.unshift(folder);
      currentId = folder.parentId;
    } else {
      break;
    }
  }

  return crumbs;
}

export function generateActivity(
  action: ActivityLog['action'],
  targetName: string,
  targetType: ActivityLog['targetType']
): ActivityLog {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    userId: 'vaishchaudhari976@gmail.com',
    userName: 'Vaish Chaudhari',
    action,
    targetName,
    targetType,
    timestamp: new Date().toISOString()
  };
}

export function detectFileType(fileName: string): FileType {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext) return 'other';

  const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp'];
  const pdfExts = ['pdf'];
  const sheetExts = ['xls', 'xlsx', 'csv', 'ods', 'numbers'];
  const docExts = ['doc', 'docx', 'txt', 'rtf', 'odt', 'pages', 'md'];
  const videoExts = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm'];
  const presExts = ['ppt', 'pptx', 'key', 'odp'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz'];
  const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];

  if (imageExts.includes(ext)) return 'image';
  if (pdfExts.includes(ext)) return 'pdf';
  if (sheetExts.includes(ext)) return 'sheet';
  if (docExts.includes(ext)) return 'document';
  if (videoExts.includes(ext)) return 'video';
  if (presExts.includes(ext)) return 'presentation';
  if (archiveExts.includes(ext)) return 'archive';
  if (audioExts.includes(ext)) return 'audio';
  return 'other';
}

export function searchAndFilterItems(
  files: FileItem[],
  folders: FolderItem[],
  searchQuery: string,
  view: string,
  currentFolderId: string | null
): { filteredFiles: FileItem[]; filteredFolders: FolderItem[] } {
  // 1. Core filters depending on the navigation view
  let activeFiles = files;
  let activeFolders = folders;

  if (view === 'trash') {
    activeFiles = files.filter(f => f.isTrash);
    activeFolders = folders.filter(f => f.isTrash);
  } else {
    // Hide trashed items from all other views
    activeFiles = files.filter(f => !f.isTrash);
    activeFolders = folders.filter(f => !f.isTrash);

    if (view === 'favorites') {
      activeFiles = activeFiles.filter(f => f.isFavorite);
      activeFolders = activeFolders.filter(f => f.isFavorite);
    } else if (view === 'recent') {
      activeFiles = activeFiles.filter(f => f.isRecent).sort((a, b) => new Date(b.lastViewedAt).getTime() - new Date(a.lastViewedAt).getTime());
      activeFolders = []; // recent view usually shows files only
    } else if (view === 'files') {
      // Show items inside current folder
      activeFiles = activeFiles.filter(f => f.parentId === currentFolderId);
      activeFolders = activeFolders.filter(f => f.parentId === currentFolderId);
    }
  }

  // 2. Search query filter
  if (searchQuery.trim().length > 0) {
    const query = searchQuery.toLowerCase().trim();
    // In search result, we show matching items regardless of parent folder (global search!)
    const globalFiles = files.filter(f => !f.isTrash && f.name.toLowerCase().includes(query));
    const globalFolders = folders.filter(f => !f.isTrash && f.name.toLowerCase().includes(query));
    return { filteredFiles: globalFiles, filteredFolders: globalFolders };
  }

  return { filteredFiles: activeFiles, filteredFolders: activeFolders };
}
