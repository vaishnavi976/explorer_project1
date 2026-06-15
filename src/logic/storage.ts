/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FileItem, FileType, FileTypeStat } from '../types/explorer';

export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function getFileTypeLabel(type: FileType): string {
  const labels: Record<FileType, string> = {
    pdf: 'PDF Documents',
    image: 'Images & Photos',
    sheet: 'Spreadsheets',
    document: 'Text Documents',
    video: 'Videos',
    presentation: 'Presentations',
    archive: 'Archives & ZIPs',
    audio: 'Audio Files',
    other: 'Other Files'
  };
  return labels[type] || 'Other Files';
}

export function getFileTypeColor(type: FileType): string {
  const colors: Record<FileType, string> = {
    pdf: '#EF4444',          // Red
    image: '#10B981',        // Emerald
    sheet: '#059669',        // Green
    document: '#3B82F6',     // Blue
    video: '#8B5CF6',        // Purple
    presentation: '#F59E0B', // Amber
    archive: '#6B7280',      // Gray
    audio: '#EC4899',        // Pink
    other: '#9CA3AF'         // Slate gray
  };
  return colors[type] || '#9CA3AF';
}

export function calculateStorageStats(files: FileItem[]): FileTypeStat[] {
  const fileTypes: FileType[] = ['pdf', 'image', 'sheet', 'document', 'video', 'presentation', 'archive', 'audio', 'other'];
  
  const statsMap = fileTypes.reduce((acc, curr) => {
    acc[curr] = { count: 0, size: 0 };
    return acc;
  }, {} as Record<FileType, { count: number; size: number }>);

  // Exclude files in trash when counting storage used? Yes, or maybe keep track of it. Usually trash counts towards storage but let's count all active (non-trash) files for active categories, and rest goes into other or the total calculation.
  files.forEach(file => {
    if (!file.isTrash) {
      const type = file.type;
      if (statsMap[type]) {
        statsMap[type].count += 1;
        statsMap[type].size += file.size;
      } else {
        statsMap['other'].count += 1;
        statsMap['other'].size += file.size;
      }
    }
  });

  return fileTypes.map(type => ({
    type,
    label: getFileTypeLabel(type),
    count: statsMap[type].count,
    size: statsMap[type].size,
    color: getFileTypeColor(type)
  }));
}

export function saveStateToLocal(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save state to localStorage', err);
  }
}

export function loadStateFromLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error('Failed to load state from localStorage', err);
    return fallback;
  }
}
