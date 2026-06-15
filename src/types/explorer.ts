/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FileType = 'pdf' | 'image' | 'sheet' | 'document' | 'video' | 'presentation' | 'archive' | 'audio' | 'other';

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  size: number;
  parentId: string | null;
  isFavorite: boolean;
  isRecent: boolean;
  isTrash: boolean;
  createdAt: string;
  lastViewedAt: string;
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  isFavorite: boolean;
  isTrash: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: 'viewed' | 'uploaded' | 'created_folder' | 'moved' | 'deleted' | 'starred' | 'unstarred' | 'restored';
  targetName: string;
  targetType: 'file' | 'folder';
  timestamp: string;
}

export interface Collection {
  id: string;
  name: string;
  fileIds: string[];
}

export interface FileTypeStat {
  type: FileType;
  label: string;
  count: number;
  size: number;
  color: string;
}

export interface StorageOverviewData {
  totalCapacity: number; // in bytes, e.g., 15GB = 16106127360
  usedCapacity: number;
  typeStats: FileTypeStat[];
}

export type ActiveSection = 'dashboard' | 'files' | 'collections' | 'recent' | 'favorites' | 'trash' | 'activity' | 'settings';
