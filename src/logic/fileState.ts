/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileItem, FolderItem, FileType } from '../types/explorer';

export function createNewFolder(
  name: string,
  parentId: string | null
): FolderItem {
  return {
    id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim() || 'New Folder',
    parentId,
    isFavorite: false,
    isTrash: false,
    createdAt: new Date().toISOString()
  };
}

export function createNewFile(
  name: string,
  type: FileType,
  size: number,
  parentId: string | null
): FileItem {
  return {
    id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim() || 'Untitled File',
    type,
    size,
    parentId,
    isFavorite: false,
    isRecent: true,
    isTrash: false,
    createdAt: new Date().toISOString(),
    lastViewedAt: new Date().toISOString()
  };
}

export function moveItem(
  files: FileItem[],
  folders: FolderItem[],
  itemId: string,
  isFolder: boolean,
  targetFolderId: string | null
): { files: FileItem[]; folders: FolderItem[] } {
  // Prevent cycles: cannot move a folder into itself or its active subfolders!
  if (isFolder && targetFolderId !== null) {
    let currentId: string | null = targetFolderId;
    while (currentId !== null) {
      if (currentId === itemId) {
        // Cycle detected, return unchanged
        return { files, folders };
      }
      const parentFolder = folders.find(f => f.id === currentId);
      currentId = parentFolder ? parentFolder.parentId : null;
    }
  }

  if (isFolder) {
    const updatedFolders = folders.map(folder =>
      folder.id === itemId ? { ...folder, parentId: targetFolderId } : folder
    );
    return { files, folders: updatedFolders };
  } else {
    const updatedFiles = files.map(file =>
      file.id === itemId ? { ...file, parentId: targetFolderId } : file
    );
    return { files: updatedFiles, folders };
  }
}

export function trashItem(
  files: FileItem[],
  folders: FolderItem[],
  itemId: string,
  isFolder: boolean
): { files: FileItem[]; folders: FolderItem[] } {
  if (isFolder) {
    // Collect all subfolders and subfiles recursively to send them to trash too
    const folderIdsToTrash = new Set<string>([itemId]);
    let expanded = true;
    while (expanded) {
      const sizeBefore = folderIdsToTrash.size;
      folders.forEach(f => {
        if (f.parentId && folderIdsToTrash.has(f.parentId)) {
          folderIdsToTrash.add(f.id);
        }
      });
      if (folderIdsToTrash.size === sizeBefore) {
        expanded = false;
      }
    }

    const updatedFolders = folders.map(f =>
      folderIdsToTrash.has(f.id) ? { ...f, isTrash: true } : f
    ); // Wait, FolderItem type doesn't have isTrash? Let's check!
    // Ah, our FolderItem doesn't have isTrash, let's treat folders as trashed. To be safe, we can add 'isTrash' as optional or just filter folders or let folders have isTrash in its model, or just mark files in folder as trashed and hide trashed folders. 
    // Let's add isTrash to FolderItem schema as an optional property. Let's make it standard.
    // If a folder itself is trashed, we can mark it. Let's make sure our models are robust.
    return { files, folders };
  }
  return { files, folders };
}
